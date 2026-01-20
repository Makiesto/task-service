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

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            setCurrentUser(JSON.parse(savedUser));
            setCurrentPage('dashboard');
        }
    }, []);

    const fetchAllData = () => {
        fetchUsers();
        fetchTeams();
        fetchTasks();
        fetchProjects();
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('currentUser');
        const token = localStorage.getItem('token');

        if (savedUser && token) {
            setCurrentUser(JSON.parse(savedUser));
            setCurrentPage('dashboard');
            fetchAllData();
        }
    }, []);


    const login = async (credentials) => {
        try {
            const response = await api.login(credentials);
            if (response.id && response.token) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('currentUser', JSON.stringify(response));
                setCurrentUser(response);

                fetchAllData();

                setCurrentPage('dashboard');
                return {success: true};
            } else {
                return {success: false, message: response.message};
            }
        } catch (err) {
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
            const data = await api.getUsers();
            setUsers(data);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const fetchTeams = async () => {
        try {
            const data = await api.getTeams();
            setTeams(data);
        } catch (err) {
            console.error('Error fetching teams:', err);
        }
    };

    const fetchTasks = async () => {
        try {
            const data = await api.getTasks();
            setTasks(data);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const fetchProjects = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (err) {
            console.error('Error fetching projects:', err);
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
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}