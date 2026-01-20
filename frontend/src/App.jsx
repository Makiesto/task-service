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
    const {currentPage, currentUser, isLoading} = useApp();

    console.log('AppContent render - currentPage:', currentPage, 'currentUser:', currentUser);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!currentUser) {
        console.log('No user, showing:', currentPage === 'register' ? 'register' : 'login');
        return currentPage === 'register' ? <RegisterPage/> : <LoginPage/>;
    }

    console.log('User logged in, showing dashboard');
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
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

function App() {
    return (
        <ThemeProvider>
            <AppProvider>
                <AppContent/>
            </AppProvider>
        </ThemeProvider>
    );
}

export default App;