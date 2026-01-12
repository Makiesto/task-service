package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment, Long> {
    List<FileAttachment> findByTaskId(Long taskId);
    void deleteByTaskId(Long taskId);
}
