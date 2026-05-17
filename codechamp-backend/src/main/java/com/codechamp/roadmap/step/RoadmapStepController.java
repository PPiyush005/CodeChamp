package com.codechamp.roadmap.step;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmap")
@RequiredArgsConstructor
public class RoadmapStepController {

    private final RoadmapStepService roadmapStepService;

    @GetMapping("/tracks/{trackId}/steps")
    public ResponseEntity<List<RoadmapStep>>
    getStepsByTrack(@PathVariable Long trackId) {
        return ResponseEntity.ok(
                roadmapStepService.getStepsByTrack(trackId)
        );
    }
}