export const API_BASE = {
    users: 'http://localhost:8082/api',
    tasks: 'http://localhost:8081/api',
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

    const headers = {
        'Content-Type': 'application/json'
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (currentUser.email) {
        headers['X-User-Email'] = currentUser.email;
    }

    if (currentUser.role) {
        headers['X-User-Role'] = currentUser.role;
    }

    return headers;
};

const handleResponse = async (response) => {
    if (response.status === 401) {
        const error = new Error('Session expired. Please login again.');
        error.status = 401;
        error.isAuthError = true;
        throw error;
    }

    if (!response.ok) {
        let errorMessage;
        const contentType = response.headers.get('content-type');

        try {
            const text = await response.text();
            if (text && contentType && contentType.includes('application/json')) {
                try {
                    const errorData = JSON.parse(text);
                    errorMessage = errorData.message || errorData.error || `HTTP ${response.status}`;
                } catch (e) {
                    errorMessage = text || `HTTP ${response.status}`;
                }
            } else {
                errorMessage = text || `HTTP ${response.status}`;
            }
        } catch (e) {
            errorMessage = `HTTP ${response.status}`;
        }

        const error = new Error(errorMessage);
        error.status = response.status;
        throw error;
    }

    return response;
};

export const api = {
    login: (credentials) => fetch(`${API_BASE.users}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials),
    }).then(r => r.json()),

    getUsers: () => fetch(`${API_BASE.users}/users`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    getUserById: (id) => fetch(`${API_BASE.users}/users/${id}`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    createUser: (data) => fetch(`${API_BASE.users}/auth/register`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    updateUser: (id, data) => fetch(`${API_BASE.users}/users/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    deleteUser: (id) => fetch(`${API_BASE.users}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    getTeams: () => fetch(`${API_BASE.users}/teams`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    createTeam: (data) => fetch(`${API_BASE.users}/teams`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    deleteTeam: (id) => fetch(`${API_BASE.users}/teams/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    getAvailableUsers: () => fetch(`${API_BASE.users}/users/no-team`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(res => res.json()),

    addUserToTeam: (teamId, userId) =>
        fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
            method: 'POST',
            headers: getAuthHeaders()
        }).then(handleResponse),

    updateProfile: (id, data) => fetch(`${API_BASE.users}/users/${id}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse).then(r => r.json()),

    changePassword: (id, data) => fetch(`${API_BASE.users}/users/${id}/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse).then(() => true),

    getUserTaskStats: (email) => fetch(`${API_BASE.tasks}/tasks/stats/user/${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    removeUserFromTeam: (teamId, userId) =>
        fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),

    getTasks: () => fetch(`${API_BASE.tasks}/tasks`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    createTask: async (data) => {
        const response = await fetch(`${API_BASE.tasks}/tasks`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        await handleResponse(response);
        return response.json();
    },

    updateTask: async (id, data) => {
        const response = await fetch(`${API_BASE.tasks}/tasks/${id}`, {
            method: 'PUT',
            headers: getAuthHeaders(),
            body: JSON.stringify(data),
        });

        await handleResponse(response);
        return response.json();
    },

    updateTaskStatus: (id, status) => fetch(`${API_BASE.tasks}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({status}),
    }).then(handleResponse),

    deleteTask: (id) => fetch(`${API_BASE.tasks}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    getProjects: () => fetch(`${API_BASE.tasks}/projects`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    getProjectDetails: (id) => {
        return fetch(`${API_BASE.tasks}/projects/${id}/details`, {
            headers: getAuthHeaders()
        }).then(handleResponse).then(r => r.json());
    },

    createProject: (data) => fetch(`${API_BASE.tasks}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    deleteProject: (id) => fetch(`${API_BASE.tasks}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    getCommentsByTaskId: (taskId) =>
        fetch(`${API_BASE.tasks}/comments/task/${taskId}`, {
            headers: getAuthHeaders()
        }).then(handleResponse).then(r => r.json()),

    createComment: (data) => fetch(`${API_BASE.tasks}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse).then(r => r.json()),

    deleteComment: (id) =>
        fetch(`${API_BASE.tasks}/comments/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        }).then(handleResponse),

    // Task Assignments
    assignUsersToTask: (taskId, userEmails) => fetch(`${API_BASE.tasks}/tasks/${taskId}/assign-users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({userEmails}),
    }).then(handleResponse).then(r => r.json()),

    getTaskAssignments: (taskId) => fetch(`${API_BASE.tasks}/tasks/${taskId}/assignments`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    removeUserFromTask: (taskId, userEmail) => fetch(`${API_BASE.tasks}/tasks/${taskId}/assignments/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    // File Attachments
    uploadFileToTask: (taskId, file, uploadedBy) => {
        const formData = new FormData();
        formData.append('file', file);
        if (uploadedBy) formData.append('uploadedBy', uploadedBy);

        const token = localStorage.getItem('token');
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

        const headers = {};
        if (token) headers['Authorization'] = `Bearer ${token}`;
        if (currentUser.email) headers['X-User-Email'] = currentUser.email;
        if (currentUser.role) headers['X-User-Role'] = currentUser.role;

        return fetch(`${API_BASE.tasks}/attachments/tasks/${taskId}`, {
            method: 'POST',
            headers: headers,
            body: formData,
        }).then(handleResponse).then(r => r.json());
    },

    getTaskAttachments: (taskId) => fetch(`${API_BASE.tasks}/attachments/tasks/${taskId}`, {
        headers: getAuthHeaders()
    }).then(handleResponse).then(r => r.json()),

    downloadAttachment: (attachmentId) => {
        return `${API_BASE.tasks}/attachments/${attachmentId}/download`;
    },

    previewAttachment: (attachmentId) => {
        return `${API_BASE.tasks}/attachments/${attachmentId}/preview`;
    },

    deleteAttachment: (attachmentId) => fetch(`${API_BASE.tasks}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),
};