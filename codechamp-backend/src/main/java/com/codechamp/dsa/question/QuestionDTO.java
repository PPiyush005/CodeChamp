package com.codechamp.dsa.question;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionDTO {

    private Long id;
    private String title;
    private String difficulty;
    private String topicName;
    private String patternName;
    private String leetcodeUrl;
    private Boolean isBlind75;

    public static QuestionDTO from(Question question) {
        return QuestionDTO.builder()
                .id(question.getId())
                .title(question.getTitle())
                .difficulty(question.getDifficulty().name())
                .topicName(question.getTopic().getName())
                .patternName(question.getPattern() != null
                        ? question.getPattern().getName()
                        : null)
                .leetcodeUrl(question.getLeetcodeUrl())
                .isBlind75(question.getIsBlind75())
                .build();
    }
}