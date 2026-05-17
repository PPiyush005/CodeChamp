package com.codechamp.user;

import com.codechamp.dsa.progress.UserQuestionProgress;
import com.codechamp.dsa.progress.UserQuestionProgressRepository;
import com.codechamp.dsa.question.Question;
import com.codechamp.dsa.question.QuestionRepository;
import com.codechamp.dsa.topic.Topic;
import com.codechamp.dsa.topic.TopicRepository;
import com.codechamp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final UserQuestionProgressRepository
            progressRepository;
    private final QuestionRepository questionRepository;
    private final TopicRepository topicRepository;

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

    public ProfileResponse getProfile() {
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

        double completionPercentage =
                totalQuestions > 0
                        ? Math.round(
                        (solvedQuestions * 100.0
                                / totalQuestions) * 10.0
                ) / 10.0
                        : 0.0;

        // Difficulty breakdown
        long easySolved =
                progressRepository.countSolvedByDifficulty(
                        userId, Question.Difficulty.EASY
                );
        long mediumSolved =
                progressRepository.countSolvedByDifficulty(
                        userId, Question.Difficulty.MEDIUM
                );
        long hardSolved =
                progressRepository.countSolvedByDifficulty(
                        userId, Question.Difficulty.HARD
                );

        // Topic mastery
        List<Topic> allTopics =
                topicRepository.findAll();
        List<ProfileResponse.TopicMastery> topicMastery =
                allTopics.stream()
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
                            return ProfileResponse.TopicMastery
                                    .builder()
                                    .topicName(topic.getName())
                                    .totalQuestions(total)
                                    .solvedQuestions(solved)
                                    .percentage(percentage)
                                    .build();
                        })
                        .filter(t -> t.getTotalQuestions() > 0)
                        .collect(Collectors.toList());

        // Recent activity (last 5 solved)
        DateTimeFormatter formatter =
                DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<ProfileResponse.RecentActivity>
                recentActivity = progressRepository
                .findRecentSolved(userId)
                .stream()
                .limit(5)
                .map(p -> ProfileResponse.RecentActivity
                        .builder()
                        .questionTitle(
                                p.getQuestion().getTitle()
                        )
                        .difficulty(
                                p.getQuestion()
                                        .getDifficulty().name()
                        )
                        .topicName(
                                p.getQuestion()
                                        .getTopic().getName()
                        )
                        .status(p.getStatus().name())
                        .solvedAt(
                                p.getSolvedAt() != null
                                        ? p.getSolvedAt()
                                        .format(formatter)
                                        : "N/A"
                        )
                        .build()
                )
                .collect(Collectors.toList());

        return ProfileResponse.builder()
                .name(user.getName())
                .email(user.getEmail())
                .joinedAt(user.getCreatedAt())
                .currentStreak(
                        user.getStreakCount() != null
                                ? user.getStreakCount() : 0
                )
                .totalQuestions(totalQuestions)
                .solvedQuestions(solvedQuestions)
                .revisitQuestions(revisitQuestions)
                .completionPercentage(
                        completionPercentage
                )
                .easySolved(easySolved)
                .mediumSolved(mediumSolved)
                .hardSolved(hardSolved)
                .topicMastery(topicMastery)
                .recentActivity(recentActivity)
                .build();
    }
}