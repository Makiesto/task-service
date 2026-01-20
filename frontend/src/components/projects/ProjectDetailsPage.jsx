import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {ArrowLeft, Calendar, CheckCircle, Clock, AlertCircle, TrendingUp} from 'lucide-react';
import {api} from '../../api/api';

export default function ProjectDetailsPage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showTaskForm, setShowTaskForm] = useState(false);

    useEffect(() => {
        fetchProjectDetails();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const data = await api.getProjectDetails(id);
            setProject(data);
        } catch (err) {
            console.error('Error fetching project details:', err);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO':
                return 'bg-gray-100 text-gray-700';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-700';
            case 'DONE':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL':
                return 'bg-red-100 text-red-700';
            case 'HIGH':
                return 'bg-orange-100 text-orange-700';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-700';
            case 'LOW':
                return 'bg-green-100 text-green-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-gray-500">Loading project details...</div>
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="text-red-500">Project not found</div>
            </div>
        );
    }

    const {stats, tasks} = project;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/projects')}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                >
                    <ArrowLeft size={24}/>
                </button>
                <button
                    onClick={() => setShowTaskForm(true)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                    <Plus size={20}/>
                    Add Task to Project
                </button>
                <div>
                    <h1 className="text-3xl font-bold">{project.name}</h1>
                    <p className="text-gray-600">{project.description}</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Created: {formatDate(project.createdAt)}
                    </p>
                </div>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Tasks</p>
                            <p className="text-3xl font-bold">{stats.totalTasks}</p>
                        </div>
                        <TrendingUp className="text-blue-600" size={32}/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Completed</p>
                            <p className="text-3xl font-bold text-green-600">{stats.doneTasks}</p>
                            <p className="text-xs text-gray-500">{stats.completionRate}%</p>
                        </div>
                        <CheckCircle className="text-green-600" size={32}/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">In Progress</p>
                            <p className="text-3xl font-bold text-blue-600">{stats.inProgressTasks}</p>
                        </div>
                        <Clock className="text-blue-600" size={32}/>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">High Priority</p>
                            <p className="text-3xl font-bold text-red-600">
                                {stats.criticalPriorityTasks + stats.highPriorityTasks}
                            </p>
                        </div>
                        <AlertCircle className="text-red-600" size={32}/>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Project Progress</h3>
                <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-600">
                        <span>Completion Rate</span>
                        <span>{stats.completionRate}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                        <div
                            className="bg-green-600 h-4 rounded-full transition-all"
                            style={{width: `${stats.completionRate}%`}}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-500">
                        <span>TODO: {stats.todoTasks}</span>
                        <span>IN PROGRESS: {stats.inProgressTasks}</span>
                        <span>DONE: {stats.doneTasks}</span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Project Timeline</h3>
                <div className="space-y-4">
                    {tasks
                        .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
                        .map((task, index) => (
                            <div key={task.id} className="flex items-start gap-4">
                                <div className="flex flex-col items-center">
                                    <div className={`w-3 h-3 rounded-full ${
                                        task.status === 'DONE' ? 'bg-green-600' :
                                            task.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                                                'bg-gray-400'
                                    }`}/>
                                    {index < tasks.length - 1 && (
                                        <div className="w-0.5 h-12 bg-gray-300"/>
                                    )}
                                </div>
                                <div className="flex-1 pb-4">
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14}/>
                      Created: {formatDate(task.createdAt)}
                    </span>
                                        <span className="flex items-center gap-1">
                      <Calendar size={14}/>
                      Deadline: {formatDate(task.deadline)}
                    </span>
                                        {task.assignedToEmail && (
                                            <span>Assigned to: {task.assignedToEmail}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Tasks List */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">All Tasks ({tasks.length})</h3>
                <div className="space-y-3">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="font-semibold">{task.title}</h4>
                                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                                        <span
                                            className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                        <span>Deadline: {formatDate(task.deadline)}</span>
                                        {task.assignedToEmail && (
                                            <span>Assigned: {task.assignedToEmail}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}