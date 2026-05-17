package com.codechamp.roadmap.progress;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RoadmapProgressResponse {

    private Long trackId;
    private String trackName;
    private String description;
    private Integer estimatedWeeks;
    private long totalSteps;
    private long completedSteps;
    private double progressPercentage;
    private List<StepProgressDTO> steps;

    @Data
    @Builder
    @AllArgsConstructor
    @NoArgsConstructor
    public static class StepProgressDTO {
        private Long stepId;
        private String title;
        private String description;
        private String phase;
        private Integer stepOrder;
        private String resourceUrl;
        private boolean isCompleted;
    }
}