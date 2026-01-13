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

export const api = {
    login: (credentials) => fetch(`${API_BASE.users}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials),
    }).then(r => r.json()),

    getUsers: () => fetch(`${API_BASE.users}/users`, {
        headers: getAuthHeaders()
    }).then(r => {
        if (r.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/';
            throw new Error('Unauthorized');
        }
        return r.json();
    }),
    getUserById: (id) => fetch(`${API_BASE.users}/users/${id}`).then(r => r.json()),
    createUser: (data) => fetch(`${API_BASE.users}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }),
    updateUser: (id, data) => fetch(`${API_BASE.users}/users/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }),
    deleteUser: (id) => fetch(`${API_BASE.users}/users/${id}`, {method: 'DELETE'}),

    getTeams: () => fetch(`${API_BASE.users}/teams`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),

    createTeam: (data) => fetch(`${API_BASE.users}/teams`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }),
    deleteTeam: (id) => fetch(`${API_BASE.users}/teams/${id}`, {method: 'DELETE'}),

    getAvailableUsers: () =>
        fetch(`${API_BASE.users}/users/no-team`).then(res => res.json()),

    addUserToTeam: (teamId, userId) =>
        fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
            method: 'POST'
        }),

    updateProfile: (id, data) => fetch(`${API_BASE.users}/users/${id}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(r => r.json()),

    changePassword: (id, data) => fetch(`${API_BASE.users}/users/${id}/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(r => {
        if (!r.ok) throw new Error('Failed to change password');
        return true;
    }),

    getUserTaskStats: (email) => fetch(`${API_BASE.tasks}/tasks/stats/user/${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),

    removeUserFromTeam: (teamId, userId) =>
        fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
            method: 'DELETE'
        }),

    getTasks: () => fetch(`${API_BASE.tasks}/tasks`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),
    createTask: (data) => fetch(`${API_BASE.tasks}/tasks`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }),
    updateTaskStatus: (id, status) => fetch(`${API_BASE.tasks}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({status}),
    }),
    deleteTask: (id) => fetch(`${API_BASE.tasks}/tasks/${id}`, {method: 'DELETE'}),

    assignUsersToTask: (taskId, userEmails) => fetch(`${API_BASE.tasks}/projects/tasks/${taskId}/assign-users`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({userEmails}),
    }).then(r => r.json()),

    getTaskAssignments: (taskId) => fetch(`${API_BASE.tasks}/projects/tasks/${taskId}/assignments`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),

    removeUserFromTask: (taskId, userEmail) => fetch(`${API_BASE.tasks}/projects/tasks/${taskId}/assignments/${encodeURIComponent(userEmail)}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }),

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
        }).then(r => r.json());
    },

    getTaskAttachments: (taskId) => fetch(`${API_BASE.tasks}/attachments/tasks/${taskId}`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),
    downloadAttachment: (attachmentId) => {
        return `${API_BASE.tasks}/attachments/${attachmentId}/download`;
    },
    previewAttachment: (attachmentId) => {
        return `${API_BASE.tasks}/attachments/${attachmentId}/preview`;
    },
    deleteAttachment: (attachmentId) => fetch(`${API_BASE.tasks}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }),
    getProjects: () => fetch(`${API_BASE.tasks}/projects`, {
        headers: getAuthHeaders()
    }).then(r => r.json()),
    getProjectDetails: (id) => {
        return fetch(`${API_BASE.tasks}/projects/${id}/details`, {
            headers: getAuthHeaders()
        }).then(r => {
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            return r.json();
        });
    },
    createProject: (data) => fetch(`${API_BASE.tasks}/projects`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }),
    deleteProject: (id) => fetch(`${API_BASE.tasks}/projects/${id}`, {method: 'DELETE'}),

    getCommentsByTaskId: (taskId) =>
        fetch(`${API_BASE.tasks}/comments/task/${taskId}`).then(r => r.json()),

    createComment: (data) => fetch(`${API_BASE.tasks}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    }).then(r => r.json()),

    deleteComment: (id) =>
        fetch(`${API_BASE.tasks}/comments/${id}`, {method: 'DELETE'}),
};