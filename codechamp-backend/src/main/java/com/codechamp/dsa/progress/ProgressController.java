package com.codechamp.dsa.progress;

import com.codechamp.dsa.progress.dto.DashboardStatsResponse;
import com.codechamp.dsa.progress.dto.ProgressResponse;
import com.codechamp.dsa.progress.dto.ProgressUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    // Get dashboard stats
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsResponse>
    getDashboard() {
        return ResponseEntity.ok(
                progressService.getDashboardStats()
        );
    }

    // Get all progress for current user
    @GetMapping("/questions")
    public ResponseEntity<List<ProgressResponse>>
    getUserProgress() {
        return ResponseEntity.ok(
                progressService.getUserProgress()
        );
    }

    // Update progress for a question
    @PutMapping("/questions/{questionId}")
    public ResponseEntity<ProgressResponse>
    updateProgress(
            @PathVariable Long questionId,
            @RequestBody ProgressUpdateRequest request
    ) {
        return ResponseEntity.ok(
                progressService.updateProgress(
                        questionId, request
                )
        );
    }

    // Toggle bookmark
    @PutMapping("/questions/{questionId}/bookmark")
    public ResponseEntity<ProgressResponse>
    toggleBookmark(
            @PathVariable Long questionId
    ) {
        return ResponseEntity.ok(
                progressService.toggleBookmark(questionId)
        );
    }

    // Get bookmarked questions
    @GetMapping("/bookmarks")
    public ResponseEntity<List<ProgressResponse>>
    getBookmarks() {
        return ResponseEntity.ok(
                progressService.getBookmarks()
        );
    }

    // Get revision list
    @GetMapping("/revision")
    public ResponseEntity<List<ProgressResponse>>
    getRevisionList() {
        return ResponseEntity.ok(
                progressService.getRevisionList()
        );
    }

    @GetMapping("/heatmap")
    public ResponseEntity<Map<String, Integer>>
    getHeatmap() {
        return ResponseEntity.ok(
                progressService.getHeatmapData()
        );
    }

    @GetMapping("/daily-test")
    public ResponseEntity<List<com.codechamp.dsa.question.QuestionDTO>>
    getDailyTest() {
        return ResponseEntity.ok(
                progressService.getDailyTestQuestions()
        );
    }

    @GetMapping("/mcq-questions")
    public ResponseEntity<List<com.codechamp.dsa.question.QuestionDTO>>
    getMCQQuestions() {
        return ResponseEntity.ok(
                progressService.getMCQQuestions()
        );
    }
}