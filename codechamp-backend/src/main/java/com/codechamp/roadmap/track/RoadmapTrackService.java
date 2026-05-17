package com.codechamp.roadmap.track;

import com.codechamp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapTrackService {

    private final RoadmapTrackRepository
            roadmapTrackRepository;

    public List<RoadmapTrack> getAllTracks() {
        return roadmapTrackRepository.findAll();
    }

    public RoadmapTrack getTrackById(Long id) {
        return roadmapTrackRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Track not found with id: " + id
                        )
                );
    }
}