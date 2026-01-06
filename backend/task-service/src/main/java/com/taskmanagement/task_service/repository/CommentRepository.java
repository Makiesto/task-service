package com.taskmanagement.task_service.repository;

import com.taskmanagement.task_service.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByTaskId(Long taskId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Comment c WHERE c.userId = :userId")
    void deleteByUserId(Long userId);
}
