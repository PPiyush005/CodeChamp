package com.codechamp.user;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProfileResponse {

    // Basic info
    private String name;
    private String email;
    private LocalDateTime joinedAt;
    private int currentStreak;

    // Overall stats
    private long totalQuestions;
    private long solvedQuestions;
    private long revisitQuestions;
    private double completionPercentage;

    // Difficulty breakdown
    private long easySolved;
    private long mediumSolved;
    private long hardSolved;

    // Topic mastery
    private List<TopicMastery> topicMastery;

    // Recent activity
    private List<RecentActivity> recentActivity;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopicMastery {
        private String topicName;
        private long totalQuestions;
        private long solvedQuestions;
        private double percentage;
    }

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class RecentActivity {
        private String questionTitle;
        private String difficulty;
        private String topicName;
        private String status;
        private String solvedAt;
    }
}