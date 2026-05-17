package com.codechamp.dsa.progress;

import com.codechamp.dsa.question.Question;
import com.codechamp.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_question_progress",
        uniqueConstraints = @UniqueConstraint(
                columnNames = {"user_id", "question_id"}
        ))
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserQuestionProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.UNSOLVED;

    @Column(name = "solved_at")
    private LocalDateTime solvedAt;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_bookmarked")
    private Boolean isBookmarked = false;

    public enum Status {
        UNSOLVED, SOLVED, REVISIT
    }
}