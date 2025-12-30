package com.taskmanagement.task_service.client;

import com.taskmanagement.task_service.dto.UserDTO;
import jakarta.validation.constraints.Email;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "user-service", url = "http://localhost:8082/api/users")
public interface UserClient  {

    @GetMapping("/{id}")
    UserDTO getUserById(@PathVariable("id") Long id);

    @GetMapping("/email/{email}")
    UserDTO getUserByEmail(@Email(message = "Invalid email") @PathVariable("email") String assignedToEmail);
}
