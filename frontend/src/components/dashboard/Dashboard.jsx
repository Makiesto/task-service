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
            <div key={idx} className="bg-white  rounded-lg shadow p-6 transition-colors duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600  text-sm">{stat.label}</p>
                  <p className="text-3xl font-bold mt-2 text-gray-900 ">{stat.value}</p>
                </div>
                <Icon size={40} className="text-blue-500 " />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white  rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 ">Tasks by Status</h3>
          <div className="space-y-3">
            {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => (
              <div key={status} className="flex justify-between items-center">
                <span className="text-gray-600 ">{status.replace('_', ' ')}</span>
                <span className="font-bold text-lg text-gray-900 ">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white  rounded-lg shadow p-6 transition-colors duration-200">
          <h3 className="text-xl font-bold mb-4 text-gray-900 ">Recent Tasks</h3>
          <div className="space-y-2">
            {tasks.slice(0, 5).map(task => (
              <div key={task.id} className="flex items-center gap-2 p-2 hover:bg-gray-50  rounded transition-colors duration-200">
                <CheckSquare size={16} className="text-blue-500 " />
                <span className="text-sm text-gray-900 ">{task.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}