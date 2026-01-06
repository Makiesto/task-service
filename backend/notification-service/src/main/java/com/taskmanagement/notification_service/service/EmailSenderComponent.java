package com.taskmanagement.notification_service.service;

import com.taskmanagement.notification_service.entity.Notification;
import io.github.resilience4j.ratelimiter.annotation.RateLimiter;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class EmailSenderComponent {

    private final JavaMailSender mailSender;

    @RateLimiter(name = "mailtrapLimiter")
    public void sendSingleEmail(Notification notification) {
        SimpleMailMessage mailMessage = new SimpleMailMessage();
        mailMessage.setTo(notification.getRecipientEmail());
        mailMessage.setSubject("Notification update");
        mailMessage.setText(notification.getMessage());
        mailMessage.setFrom("notification@tasksystem.com");

        mailSender.send(mailMessage);

        notification.setSentAt(LocalDateTime.now());
    }
}