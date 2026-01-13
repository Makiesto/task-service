import React, { useState, useEffect } from 'react';
import { X, UserPlus, Mail, Check } from 'lucide-react';
import { api } from '../../api/api';

export default function AssignUsersModal({ task, onClose, onSuccess }) {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [currentAssignments, setCurrentAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, [task.id]);

  const fetchData = async () => {
    try {
      const [allUsers, assignments] = await Promise.all([
        api.getUsers(),
        api.getTaskAssignments(task.id)
      ]);

      setUsers(allUsers);
      setCurrentAssignments(assignments);
      setSelectedUsers(assignments.map(a => a.userEmail));
    } catch (err) {
      console.error('Error fetching data:', err);
      alert('Error loading users');
    }
  };

  const handleToggleUser = (email) => {
    setSelectedUsers(prev =>
      prev.includes(email)
        ? prev.filter(e => e !== email)
        : [...prev, email]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.assignUsersToTask(task.id, selectedUsers);
      alert('Users assigned successfully! Email notifications sent.');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Error assigning users:', err);
      alert('Error assigning users');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const email = user.email.toLowerCase();
    const search = searchTerm.toLowerCase();
    return fullName.includes(search) || email.includes(search);
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold">Assign Users to Task</h2>
            <p className="text-gray-600 mt-1">{task.title}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        {/* Users List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No users found</p>
            ) : (
              filteredUsers.map(user => {
                const isSelected = selectedUsers.includes(user.email);
                const wasAssigned = currentAssignments.some(a => a.userEmail === user.email);

                return (
                  <div
                    key={user.id}
                    onClick={() => handleToggleUser(user.email)}
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50 border-blue-500'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                        isSelected ? 'bg-blue-600' : 'bg-gray-400'
                      }`}>
                        {user.firstName[0]}{user.lastName[0]}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Mail size={14} />
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {wasAssigned && !isSelected && (
                        <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded">
                          Will be removed
                        </span>
                      )}
                      {!wasAssigned && isSelected && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          New assignment
                        </span>
                      )}
                      <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600'
                          : 'border-gray-300'
                      }`}>
                        {isSelected && <Check size={16} className="text-white" />}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-gray-500">
              Email notifications will be sent to newly assigned users
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-2 border rounded-lg hover:bg-gray-100"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <UserPlus size={20} />
              {loading ? 'Assigning...' : 'Assign Users'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}