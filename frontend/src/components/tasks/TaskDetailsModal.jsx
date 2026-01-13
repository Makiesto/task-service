import React from 'react';
import { X, MessageSquare } from 'lucide-react';
import CommentsSection from '../comments/CommentsSection';

export default function TaskDetailsModal({ task, onClose }) {
  if (!task) return null;

  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h4>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{task.description || "No description provided."}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="bg-blue-50 p-3 rounded-lg">
              <span className="block text-blue-600 font-bold">Assigned to:</span>
              {task.assignedToEmail || 'Unassigned'}
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <span className="block text-purple-600 font-bold">Priority:</span>
              {task.priority}
            </div>
          </div>

          <hr className="border-gray-100" />

          <div className="mt-4">
            <div className="flex items-center gap-2 mb-4 text-blue-600">
              <MessageSquare size={20} />
              <h3 className="text-lg font-bold">Discussion</h3>
            </div>
            <CommentsSection taskId={task.id} currentUserId={currentUser.id} />
          </div>
        </div>
      </div>
    </div>
  );
}