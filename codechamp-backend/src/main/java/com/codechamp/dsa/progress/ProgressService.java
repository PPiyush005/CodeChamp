package com.codechamp.dsa.progress;

import com.codechamp.dsa.progress.dto.DashboardStatsResponse;
import com.codechamp.dsa.progress.dto.ProgressResponse;
import com.codechamp.dsa.progress.dto.ProgressUpdateRequest;
import com.codechamp.dsa.question.Question;
import com.codechamp.dsa.question.QuestionRepository;
import com.codechamp.dsa.topic.Topic;
import com.codechamp.dsa.topic.TopicRepository;
import com.codechamp.exception.ResourceNotFoundException;
import com.codechamp.user.User;
import com.codechamp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserQuestionProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;

    // Get currently logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    // Update question progress
    @Transactional
    public ProgressResponse updateProgress(
            Long questionId,
            ProgressUpdateRequest request) {

        User user = getCurrentUser();

        Question question = questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: "
                                        + questionId
                        )
                );

        // Find existing progress or create new one
        UserQuestionProgress progress =
                progressRepository
                        .findByUserIdAndQuestionId(
                                user.getId(), questionId
                        )
                        .orElse(
                                UserQuestionProgress.builder()
                                        .user(user)
                                        .question(question)
                                        .isBookmarked(false)
                                        .build()
                        );

        // Update status
        if (request.getStatus() != null) {
            UserQuestionProgress.Status newStatus =
                    UserQuestionProgress.Status
                            .valueOf(request.getStatus()
                                    .toUpperCase());
            progress.setStatus(newStatus);

            // Set solved time if marking as solved
            if (newStatus ==
                    UserQuestionProgress.Status.SOLVED) {
                progress.setSolvedAt(LocalDateTime.now());
                updateStreak(user);
            }
        }

        // Update notes
        if (request.getNotes() != null) {
            progress.setNotes(request.getNotes());
        }

        progressRepository.save(progress);
        return ProgressResponse.from(progress);
    }

    // Toggle bookmark
    @Transactional
    public ProgressResponse toggleBookmark(Long questionId) {

        User user = getCurrentUser();

        Question question = questionRepository
                .findById(questionId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: "
                                        + questionId
                        )
                );

        UserQuestionProgress progress =
                progressRepository
                        .findByUserIdAndQuestionId(
                                user.getId(), questionId
                        )
                        .orElse(
                                UserQuestionProgress.builder()
                                        .user(user)
                                        .question(question)
                                        .status(
                                                UserQuestionProgress
                                                        .Status.UNSOLVED
                                        )
                                        .isBookmarked(false)
                                        .build()
                        );

        // Toggle bookmark
        progress.setIsBookmarked(
                !Boolean.TRUE.equals(progress.getIsBookmarked())
        );

        progressRepository.save(progress);
        return ProgressResponse.from(progress);
    }

    // Get all progress for current user
    public List<ProgressResponse> getUserProgress() {
        User user = getCurrentUser();
        return progressRepository
                .findByUserId(user.getId())
                .stream()
                .map(ProgressResponse::from)
                .collect(Collectors.toList());
    }

    // Get bookmarks for current user
    public List<ProgressResponse> getBookmarks() {
        User user = getCurrentUser();
        return progressRepository
                .findByUserIdAndIsBookmarkedTrue(user.getId())
                .stream()
                .map(ProgressResponse::from)
                .collect(Collectors.toList());
    }

    // Get revision list for current user
    public List<ProgressResponse> getRevisionList() {
        User user = getCurrentUser();
        return progressRepository
                .findByUserIdAndStatus(
                        user.getId(),
                        UserQuestionProgress.Status.REVISIT
                )
                .stream()
                .map(ProgressResponse::from)
                .collect(Collectors.toList());
    }

    // Get dashboard stats
    public DashboardStatsResponse getDashboardStats() {
        User user = getCurrentUser();
        Long userId = user.getId();

        long totalQuestions =
                questionRepository.count();
        long solvedQuestions =
                progressRepository.countByUserIdAndStatus(
                        userId,
                        UserQuestionProgress.Status.SOLVED
                );
        long revisitQuestions =
                progressRepository.countByUserIdAndStatus(
                        userId,
                        UserQuestionProgress.Status.REVISIT
                );
        long unsolvedQuestions =
                totalQuestions - solvedQuestions;

        double completionPercentage =
                totalQuestions > 0
                        ? Math.round(
                        (solvedQuestions * 100.0
                                / totalQuestions) * 10.0
                ) / 10.0
                        : 0.0;

        // Topic wise progress
        List<Topic> allTopics =
                topicRepository.findAll();

        List<DashboardStatsResponse.TopicProgress>
                topicProgressList = allTopics.stream()
                .map(topic -> {
                    long total = questionRepository
                            .countByTopicId(topic.getId());
                    long solved = progressRepository
                            .countSolvedByTopic(
                                    userId, topic.getId()
                            );
                    double percentage = total > 0
                            ? Math.round(
                            (solved * 100.0 / total) * 10.0
                    ) / 10.0
                            : 0.0;

                    return DashboardStatsResponse
                            .TopicProgress.builder()
                            .topicName(topic.getName())
                            .totalQuestions(total)
                            .solvedQuestions(solved)
                            .percentage(percentage)
                            .build();
                })
                .collect(Collectors.toList());

        return DashboardStatsResponse.builder()
                .totalQuestions(totalQuestions)
                .solvedQuestions(solvedQuestions)
                .unsolvedQuestions(unsolvedQuestions)
                .revisitQuestions(revisitQuestions)
                .completionPercentage(completionPercentage)
                .currentStreak(user.getStreakCount())
                .topicProgressList(topicProgressList)
                .build();
    }

    // Streak calculation logic
    @Transactional
    private void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null) {
            // First time solving
            user.setStreakCount(1);
        } else if (lastActive.equals(
                today.minusDays(1))) {
            // Solved yesterday too — increment streak
            user.setStreakCount(
                    user.getStreakCount() + 1
            );
        } else if (!lastActive.equals(today)) {
            // Gap in solving — reset streak
            user.setStreakCount(1);
        }
        // If lastActive is today — no change

        user.setLastActiveDate(today);
        userRepository.save(user);
    }

    public Map<String, Integer> getHeatmapData() {
        User user = getCurrentUser();
        LocalDateTime startDate = LocalDateTime
                .now()
                .minusDays(365);

        List<Object[]> results = progressRepository
                .findSolveCountsByDate(
                        user.getId(), startDate
                );

        Map<String, Integer> heatmap =
                new LinkedHashMap<>();

        for (Object[] row : results) {
            String date = row[0].toString()
                    .substring(0, 10);
            Integer count = ((Number) row[1]).intValue();
            heatmap.put(date, count);
        }

        return heatmap;
    }
}