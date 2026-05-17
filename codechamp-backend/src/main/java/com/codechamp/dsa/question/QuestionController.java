package com.codechamp.dsa.question;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping
    public ResponseEntity<List<QuestionDTO>> getAllQuestions(
            @RequestParam(required = false) String topic,
            @RequestParam(required = false) String difficulty,
            @RequestParam(required = false) String pattern,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String blind75) {
        return ResponseEntity.ok(
                questionService.getAllQuestions(
                        topic, difficulty, pattern, search, blind75
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionDTO> getQuestionById(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                questionService.getQuestionById(id)
        );
    }

    @GetMapping("/topic/{topicId}")
    public ResponseEntity<List<QuestionDTO>> getByTopic(
            @PathVariable Long topicId) {
        return ResponseEntity.ok(
                questionService.getQuestionsByTopic(topicId)
        );
    }

    @GetMapping("/blind75")
    public ResponseEntity<List<QuestionDTO>> getBlind75() {
        return ResponseEntity.ok(
                questionService.getBlind75Questions()
        );
    }
}