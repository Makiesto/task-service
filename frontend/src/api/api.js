export const API_BASE = {
  users: 'http://localhost:8082/api',
  tasks: 'http://localhost:8081/api',
};

export const api = {
  getUsers: () => fetch(`${API_BASE.users}/users`).then(r => r.json()),
  getUserById: (id) => fetch(`${API_BASE.users}/users/${id}`).then(r => r.json()),
  createUser: (data) => fetch(`${API_BASE.users}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  updateUser: (id, data) => fetch(`${API_BASE.users}/users/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  deleteUser: (id) => fetch(`${API_BASE.users}/users/${id}`, { method: 'DELETE' }),

  getTeams: () => fetch(`${API_BASE.users}/teams`).then(r => r.json()),
  createTeam: (data) => fetch(`${API_BASE.users}/teams`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  deleteTeam: (id) => fetch(`${API_BASE.users}/teams/${id}`, { method: 'DELETE' }),

  getTasks: () => fetch(`${API_BASE.tasks}/tasks`).then(r => r.json()),
  createTask: (data) => fetch(`${API_BASE.tasks}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  updateTaskStatus: (id, status) => fetch(`${API_BASE.tasks}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  }),
  deleteTask: (id) => fetch(`${API_BASE.tasks}/tasks/${id}`, { method: 'DELETE' }),
    
  getProjects: () => fetch(`${API_BASE.tasks}/projects`).then(r => r.json()),
  createProject: (data) => fetch(`${API_BASE.tasks}/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }),
  deleteProject: (id) => fetch(`${API_BASE.tasks}/projects/${id}`, { method: 'DELETE' }),
};