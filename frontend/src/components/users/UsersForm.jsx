import React, { useState } from 'react';
import { api } from '../../api/api';

export default function UserForm({ user, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    email: user?.email || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    password: '',
    role: user?.role || 'DEVELOPER',
  });

  const handleSubmit = async () => {
    try {
      if (user) {
        await api.updateUser(user.id, formData);
      } else {
        await api.createUser(formData);
      }
      onSuccess();
    } catch (err) {
      alert('Error saving user');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-bold mb-4">{user ? 'Edit User' : 'New User'}</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="First Name"
            value={formData.firstName}
            onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        />
        <select
          value={formData.role}
          onChange={e => setFormData({ ...formData, role: e.target.value })}
          className="w-full border rounded-lg px-4 py-2"
        >
          <option value="DEVELOPER">Developer</option>
          <option value="MANAGER">Manager</option>
          <option value="ADMIN">Admin</option>
        </select>
        <div className="flex gap-2">
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Save
          </button>
          <button onClick={onClose} className="bg-gray-300 px-6 py-2 rounded-lg hover:bg-gray-400">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}