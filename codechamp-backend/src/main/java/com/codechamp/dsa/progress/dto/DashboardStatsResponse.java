package com.codechamp.dsa.progress.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class DashboardStatsResponse {

    // Overall stats
    private long totalQuestions;
    private long solvedQuestions;
    private long unsolvedQuestions;
    private long revisitQuestions;
    private double completionPercentage;

    // Difficulty breakdown
    private long easySolved;
    private long mediumSolved;
    private long hardSolved;

    // Streak
    private int currentStreak;

    // Topic wise progress
    private List<TopicProgress> topicProgressList;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class TopicProgress {
        private String topicName;
        private long totalQuestions;
        private long solvedQuestions;
        private double percentage;
    }
}