import React, { useState } from 'react';
import { Plus, Trash2, Eye, ArrowLeft } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/api';
import { useRole } from '../../hooks/useRole';
import ProjectForm from './ProjectForm';

export default function ProjectsPage() {
  const { projects, fetchProjects } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const { canCreateProject, canDeleteProject, isDeveloper } = useRole();

  const handleDelete = async (id) => {
    if (!confirm('Delete this project?')) return;
    try {
      await api.deleteProject(id);
      fetchProjects();
    } catch (err) {
      alert('Error deleting project');
    }
  };

  const handleViewDetails = async (projectId) => {
    console.log('Fetching details for project ID:', projectId);
    if (!projectId) {
      alert('Project ID is missing!');
      return;
    }
    try {
      const details = await api.getProjectDetails(projectId);
      console.log('Project details:', details);
      setSelectedProject(details);
    } catch (err) {
      console.error('Error loading project details:', err);
      alert('Error loading project details. Make sure the backend is running and the endpoint exists.');
    }
  };

  if (selectedProject) {
    return <ProjectDetailsView project={selectedProject} onBack={() => setSelectedProject(null)} />;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-semibold">
            {isDeveloper ? 'My Projects' : 'All Projects'} ({projects.length})
          </h3>
          {isDeveloper && <p className="text-sm text-gray-500 mt-1">Projects with tasks assigned to you</p>}
        </div>
        {canCreateProject && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <Plus size={20} />
            Add Project
          </button>
        )}
      </div>

      {showForm && (
        <ProjectForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchProjects(); }}
        />
      )}

      {projects.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Eye size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Projects Found</h3>
            {isDeveloper ? (
              <p className="text-gray-600">
                You don't have any projects with assigned tasks yet.
                When you're assigned tasks in a project, it will appear here.
              </p>
            ) : (
              <>
                <p className="text-gray-600 mb-4">
                  Get started by creating your first project to organize your tasks.
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
                >
                  <Plus size={20} />
                  Create First Project
                </button>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {projects.map(project => (
            <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-xl font-bold">{project.name}</h4>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleViewDetails(project.id)}
                    className="text-blue-600 hover:text-blue-800"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {canDeleteProject && (
                    <button
                      onClick={() => handleDelete(project.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Project"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  Tasks: {project.numberOfTasks || 0}
                </span>
                <button
                  onClick={() => handleViewDetails(project.id)}
                  className="text-blue-600 hover:underline"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectDetailsView({ project, onBack }) {
  if (!project || !project.stats) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold">Project Details</h1>
            <p className="text-red-600">Error: Project data not loaded correctly</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'TODO': return 'bg-gray-100 text-gray-700';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-700';
      case 'DONE': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-100 text-red-700';
      case 'HIGH': return 'bg-orange-100 text-orange-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'LOW': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const { stats, tasks = [] } = project;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-gray-600">{project.description}</p>
          <p className="text-sm text-gray-500 mt-1">
            Created: {formatDate(project.createdAt)}
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Tasks</p>
              <p className="text-3xl font-bold">{stats.totalTasks}</p>
            </div>
            <div className="text-blue-600 text-2xl">📊</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">DONE</p>
              <p className="text-3xl font-bold text-green-600">{stats.doneTasks}</p>
              <p className="text-xs text-gray-500">{stats.completionRate}%</p>
            </div>
            <div className="text-green-600 text-2xl">✓</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
            </div>
            <div className="text-blue-600 text-2xl">⏱</div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">High Priority</p>
              <p className="text-3xl font-bold text-red-600">
                {stats.criticalPriorityTasks + stats.highPriorityTasks}
              </p>
            </div>
            <div className="text-red-600 text-2xl">⚠</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Completion Rate</span>
            <span>{stats.completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-green-600 h-4 rounded-full transition-all"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>TODO: {stats.todoTasks}</span>
            <span>IN PROGRESS: {stats.inProgressTasks}</span>
            <span>DONE: {stats.doneTasks}</span>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
        <div className="space-y-4">
          {tasks
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
            .map((task, index) => (
              <div key={task.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    task.status === 'DONE' ? 'bg-green-600' : 
                    task.status === 'IN_PROGRESS' ? 'bg-blue-600' : 
                    'bg-gray-400'
                  }`} />
                  {index < tasks.length - 1 && (
                    <div className="w-0.5 h-12 bg-gray-300" />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Created: {formatDate(task.createdAt)}</span>
                    <span>Deadline: {formatDate(task.deadline)}</span>
                    {task.assignedToEmail && (
                      <span>Assigned to: {task.assignedToEmail}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">All Tasks ({tasks.length})</h3>
        <div className="space-y-3">
          {tasks.map(task => (
            <div
              key={task.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold">{task.title}</h4>
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Deadline: {formatDate(task.deadline)}</span>
                    {task.assignedToEmail && (
                      <span>Assigned: {task.assignedToEmail}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}