export const API_BASE = {
    users: 'http://localhost:8082/api',
    tasks: 'http://localhost:8081/api',
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    } : {
        'Content-Type': 'application/json'
    };
};

const handleResponse = async (response) => {
    if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`;

        try {
            const errorBody = await response.json();
            errorMessage = errorBody.message || errorBody.error || errorMessage;
        } catch (e) {
            errorMessage = response.statusText || errorMessage;
        }

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('currentUser');
            window.location.href = '/';
        }

        throw new Error(errorMessage);
    }

    return response.json();
};

export const api = {
    // ============== AUTH ==============
    login: (credentials) => fetch(`${API_BASE.users}/auth/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(credentials),
    }).then(handleResponse),

    // ============== USERS ==============
    getUsers: () => fetch(`${API_BASE.users}/users`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    getUserById: (id) => fetch(`${API_BASE.users}/users/${id}`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    createUser: (data) => fetch(`${API_BASE.users}/auth/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
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

    // ============== TEAMS ==============
    getTeams: () => fetch(`${API_BASE.users}/teams`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

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
    }).then(handleResponse),

    addUserToTeam: (teamId, userId) => fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
        method: 'POST',
        headers: getAuthHeaders()
    }).then(handleResponse),

    removeUserFromTeam: (teamId, userId) => fetch(`${API_BASE.users}/teams/${teamId}/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    // ============== PROFILE ==============
    updateProfile: (id, data) => fetch(`${API_BASE.users}/users/${id}/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    changePassword: (id, data) => fetch(`${API_BASE.users}/users/${id}/change-password`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    // ============== TASKS ==============
    getUserTaskStats: (email) => fetch(`${API_BASE.tasks}/tasks/stats/user/${encodeURIComponent(email)}`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    getTasks: () => fetch(`${API_BASE.tasks}/tasks`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    createTask: (data) => fetch(`${API_BASE.tasks}/tasks`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    updateTaskStatus: (id, status) => fetch(`${API_BASE.tasks}/tasks/${id}/status`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({status}),
    }).then(handleResponse),

    deleteTask: (id) => fetch(`${API_BASE.tasks}/tasks/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    // ============== PROJECTS ==============
    getProjects: () => fetch(`${API_BASE.tasks}/projects`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    createProject: (data) => fetch(`${API_BASE.tasks}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    deleteProject: (id) => fetch(`${API_BASE.tasks}/projects/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),

    // ============== COMMENTS ==============
    getCommentsByTaskId: (taskId) => fetch(`${API_BASE.tasks}/comments/task/${taskId}`, {
        headers: getAuthHeaders()
    }).then(handleResponse),

    createComment: (data) => fetch(`${API_BASE.tasks}/comments`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
    }).then(handleResponse),

    deleteComment: (id) => fetch(`${API_BASE.tasks}/comments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
    }).then(handleResponse),
};