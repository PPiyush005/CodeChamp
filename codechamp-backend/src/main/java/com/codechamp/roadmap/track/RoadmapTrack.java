package com.codechamp.roadmap.track;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "roadmap_tracks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoadmapTrack {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "estimated_weeks")
    private Integer estimatedWeeks;

    @Column(name = "icon_url")
    private String iconUrl;
}