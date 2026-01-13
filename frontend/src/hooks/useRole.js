import {useMemo} from 'react';

export function useRole() {
    const currentUser = useMemo(() => {
        try {
            return JSON.parse(localStorage.getItem('currentUser') || '{}');
        } catch {
            return {};
        }
    }, []);

    const role = currentUser.role || 'DEVELOPER';

    const isAdmin = role === 'ADMIN';
    const isManager = role === 'MANAGER';
    const isDeveloper = role === 'DEVELOPER';

    const canCreateProject = isAdmin || isManager;
    const canDeleteProject = isAdmin;
    const canCreateTask = isAdmin || isManager;
    const canDeleteTask = isAdmin || isManager;
    const canAssignUsers = isAdmin || isManager;
    const canDeleteAttachment = isAdmin || isManager;

    const canEditTask = (task) => {
        if (isAdmin || isManager) return true;
        if (isDeveloper && task.assignedToEmail === currentUser.email) return true;
        return false;
    };

    const canUpdateTaskStatus = (task) => {
        if (isAdmin || isManager) return true;
        if (isDeveloper && task.assignedToEmail === currentUser.email) return true;
        return false;
    };

    return {
        role,
        isAdmin,
        isManager,
        isDeveloper,
        canCreateProject,
        canDeleteProject,
        canCreateTask,
        canDeleteTask,
        canAssignUsers,
        canDeleteAttachment,
        canEditTask,
        canUpdateTaskStatus,
        currentUser
    };
}