import React, { useState } from 'react';
import { Plus, Trash2, Mail, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../api/api';
import TaskForm from './TaskForm';

export default function TasksPage() {
  const { tasks, fetchTasks } = useApp();
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.deleteTask(id);
      fetchTasks();
    } catch (err) {
      alert('Error deleting task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">All Tasks ({tasks.length})</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          <Plus size={20} />
          Add Task
        </button>
      </div>

      {showForm && (
        <TaskForm
          onClose={() => setShowForm(false)}
          onSuccess={() => { setShowForm(false); fetchTasks(); }}
        />
      )}

      <div className="grid grid-cols-3 gap-6">
        {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => (
          <div key={status} className="bg-gray-100 rounded-lg p-4">
            <h4 className="font-bold mb-4">{status.replace('_', ' ')}</h4>
            <div className="space-y-3">
              {tasks.filter(t => t.status === status).map(task => (
                <div key={task.id} className="bg-white rounded-lg p-4 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-semibold">{task.title}</h5>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                    <Mail size={12} />
                    {task.assignedToEmail || 'Unassigned'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <Calendar size={12} />
                    {new Date(task.deadline).toLocaleDateString()}
                  </div>
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value)}
                    className="w-full text-xs border rounded px-2 py-1 mb-2"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN PROGRESS</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                    task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}