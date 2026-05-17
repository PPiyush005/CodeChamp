package com.codechamp.dsa.progress.dto;

import com.codechamp.dsa.progress.UserQuestionProgress;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProgressResponse {

    private Long id;
    private Long questionId;
    private String questionTitle;
    private String difficulty;
    private String topicName;
    private String leetcodeUrl;
    private String status;
    private String notes;
    private Boolean isBookmarked;
    private LocalDateTime solvedAt;

    public static ProgressResponse from(
            UserQuestionProgress p) {
        return ProgressResponse.builder()
                .id(p.getId())
                .questionId(p.getQuestion().getId())
                .questionTitle(p.getQuestion().getTitle())
                .difficulty(p.getQuestion()
                        .getDifficulty().name())
                .topicName(p.getQuestion()
                        .getTopic().getName())
                .leetcodeUrl(p.getQuestion()
                        .getLeetcodeUrl())
                .status(p.getStatus().name())
                .notes(p.getNotes())
                .isBookmarked(p.getIsBookmarked())
                .solvedAt(p.getSolvedAt())
                .build();
    }
}