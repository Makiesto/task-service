import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/api';

export default function TaskForm({ onClose, onSuccess }) {
  const { users, projects } = useApp();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedToEmail: '',
    deadline: '',
    status: 'TODO',
    priority: 'MEDIUM',
    projectId: '',
  });

  const handleSubmit = async () => {
    try {
      await api.createTask(formData);
      onSuccess();
    } catch (err) {
      alert('Error creating task');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">New Task</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Task Title"
          value={formData.title}
          onChange={e => setFormData({ ...formData, title: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          rows="3"
        />
        <select
          value={formData.assignedToEmail}
          onChange={e => setFormData({ ...formData, assignedToEmail: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="">Select User</option>
          {users.map(user => (
            <option key={user.id} value={user.email}>
              {user.firstName} {user.lastName} ({user.email})
            </option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={formData.deadline}
          onChange={e => setFormData({ ...formData, deadline: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <div className="grid grid-cols-2 gap-4">
          <select
            value={formData.priority}
            onChange={e => setFormData({ ...formData, priority: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
          <select
            value={formData.projectId}
            onChange={e => setFormData({ ...formData, projectId: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">No Project</option>
            {projects.map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Create
          </button>
          <button onClick={onClose} className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}