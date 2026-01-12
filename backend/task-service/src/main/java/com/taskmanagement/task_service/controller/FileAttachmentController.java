package com.taskmanagement.task_service.controller;

import com.taskmanagement.task_service.dto.FileAttachmentDTO;
import com.taskmanagement.task_service.entity.FileAttachment;
import com.taskmanagement.task_service.service.FileAttachmentService;
import com.taskmanagement.task_service.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/attachments")
@RequiredArgsConstructor
public class FileAttachmentController {

    private final FileAttachmentService attachmentService;
    private final FileStorageService fileStorageService;

    @PostMapping("/tasks/{taskId}")
    public ResponseEntity<FileAttachmentDTO> uploadFile(
            @PathVariable Long taskId,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "uploadedBy", required = false) String uploadedBy) {

        FileAttachmentDTO attachment = attachmentService.uploadFile(taskId, file, uploadedBy);
        return ResponseEntity.status(HttpStatus.CREATED).body(attachment);
    }

    @GetMapping("/tasks/{taskId}")
    public ResponseEntity<List<FileAttachmentDTO>> getTaskAttachments(@PathVariable Long taskId) {
        return ResponseEntity.ok(attachmentService.getTaskAttachments(taskId));
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        FileAttachment attachment = attachmentService.getAttachment(id);
        Resource resource = fileStorageService.loadFileAsResource(attachment.getFilePath());

        String contentType = attachment.getFileType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/{id}/preview")
    public ResponseEntity<Resource> previewFile(@PathVariable Long id) {
        FileAttachment attachment = attachmentService.getAttachment(id);
        Resource resource = fileStorageService.loadFileAsResource(attachment.getFilePath());

        String contentType = attachment.getFileType();
        if (contentType == null) {
            contentType = "application/octet-stream";
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline")
                .body(resource);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAttachment(@PathVariable Long id) {
        attachmentService.deleteAttachment(id);
        return ResponseEntity.noContent().build();
    }
}