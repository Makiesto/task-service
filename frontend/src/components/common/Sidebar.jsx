import React from 'react';
import {Users, CheckSquare, Folder, Home, UserPlus, LogOut, UserCircle} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import DarkModeToggle from './DarkModeToggle';

export default function Sidebar() {
    const {currentPage, setCurrentPage, currentUser, logout} = useApp();

    const menuItems = [
        {id: 'dashboard', label: 'Dashboard', icon: Home},
        { id: 'profile', label: 'Profile', icon: UserCircle },
        {id: 'users', label: 'Users', icon: Users},
        {id: 'teams', label: 'Teams', icon: Users},
        {id: 'tasks', label: 'Tasks', icon: CheckSquare},
        {id: 'projects', label: 'Projects', icon: Folder},
    ];

    return (

        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 text-white p-6 flex flex-col">
            <div className="flex-1">
                <h1 className="text-2xl font-bold mb-2">Task Manager</h1>

                <DarkModeToggle/>
                {currentUser && (
                    <div className="mb-8 p-3 bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-400">Logged in as</p>
                        <p className="font-semibold">{currentUser.firstName} {currentUser.lastName}</p>
                        <p className="text-xs text-gray-400">{currentUser.email}</p>
                        <span className="inline-block mt-2 px-2 py-1 text-xs bg-blue-600 rounded">
              {currentUser.role}
            </span>
                    </div>
                )}

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
                                <Icon size={20}/>
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            {/* Logout button */}
            <button
                onClick={logout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition w-full"
            >
                <LogOut size={20}/>
                <span>Logout</span>
            </button>
        </div>
    );
}