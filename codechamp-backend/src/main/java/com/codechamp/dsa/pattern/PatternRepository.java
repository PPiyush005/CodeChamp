package com.codechamp.dsa.pattern;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatternRepository
        extends JpaRepository<Pattern, Long> {

    Optional<Pattern> findByNameIgnoreCase(String name);
    boolean existsByNameIgnoreCase(String name);
}