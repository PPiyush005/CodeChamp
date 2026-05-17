package com.codechamp.roadmap.progress;

import com.codechamp.exception.ResourceNotFoundException;
import com.codechamp.roadmap.step.RoadmapStep;
import com.codechamp.roadmap.step.RoadmapStepRepository;
import com.codechamp.roadmap.track.RoadmapTrack;
import com.codechamp.roadmap.track.RoadmapTrackRepository;
import com.codechamp.user.User;
import com.codechamp.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context
        .SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation
        .Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RoadmapProgressService {

    private final UserRoadmapProgressRepository
            progressRepository;
    private final RoadmapTrackRepository
            trackRepository;
    private final RoadmapStepRepository
            stepRepository;
    private final UserRepository userRepository;

    // Get currently logged in user
    private User getCurrentUser() {
        String email = SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );
    }

    // Get user progress for a specific track
    public RoadmapProgressResponse getTrackProgress(
            Long trackId) {

        User user = getCurrentUser();

        RoadmapTrack track = trackRepository
                .findById(trackId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Track not found with id: " + trackId
                        )
                );

        List<RoadmapStep> allSteps = stepRepository
                .findByTrackIdOrderByStepOrderAsc(trackId);

        List<UserRoadmapProgress> userProgress =
                progressRepository
                        .findByUserIdAndTrackId(
                                user.getId(), trackId
                        );

        // Map step id to completion status
        List<RoadmapProgressResponse.StepProgressDTO>
                stepDTOs = allSteps.stream()
                .map(step -> {
                    boolean completed = userProgress
                            .stream()
                            .anyMatch(p ->
                                    p.getStep().getId()
                                            .equals(step.getId())
                                            && Boolean.TRUE.equals(
                                            p.getIsCompleted())
                            );

                    return RoadmapProgressResponse
                            .StepProgressDTO.builder()
                            .stepId(step.getId())
                            .title(step.getTitle())
                            .description(step.getDescription())
                            .phase(step.getPhase())
                            .stepOrder(step.getStepOrder())
                            .resourceUrl(step.getResourceUrl())
                            .isCompleted(completed)
                            .build();
                })
                .collect(Collectors.toList());

        long totalSteps = allSteps.size();
        long completedSteps = stepDTOs.stream()
                .filter(RoadmapProgressResponse
                        .StepProgressDTO::isCompleted)
                .count();

        double percentage = totalSteps > 0
                ? Math.round(
                (completedSteps * 100.0 / totalSteps)
                        * 10.0) / 10.0
                : 0.0;

        return RoadmapProgressResponse.builder()
                .trackId(track.getId())
                .trackName(track.getName())
                .description(track.getDescription())
                .estimatedWeeks(track.getEstimatedWeeks())
                .totalSteps(totalSteps)
                .completedSteps(completedSteps)
                .progressPercentage(percentage)
                .steps(stepDTOs)
                .build();
    }

    // Get progress for all tracks
    public List<RoadmapProgressResponse>
    getAllTracksProgress() {
        List<RoadmapTrack> allTracks =
                trackRepository.findAll();
        return allTracks.stream()
                .map(track ->
                        getTrackProgress(track.getId())
                )
                .collect(Collectors.toList());
    }

    // Mark a step as complete or incomplete
    @Transactional
    public RoadmapProgressResponse.StepProgressDTO
    toggleStepComplete(Long stepId) {

        User user = getCurrentUser();

        RoadmapStep step = stepRepository
                .findById(stepId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Step not found with id: " + stepId
                        )
                );

        Optional<UserRoadmapProgress> existing =
                progressRepository
                        .findByUserIdAndStepId(
                                user.getId(), stepId
                        );

        UserRoadmapProgress progress;

        if (existing.isPresent()) {
            progress = existing.get();
            // Toggle completion
            boolean newStatus = !Boolean.TRUE.equals(
                    progress.getIsCompleted()
            );
            progress.setIsCompleted(newStatus);
            progress.setCompletedAt(
                    newStatus ? LocalDateTime.now() : null
            );
        } else {
            progress = UserRoadmapProgress.builder()
                    .user(user)
                    .track(step.getTrack())
                    .step(step)
                    .isCompleted(true)
                    .completedAt(LocalDateTime.now())
                    .build();
        }

        progressRepository.save(progress);

        return RoadmapProgressResponse
                .StepProgressDTO.builder()
                .stepId(step.getId())
                .title(step.getTitle())
                .description(step.getDescription())
                .phase(step.getPhase())
                .stepOrder(step.getStepOrder())
                .resourceUrl(step.getResourceUrl())
                .isCompleted(Boolean.TRUE.equals(
                        progress.getIsCompleted())
                )
                .build();
    }
}