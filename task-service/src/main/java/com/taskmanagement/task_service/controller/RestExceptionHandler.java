package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.ApiError;
import com.taskmanagement.task_service.exception.DeadlineBeforeTodayException;
import com.taskmanagement.task_service.exception.DuplicateTitleException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class RestExceptionHandler {
    @ExceptionHandler(DuplicateTitleException.class)
    public ResponseEntity<ApiError> handleDuplicateTitle(DuplicateTitleException exception) {
        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(new ApiError("DUPLICATE_TITLE", exception.getMessage()));
    }

    @ExceptionHandler(DeadlineBeforeTodayException.class)
    public ResponseEntity<ApiError> handleDeadline(DeadlineBeforeTodayException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ApiError("INVALID_DEADLINE", ex.getMessage()));
    }
}
