import React, {useEffect, useState} from 'react';
import {Plus, Trash2, Users, Paperclip, MessageSquare, X, ChevronUp, ChevronDown} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';
import {useRole} from '../../hooks/useRole';
import FileAttachmentsModal from './FileAttachmentsModal';
import AssignUsersModal from './AssignUsersModal';
import TaskForm from './TaskForm.jsx';
import CommentsSection from '../comments/CommentsSection';

export default function TasksPage() {
    const {tasks, fetchTasks} = useApp();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskAssignments, setTaskAssignments] = useState({});
    const {canDeleteTask, canAssignUsers, canUpdateTaskStatus, canCreateTask, currentUser, isDeveloper} = useRole();
    const [showTaskForm, setShowTaskForm] = useState(false);
    const [showCommentsTaskId, setShowCommentsTaskId] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

    useEffect(() => {
        fetchTasks();
    }, []);

    useEffect(() => {
        if (tasks.length > 0) {
            const timer = setTimeout(() => {
                fetchAllAssignments();
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [tasks]);

    const fetchAllAssignments = async () => {
        if (tasks.length === 0) return;

        try {
            const assignmentPromises = tasks.map(async (task) => {
                try {
                    const assignments = await api.getTaskAssignments(task.id);
                    return {taskId: task.id, assignments};
                } catch (err) {
                    console.error(`Error fetching assignments for task ${task.id}:`, err);
                    return {taskId: task.id, assignments: []};
                }
            });

            const results = await Promise.all(assignmentPromises);
            const assignmentsMap = {};
            results.forEach(res => {
                assignmentsMap[res.taskId] = res.assignments;
            });

            setTaskAssignments(assignmentsMap);
        } catch (err) {
            console.error('Error fetching all assignments:', err);
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortedTasks = () => {
        if (!sortConfig.key) return tasks;

        const sorted = [...tasks].sort((a, b) => {
            let aValue, bValue;

            switch (sortConfig.key) {
                case 'title':
                    aValue = a.title?.toLowerCase() || '';
                    bValue = b.title?.toLowerCase() || '';
                    break;
                case 'status':
                    const statusOrder = { 'TODO': 1, 'IN_PROGRESS': 2, 'DONE': 3 };
                    aValue = statusOrder[a.status] || 0;
                    bValue = statusOrder[b.status] || 0;
                    break;
                case 'priority':
                    const priorityOrder = { 'CRITICAL': 4, 'HIGH': 3, 'MEDIUM': 2, 'LOW': 1 };
                    aValue = priorityOrder[a.priority] || 0;
                    bValue = priorityOrder[b.priority] || 0;
                    break;
                case 'assigned':
                    const aAssignments = taskAssignments[a.id] || [];
                    const bAssignments = taskAssignments[b.id] || [];
                    aValue = aAssignments.length > 0 ? aAssignments[0].userName?.toLowerCase() : 'zzz';
                    bValue = bAssignments.length > 0 ? bAssignments[0].userName?.toLowerCase() : 'zzz';
                    break;
                case 'deadline':
                    aValue = new Date(a.deadline).getTime();
                    bValue = new Date(b.deadline).getTime();
                    break;
                default:
                    return 0;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });

        return sorted;
    };

    const SortableHeader = ({ label, sortKey, className = "" }) => {
        const isActive = sortConfig.key === sortKey;
        const direction = sortConfig.direction;

        return (
            <th
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase cursor-pointer hover:bg-gray-100  transition-colors select-none ${className}`}
                onClick={() => handleSort(sortKey)}
            >
                <div className="flex items-center gap-1">
                    <span>{label}</span>
                    <div className="flex flex-col">
                        <ChevronUp
                            size={14}
                            className={`${isActive && direction === 'asc' ? 'text-blue-600 ' : 'text-gray-300 '}`}
                        />
                        <ChevronDown
                            size={14}
                            className={`-mt-1 ${isActive && direction === 'desc' ? 'text-blue-600 ' : 'text-gray-300 '}`}
                        />
                    </div>
                </div>
            </th>
        );
    };

    const handleDelete = async (id) => {
        if (!canDeleteTask) {
            alert('You do not have permission to delete tasks');
            return;
        }
        if (!confirm('Delete this task?')) return;
        try {
            await api.deleteTask(id);
            fetchTasks();
        } catch (err) {
            alert('Error deleting task');
        }
    };

    const handleOpenAssignModal = async (task) => {
        if (!canAssignUsers) {
            alert('You do not have permission to assign users');
            return;
        }
        setSelectedTask(task);
        setShowAssignModal(true);
    };

    const handleOpenAttachmentsModal = (task) => {
        setSelectedTask(task);
        setShowAttachmentsModal(true);
    };

    const handleUpdateTaskStatus = async (id, newStatus, task) => {
        if (!canUpdateTaskStatus(task)) {
            alert('You can only update status of your own tasks');
            return;
        }
        try {
            await api.updateTaskStatus(id, newStatus);
            fetchTasks();
        } catch (err) {
            alert('Error updating task status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'TODO':
                return 'bg-gray-100 text-gray-800  ';
            case 'IN_PROGRESS':
                return 'bg-blue-100 text-blue-800  ';
            case 'DONE':
                return 'bg-green-100 text-green-800  ';
            default:
                return 'bg-gray-100 text-gray-800  ';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'CRITICAL':
                return 'bg-red-100 text-red-800  ';
            case 'HIGH':
                return 'bg-orange-100 text-orange-800  ';
            case 'MEDIUM':
                return 'bg-yellow-100 text-yellow-800  ';
            case 'LOW':
                return 'bg-green-100 text-green-800  ';
            default:
                return 'bg-gray-100 text-gray-800  ';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const sortedTasks = getSortedTasks();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-semibold text-gray-900 ">
                        {isDeveloper ? 'My Tasks' : 'All Tasks'} ({tasks.length})
                    </h3>
                    {isDeveloper && (
                        <p className="text-sm text-gray-500  mt-1">
                            Showing only tasks assigned to you
                        </p>
                    )}
                </div>

                {canCreateTask && (
                    <button
                        onClick={() => setShowTaskForm(true)}
                        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700   text-white px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={20}/>
                        Create Task
                    </button>
                )}
            </div>

            {showTaskForm && (
                <TaskForm
                    onClose={() => setShowTaskForm(false)}
                    onSuccess={async () => {
                        try {
                            setShowTaskForm(false);
                            await fetchTasks();
                            await new Promise(resolve => setTimeout(resolve, 200));
                            await fetchAllAssignments();
                        } catch (err) {
                            console.error('Error refreshing tasks:', err);
                        }
                    }}
                />
            )}

            {/* Tasks Table */}
            <div className="bg-white  rounded-lg shadow-lg transition-colors duration-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50  border-b border-gray-200 ">
                        <tr>
                            <SortableHeader label="Task" sortKey="title" />
                            <SortableHeader label="Status" sortKey="status" />
                            <SortableHeader label="Priority" sortKey="priority" />
                            {!isDeveloper && <SortableHeader label="Assigned To" sortKey="assigned" />}
                            <SortableHeader label="Deadline" sortKey="deadline" />
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500  uppercase">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 ">
                        {sortedTasks.map(task => {
                            const assignments = taskAssignments[task.id] || [];
                            return (
                                <tr key={task.id} className="hover:bg-gray-50  transition-colors">
                                    {/* Task Title & Description */}
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold text-gray-900 ">
                                                {task.title}
                                            </p>
                                            <p className="text-sm text-gray-600 ">
                                                {task.description}
                                            </p>
                                        </div>
                                    </td>

                                    {/* Status */}
                                    <td className="px-6 py-4">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value, task)}
                                            disabled={!canUpdateTaskStatus(task)}
                                            className={`px-3 py-1 rounded-lg text-sm font-medium border-0 ${getStatusColor(task.status)} ${!canUpdateTaskStatus(task) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                                        >
                                            <option value="TODO">TODO</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </td>

                                    {/* Priority */}
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getPriorityColor(task.priority)}`}>
                                            {task.priority}
                                        </span>
                                    </td>

                                    {/* Assigned To */}
                                    {!isDeveloper && (
                                        <td className="px-6 py-4">
                                            {assignments.length > 0 ? (
                                                <div className="flex flex-col gap-1">
                                                    {assignments.slice(0, 2).map(a => (
                                                        <span key={a.id} className="text-sm text-gray-700 ">
                                                            {a.userName}
                                                        </span>
                                                    ))}
                                                    {assignments.length > 2 && (
                                                        <span className="text-xs text-gray-500 ">
                                                            +{assignments.length - 2} more
                                                        </span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-gray-400 ">
                                                    Not assigned
                                                </span>
                                            )}
                                        </td>
                                    )}

                                    {/* Deadline */}
                                    <td className="px-6 py-4">
                                        <span className="text-sm text-gray-900 ">
                                            {formatDate(task.deadline)}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setShowCommentsTaskId(task.id)}
                                                className="p-2 text-green-600  hover:bg-green-50  rounded-lg transition-colors"
                                                title="Comments"
                                            >
                                                <MessageSquare size={18}/>
                                            </button>

                                            {canAssignUsers && (
                                                <button
                                                    onClick={() => handleOpenAssignModal(task)}
                                                    className="p-2 text-blue-600  hover:bg-blue-50  rounded-lg transition-colors"
                                                    title="Assign Users"
                                                >
                                                    <Users size={18}/>
                                                </button>
                                            )}

                                            <button
                                                onClick={() => handleOpenAttachmentsModal(task)}
                                                className="p-2 text-purple-600  hover:bg-purple-50  rounded-lg transition-colors"
                                                title="File Attachments"
                                            >
                                                <Paperclip size={18}/>
                                            </button>

                                            {canDeleteTask && (
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="p-2 text-red-600  hover:bg-red-50  rounded-lg transition-colors"
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {sortedTasks.length === 0 && (
                <div className="text-center py-12 bg-white  rounded-lg shadow">
                    <p className="text-lg text-gray-500 ">No tasks found</p>
                    {isDeveloper ? (
                        <p className="text-sm mt-2 text-gray-400 ">
                            You don't have any tasks assigned yet
                        </p>
                    ) : (
                        <p className="text-sm mt-2 text-gray-400 ">
                            Create your first task to get started
                        </p>
                    )}
                </div>
            )}

            {/* Comments Modal */}
            {showCommentsTaskId && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white  rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-4 border-b border-gray-200  flex justify-between items-center bg-gray-50 ">
                            <h3 className="text-lg font-bold flex items-center gap-2 text-gray-900 ">
                                <MessageSquare size={20} className="text-blue-600 "/>
                                Task Discussion
                            </h3>
                            <button
                                onClick={() => setShowCommentsTaskId(null)}
                                className="p-1 hover:bg-gray-200  rounded-full transition-colors"
                            >
                                <X size={24} className="text-gray-600 "/>
                            </button>
                        </div>
                        <div className="p-6 overflow-y-auto">
                            <CommentsSection
                                taskId={showCommentsTaskId}
                                currentUserId={currentUser?.id}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Assign Users Modal */}
            {showAssignModal && selectedTask && (
                <AssignUsersModal
                    task={selectedTask}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedTask(null);
                    }}
                    onSuccess={async () => {
                        await fetchTasks();
                        await new Promise(resolve => setTimeout(resolve, 200));
                        await fetchAllAssignments();
                    }}
                />
            )}

            {/* Attachments Modal */}
            {showAttachmentsModal && selectedTask && (
                <FileAttachmentsModal
                    task={selectedTask}
                    onClose={() => {
                        setShowAttachmentsModal(false);
                        setSelectedTask(null);
                    }}
                />
            )}
        </div>
    );
}