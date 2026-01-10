import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/api';
import ProjectForm from './ProjectForm';

export default function ProjectsPage() {
  const { projects, fetchProjects } = useApp();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      fetchProjects();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Projects ({projects.length})</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Project
        </button>
      </div>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchProjects(); }}
        />
      )}

      <div className="grid grid-cols-3 gap-6">
        {projects.map(project => (
          <div key={project.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-4">
              <h4 className="text-xl font-bold">{project.name}</h4>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 size={18} />
              </button>
            </div>
            <p className="text-gray-600">{project.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}