package com.codechamp.roadmap.progress;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmap")
@RequiredArgsConstructor
public class RoadmapProgressController {

    private final RoadmapProgressService roadmapProgressService;

    @GetMapping("/my-progress")
    public ResponseEntity<List<RoadmapProgressResponse>> getAllTracksProgress() {
        return ResponseEntity.ok(
                roadmapProgressService.getAllTracksProgress()
        );
    }

    @GetMapping("/tracks/{trackId}/progress")
    public ResponseEntity<RoadmapProgressResponse> getTrackProgress(
            @PathVariable Long trackId) {
        return ResponseEntity.ok(
                roadmapProgressService.getTrackProgress(trackId)
        );
    }

    @PutMapping("/steps/{stepId}/complete")
    public ResponseEntity<RoadmapProgressResponse.StepProgressDTO> toggleStepComplete(
            @PathVariable Long stepId) {
        return ResponseEntity.ok(
                roadmapProgressService.toggleStepComplete(stepId)
        );
    }
}