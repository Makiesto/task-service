import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

export function AppProvider({ children }) {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTeams();
    fetchTasks();
    fetchProjects();
  }, []);

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
    users, setUsers, fetchUsers,
    teams, setTeams, fetchTeams,
    tasks, setTasks, fetchTasks,
    projects, setProjects, fetchProjects,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}