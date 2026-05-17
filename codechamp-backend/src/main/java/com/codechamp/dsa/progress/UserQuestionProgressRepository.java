package com.codechamp.dsa.progress;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserQuestionProgressRepository
        extends JpaRepository<UserQuestionProgress, Long> {

    Optional<UserQuestionProgress> findByUserIdAndQuestionId(
            Long userId, Long questionId
    );

    List<UserQuestionProgress> findByUserId(Long userId);

    List<UserQuestionProgress> findByUserIdAndIsBookmarkedTrue(
            Long userId
    );

    List<UserQuestionProgress> findByUserIdAndStatus(
            Long userId, UserQuestionProgress.Status status
    );

    long countByUserIdAndStatus(
            Long userId, UserQuestionProgress.Status status
    );

    @Query("SELECT COUNT(p) FROM UserQuestionProgress p " +
            "WHERE p.user.id = :userId " +
            "AND p.question.topic.id = :topicId " +
            "AND p.status = 'SOLVED'")
    long countSolvedByTopic(
            @Param("userId") Long userId,
            @Param("topicId") Long topicId
    );

    boolean existsByUserIdAndQuestionId(
            Long userId, Long questionId
    );

    // Count solved by difficulty
    @Query("SELECT COUNT(p) FROM UserQuestionProgress p " +
            "WHERE p.user.id = :userId " +
            "AND p.status = 'SOLVED' " +
            "AND p.question.difficulty = :difficulty")
    long countSolvedByDifficulty(
            @Param("userId") Long userId,
            @Param("difficulty") com.codechamp.dsa.question
                    .Question.Difficulty difficulty
    );

    // Get recent solved questions
    @Query("SELECT p FROM UserQuestionProgress p " +
            "WHERE p.user.id = :userId " +
            "AND p.status = 'SOLVED' " +
            "ORDER BY p.solvedAt DESC")
    List<UserQuestionProgress> findRecentSolved(
            @Param("userId") Long userId
    );

    @Query("SELECT DATE(p.solvedAt) as solveDate, " +
            "COUNT(p) as count " +
            "FROM UserQuestionProgress p " +
            "WHERE p.user.id = :userId " +
            "AND p.status = 'SOLVED' " +
            "AND p.solvedAt >= :startDate " +
            "GROUP BY DATE(p.solvedAt)")
    List<Object[]> findSolveCountsByDate(
            @Param("userId") Long userId,
            @Param("startDate") LocalDateTime startDate
    );
}