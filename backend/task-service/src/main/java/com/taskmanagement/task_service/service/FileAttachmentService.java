package com.taskmanagement.task_service.service;

import com.taskmanagement.task_service.dto.FileAttachmentDTO;
import com.taskmanagement.task_service.entity.FileAttachment;
import com.taskmanagement.task_service.entity.Task;
import com.taskmanagement.task_service.repository.FileAttachmentRepository;
import com.taskmanagement.task_service.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FileAttachmentService {

    private final FileAttachmentRepository attachmentRepository;
    private final TaskRepository taskRepository;
    private final FileStorageService fileStorageService;

    private static final List<String> IMAGE_TYPES = Arrays.asList(
            "image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"
    );

    @Transactional
    public FileAttachmentDTO uploadFile(Long taskId, MultipartFile file, String uploadedBy) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found with id: " + taskId));

        if (file.isEmpty()) {
            throw new RuntimeException("Cannot upload empty file");
        }

        if (file.getSize() > 10 * 1024 * 1024) {
            throw new RuntimeException("File size exceeds maximum limit of 10MB");
        }

        String storedFileName = fileStorageService.storeFile(file);

        FileAttachment attachment = FileAttachment.builder()
                .task(task)
                .fileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .fileSize(file.getSize())
                .filePath(storedFileName)
                .uploadedBy(uploadedBy)
                .build();

        FileAttachment saved = attachmentRepository.save(attachment);
        System.out.println("File uploaded: " + file.getOriginalFilename() + " for task: " + taskId);

        return toDTO(saved);
    }

    @Transactional(readOnly = true)
    public List<FileAttachmentDTO> getTaskAttachments(Long taskId) {
        return attachmentRepository.findByTaskId(taskId).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public FileAttachment getAttachment(Long id) {
        return attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));
    }

    @Transactional
    public void deleteAttachment(Long id) {
        FileAttachment attachment = attachmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attachment not found with id: " + id));

        fileStorageService.deleteFile(attachment.getFilePath());

        attachmentRepository.delete(attachment);
        System.out.println("Attachment deleted: " + attachment.getFileName());
    }

    private FileAttachmentDTO toDTO(FileAttachment attachment) {
        return FileAttachmentDTO.builder()
                .id(attachment.getId())
                .taskId(attachment.getTask().getId())
                .fileName(attachment.getFileName())
                .fileType(attachment.getFileType())
                .fileSize(attachment.getFileSize())
                .uploadedBy(attachment.getUploadedBy())
                .uploadedAt(attachment.getUploadedAt())
                .downloadUrl("/api/attachments/" + attachment.getId() + "/download")
                .isImage(isImageFile(attachment.getFileType()))
                .build();
    }

    private boolean isImageFile(String fileType) {
        return fileType != null && IMAGE_TYPES.contains(fileType.toLowerCase());
    }
}