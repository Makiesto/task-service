import React from 'react';
import { useApp } from '../../context/AppContext';

export default function Header() {
  const { currentPage } = useApp();

  const titles = {
    dashboard: 'Dashboard',
    users: 'Users Management',
    teams: 'Teams Management',
    tasks: 'Tasks Management',
    projects: 'Projects Management',
    register: 'Register New User'
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-3xl font-bold text-gray-800">{titles[currentPage]}</h2>
    </div>
  );
}