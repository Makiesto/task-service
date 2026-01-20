import React, {createContext, useContext, useState, useEffect} from 'react';
import {api} from '../api/api';

const AppContext = createContext();

export const useApp = () => {
    const context = useContext(AppContext);
    if (!context) throw new Error('useApp must be used within AppProvider');
    return context;
};

export function AppProvider({children}) {
    const [currentPage, setCurrentPage] = useState('login');
    const [currentUser, setCurrentUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [teams, setTeams] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAllData = () => {
        fetchUsers();
        fetchTeams();
        fetchTasks();
        fetchProjects();
    };

    useEffect(() => {
        console.log('AppProvider mounting...');
        const savedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        console.log('Saved user:', savedUser);
        console.log('Token exists:', !!token);

        if (savedUser && token) {
            try {
                const user = JSON.parse(savedUser);
                console.log('Setting user:', user);
                setCurrentUser(user);
                setCurrentPage('dashboard');

                // Fetch data for logged-in user
                setTimeout(() => {
                    fetchAllData();
                }, 100);
            } catch (err) {
                console.error('Error parsing saved user:', err);
                localStorage.removeItem('currentUser');
                localStorage.removeItem('token');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            console.log('Login attempt with:', credentials.email);
            const response = await api.login(credentials);
            console.log('Login response:', response);

            if (response.id && response.token) {
                console.log('Login successful, storing token and user');
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response));

                setCurrentUser(response);
                setCurrentPage('dashboard');

                console.log('User set, page set to dashboard');

                // Fetch data after successful login
                setTimeout(() => {
                    console.log('Fetching all data...');
                    fetchAllData();
                }, 100);

                return {success: true};
            } else {
                console.log('Login failed:', response.message);
                return {success: false, message: response.message};
            }
        } catch (err) {
            console.error('Login error:', err);
            return {success: false, message: 'Login failed'};
        }
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        setCurrentPage('login');
    };

    const fetchUsers = async () => {
        try {
            console.log('Fetching users...');
            const data = await api.getUsers();
            console.log('Users fetched successfully:', data.length);
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
            // Don't clear users on error, just keep empty array
            if (users.length === 0) setUsers([]);
        }
    };

    const fetchTeams = async () => {
        try {
            console.log('Fetching teams...');
            const data = await api.getTeams();
            console.log('Teams fetched successfully:', data.length);
            setTeams(data);
        } catch (err) {
            console.error('Error fetching teams:', err);
            if (teams.length === 0) setTeams([]);
        }
    };

    const fetchTasks = async () => {
        try {
            console.log('Fetching tasks...');
            const data = await api.getTasks();
            console.log('Tasks fetched successfully:', data.length);
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
            if (tasks.length === 0) setTasks([]);
        }
    };

    const fetchProjects = async () => {
        try {
            console.log('Fetching projects...');
            const data = await api.getProjects();
            console.log('Projects fetched successfully:', data.length);
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
            if (projects.length === 0) setProjects([]);
        }
    };

    const value = {
        currentPage, setCurrentPage,
        currentUser, setCurrentUser,
        login, logout,
        users, setUsers, fetchUsers,
        teams, setTeams, fetchTeams,
        tasks, setTasks, fetchTasks,
        projects, setProjects, fetchProjects,
        isLoading,
    };

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

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}