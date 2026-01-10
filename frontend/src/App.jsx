import React from 'react';
import {AppProvider, useApp} from './context/AppContext';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './components/dashboard/Dashboard';
import UsersPage from './components/users/UsersPage';
import TeamsPage from './components/teams/TeamsPage';
import TasksPage from './components/tasks/TasksPage';
import {ThemeProvider} from './context/ThemeContext';
import ProjectsPage from './components/projects/ProjectsPage';
import RegisterPage from './components/register/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import ProfilePage from './components/profile/ProfilePage';

function AppContent() {
    const {currentPage, currentUser} = useApp();

    if (!currentUser) {
        return currentPage === 'register' ? <RegisterPage/> : <LoginPage/>;
    }

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar/>
            <div className="flex-1 ml-64">
                <div className="p-8">
                    <Header/>
                    <main className="mt-8">
                        {currentPage === 'dashboard' && <Dashboard/>}
                        {currentPage === 'profile' && <ProfilePage/>}
                        {currentPage === 'users' && <UsersPage/>}
                        {currentPage === 'teams' && <TeamsPage/>}
                        {currentPage === 'tasks' && <TasksPage/>}
                        {currentPage === 'projects' && <ProjectsPage/>}
                    </main>
                </div>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <AppContent/>
            </AppProvider>
        </ThemeProvider>

    );
}