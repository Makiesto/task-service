import React from 'react';
import {useApp} from '../../context/AppContext';

export default function Header() {
    const {currentPage} = useApp();

    const titles = {
        dashboard: 'Dashboard',
        profile: 'My Profile',
        users: 'Users Management',
        teams: 'Teams Management',
        tasks: 'Tasks Management',
        projects: 'Projects Management',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 transition-colors duration-200">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{titles[currentPage]}</h2>
        </div>
    );
}