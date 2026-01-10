import React, {useState} from 'react';
import {Plus, Edit2, Trash2} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';
import UserForm from '../users/UsersForm.jsx';

export default function UsersPage() {
    const {users, fetchUsers} = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm('Delete this user?')) return;
        try {
            await api.deleteUser(id);
            fetchUsers();
        } catch (err) {
            alert('Error deleting user');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">All Users ({users.length})</h3>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setEditingUser(null);
                    }}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20}/>
                    Add User
                </button>
            </div>

            {showForm && (
                <UserForm
                    user={editingUser}
                    onClose={() => {
                        setShowForm(false);
                        setEditingUser(null);
                    }}
                    onSuccess={() => {
                        setShowForm(false);
                        setEditingUser(null);
                        fetchUsers();
                    }}
                />
            )}

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden transition-colors duration-200">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Name</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Role</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Actions</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {users.map(user => (
                        <tr key={user.id}
                            className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.firstName} {user.lastName}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">{user.email}</td>
                            <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                  <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {user.role}
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingUser(user);
                                            setShowForm(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-800"
                                    >
                                        <Edit2 size={18}/>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(user.id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}