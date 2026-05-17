package com.codechamp.roadmap.step;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RoadmapStepRepository
        extends JpaRepository<RoadmapStep, Long> {

    List<RoadmapStep> findByTrackIdOrderByStepOrderAsc(
            Long trackId
    );
}