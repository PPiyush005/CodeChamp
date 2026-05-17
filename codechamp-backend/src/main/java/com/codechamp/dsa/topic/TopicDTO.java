package com.codechamp.dsa.topic;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class TopicDTO {

    private Long id;
    private String name;
    private String description;
    private String iconUrl;
    private long totalQuestions;

    public static TopicDTO from(Topic topic, long totalQuestions) {
        return TopicDTO.builder()
                .id(topic.getId())
                .name(topic.getName())
                .description(topic.getDescription())
                .iconUrl(topic.getIconUrl())
                .totalQuestions(totalQuestions)
                .build();
    }
}