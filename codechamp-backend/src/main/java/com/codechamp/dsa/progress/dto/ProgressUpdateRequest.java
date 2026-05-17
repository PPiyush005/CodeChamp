package com.codechamp.dsa.progress.dto;

import lombok.Data;

@Data
public class ProgressUpdateRequest {

    private String status; // UNSOLVED, SOLVED, REVISIT
    private String notes;
}