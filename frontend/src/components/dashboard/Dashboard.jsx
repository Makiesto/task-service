import React from 'react';
import { Users, CheckSquare, Folder } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export default function Dashboard() {
  const { users, teams, tasks, projects } = useApp();

  const stats = [
    { label: 'Total Users', value: users.length, icon: Users },
    { label: 'Total Teams', value: teams.length, icon: Users },
    { label: 'Total Tasks', value: tasks.length, icon: CheckSquare },
    { label: 'Total Projects', value: projects.length, icon: Folder },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <Icon size={40} className="text-blue-500 dark:text-blue-400" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Tasks by Status</h3>
          <div className="space-y-3">
            {['TODO', 'IN_PROGRESS', 'DONE'].map(status => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">{status.replace('_', ' ')}</span>
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Recent Tasks</h3>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded transition-colors duration-200">
                <CheckSquare size={16} className="text-blue-500 dark:text-blue-400" />
                <span className="text-sm text-gray-900 dark:text-gray-200">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}