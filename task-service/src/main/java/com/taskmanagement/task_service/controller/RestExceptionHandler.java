package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.ApiErrorDTO;
import com.taskmanagement.task_service.exception.DeadlineBeforeTodayException;
import com.taskmanagement.task_service.exception.DuplicateTitleException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(DuplicateTitleException.class)
    public ResponseEntity<ApiErrorDTO> handleDuplicateTitle(DuplicateTitleException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiErrorDTO("DUPLICATE_TITLE", exception.getMessage()));
    }

    @ExceptionHandler(DeadlineBeforeTodayException.class)
    public ResponseEntity<ApiErrorDTO> handleDeadline(DeadlineBeforeTodayException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiErrorDTO("INVALID_DEADLINE", ex.getMessage()));
    }
}
