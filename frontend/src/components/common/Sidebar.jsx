import React from 'react';
import { Users, CheckSquare, Folder, Home, UserPlus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function Sidebar() {
  const { currentPage, setCurrentPage } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: Folder },
    { id: 'register', label: 'Register', icon: UserPlus },
  ];

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-8">Task Manager</h1>
      <nav>
        {menuItems.map(item => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                currentPage === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}