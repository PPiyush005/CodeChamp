package com.codechamp.roadmap.step;

import com.codechamp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RoadmapStepService {

    private final RoadmapStepRepository
            roadmapStepRepository;

    public List<RoadmapStep> getStepsByTrack(
            Long trackId) {
        return roadmapStepRepository
                .findByTrackIdOrderByStepOrderAsc(trackId);
    }

    public RoadmapStep getStepById(Long id) {
        return roadmapStepRepository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Step not found with id: " + id
                        )
                );
    }
}