package com.codechamp.dsa.question;

import com.codechamp.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;

    public List<QuestionDTO> getAllQuestions(
            String topic,
            String difficulty,
            String pattern,
            String search,
            String blind75) {

        List<Question> questions;

        if (blind75 != null && blind75.equals("true")) {
            questions = questionRepository
                    .findByIsBlind75True();

        } else if (search != null && !search.isEmpty()) {
            questions = questionRepository
                    .searchByTitle(search);

        } else if (topic != null && !topic.isEmpty()) {
            questions = questionRepository
                    .findByTopicName(topic);

        } else if (difficulty != null
                && !difficulty.isEmpty()) {
            questions = questionRepository
                    .findByDifficulty(
                            Question.Difficulty
                                    .valueOf(difficulty.toUpperCase())
                    );

        } else if (pattern != null && !pattern.isEmpty()) {
            questions = questionRepository
                    .findByPatternName(pattern);

        } else {
            questions = questionRepository.findAll();
        }

        return questions.stream()
                .map(QuestionDTO::from)
                .collect(Collectors.toList());
    }

    public QuestionDTO getQuestionById(Long id) {
        Question question = questionRepository
                .findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Question not found with id: " + id
                        )
                );
        return QuestionDTO.from(question);
    }

    public List<QuestionDTO> getQuestionsByTopic(
            Long topicId) {
        return questionRepository
                .findByTopicId(topicId)
                .stream()
                .map(QuestionDTO::from)
                .collect(Collectors.toList());
    }

    public List<QuestionDTO> getBlind75Questions() {
        return questionRepository
                .findByIsBlind75True()
                .stream()
                .map(QuestionDTO::from)
                .collect(Collectors.toList());
    }
}