package com.codechamp.roadmap.track;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoadmapTrackRepository
        extends JpaRepository<RoadmapTrack, Long> {
}