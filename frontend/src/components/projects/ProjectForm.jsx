import React, { useState } from 'react';
import { api } from '../../api/api';

export default function ProjectForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleSubmit = async () => {
    try {
      await api.createProject(formData);
      onSuccess();
    } catch (err) {
      alert('Error creating project');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">New Project</h3>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Project Name"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
          rows="3"
        />
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