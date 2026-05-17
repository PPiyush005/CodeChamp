package com.codechamp.roadmap.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoadmapProgressRepository
        extends JpaRepository<UserRoadmapProgress, Long> {

    // Find progress for specific user and step
    Optional<UserRoadmapProgress>
    findByUserIdAndStepId(
            Long userId, Long stepId
    );

    // Get all progress for user on a track
    List<UserRoadmapProgress>
    findByUserIdAndTrackId(
            Long userId, Long trackId
    );

    // Get all progress for user
    List<UserRoadmapProgress> findByUserId(Long userId);

    // Count completed steps for user on a track
    @Query("SELECT COUNT(p) FROM " +
            "UserRoadmapProgress p " +
            "WHERE p.user.id = :userId " +
            "AND p.track.id = :trackId " +
            "AND p.isCompleted = true")
    long countCompletedSteps(
            @Param("userId") Long userId,
            @Param("trackId") Long trackId
    );
}