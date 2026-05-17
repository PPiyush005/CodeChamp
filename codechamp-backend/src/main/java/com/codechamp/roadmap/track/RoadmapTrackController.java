package com.codechamp.roadmap.track;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/roadmap/tracks")
@RequiredArgsConstructor
public class RoadmapTrackController {

    private final RoadmapTrackService roadmapTrackService;

    @GetMapping
    public ResponseEntity<List<RoadmapTrack>>
    getAllTracks() {
        return ResponseEntity.ok(
                roadmapTrackService.getAllTracks()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoadmapTrack>
    getTrackById(@PathVariable Long id) {
        return ResponseEntity.ok(
                roadmapTrackService.getTrackById(id)
        );
    }
}