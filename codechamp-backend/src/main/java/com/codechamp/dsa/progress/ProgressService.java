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
import com.codechamp.dsa.question.QuestionDTO;
import com.codechamp.dsa.question.Question.Difficulty;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import java.util.LinkedHashMap;
import java.util.Map;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collections;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final UserQuestionProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;

    // Get currently logged-in user
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

        // Find existing or create new with UNSOLVED status
        UserQuestionProgress progress =
                progressRepository
                        .findByUserIdAndQuestionId(
                                user.getId(), questionId
                        )
                        .orElseGet(() -> {
                            UserQuestionProgress newProgress =
                                    new UserQuestionProgress();
                            newProgress.setUser(user);
                            newProgress.setQuestion(question);
                            newProgress.setStatus(
                                    UserQuestionProgress.Status.UNSOLVED
                            );
                            newProgress.setIsBookmarked(false);
                            return newProgress;
                        });

        // Update status only if provided
        if (request.getStatus() != null
                && !request.getStatus().isEmpty()) {
            try {
                UserQuestionProgress.Status newStatus =
                        UserQuestionProgress.Status
                                .valueOf(request.getStatus()
                                        .toUpperCase());

                if (newStatus ==
                        UserQuestionProgress.Status.SOLVED
                        && progress.getStatus() !=
                        UserQuestionProgress.Status.SOLVED) {
                    progress.setSolvedAt(
                            LocalDateTime.now()
                    );
                    updateStreak(user);
                }
                progress.setStatus(newStatus);

            } catch (IllegalArgumentException e) {
                // Invalid status value — ignore
            }
        }

        // Ensure status is never null before saving
        if (progress.getStatus() == null) {
            progress.setStatus(
                    UserQuestionProgress.Status.UNSOLVED
            );
        }

        // Update notes if provided
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

    public List<QuestionDTO> getDailyTestQuestions() {
        // Use today's date as seed so same questions
        // appear all day and change at midnight
        long seed = LocalDate.now().toEpochDay();
        java.util.Random random = new java.util.Random(seed);

        List<com.codechamp.dsa.question.Question> easy =
                questionRepository.findByDifficulty(Difficulty.EASY);
        List<com.codechamp.dsa.question.Question> medium =
                questionRepository.findByDifficulty(Difficulty.MEDIUM);
        List<com.codechamp.dsa.question.Question> hard =
                questionRepository.findByDifficulty(Difficulty.HARD);

        Collections.shuffle(easy, random);
        Collections.shuffle(medium, random);
        Collections.shuffle(hard, random);

        List<com.codechamp.dsa.question.Question> daily =
                new ArrayList<>();
        if (easy.size() >= 2) daily.addAll(easy.subList(0, 2));
        if (medium.size() >= 2) daily.addAll(medium.subList(0, 2));
        if (hard.size() >= 1) daily.addAll(hard.subList(0, 1));

        Collections.shuffle(daily, random);

        return daily.stream()
                .map(QuestionDTO::from)
                .collect(java.util.stream.Collectors.toList());
    }

    public List<QuestionDTO> getMCQQuestions() {
        long seed = LocalDate.now().toEpochDay() + 1000;
        java.util.Random random = new java.util.Random(seed);

        List<com.codechamp.dsa.question.Question> all =
                questionRepository.findAll();

        Collections.shuffle(all, random);

        return all.stream()
                .limit(10)
                .map(QuestionDTO::from)
                .collect(java.util.stream.Collectors.toList());
    }
}