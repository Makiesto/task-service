package com.taskmanagement.task_service.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Arrays;

@Component
public class RBACInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            return true;
        }

        if (!(handler instanceof HandlerMethod)) {
            return true;
        }

        HandlerMethod handlerMethod = (HandlerMethod) handler;
        RequireRole requireRole = handlerMethod.getMethodAnnotation(RequireRole.class);

        if (requireRole == null) {
            return true;
        }

        String userRole = request.getHeader("X-User-Role");

        System.out.println("=== RBAC Check ===");
        System.out.println("Endpoint: " + request.getRequestURI());
        System.out.println("Method: " + request.getMethod());
        System.out.println("Required roles: " + Arrays.toString(requireRole.value()));
        System.out.println("User role from header: " + userRole);

        if (userRole == null || userRole.isEmpty()) {
            System.out.println("DENIED: No role header found");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Authentication required\"}");
            return false;
        }

        boolean hasPermission = Arrays.asList(requireRole.value()).contains(userRole);

        if (!hasPermission) {
            System.out.println("DENIED: User role '" + userRole + "' not in required roles");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.getWriter().write("{\"error\": \"Access denied. Required role: " +
                String.join(" or ", requireRole.value()) + ". Your role: " + userRole + "\"}");
            return false;
        }

        System.out.println("ALLOWED: User has required role");
        return true;
    }
}