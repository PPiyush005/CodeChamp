package com.codechamp.dsa.question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    List<Question> findByTopicId(Long topicId);

    List<Question> findByDifficulty(
            Question.Difficulty difficulty
    );

    List<Question> findByPatternId(Long patternId);

    @Query("SELECT q FROM Question q " +
            "WHERE LOWER(q.topic.name) = LOWER(:topicName)")
    List<Question> findByTopicName(
            @Param("topicName") String topicName
    );

    @Query("SELECT q FROM Question q " +
            "WHERE LOWER(q.pattern.name) = LOWER(:patternName)")
    List<Question> findByPatternName(
            @Param("patternName") String patternName
    );

    @Query("SELECT q FROM Question q " +
            "WHERE LOWER(q.title) LIKE LOWER(" +
            "CONCAT('%', :keyword, '%'))")
    List<Question> searchByTitle(
            @Param("keyword") String keyword
    );

    long countByTopicId(Long topicId);

    List<Question> findByIsBlind75True();
}