package com.taskmanagement.task_service.exception;

public class DeadlineBeforeTodayException extends RuntimeException {
    public DeadlineBeforeTodayException(String message) {

        super(message);
    }
}
