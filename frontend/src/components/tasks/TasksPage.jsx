import React, {useState} from 'react';
import {Plus, Trash2, Users, Paperclip} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';
import {useRole} from '../../hooks/useRole';
import FileAttachmentsModal from './FileAttachmentsModal';
import AssignUsersModal from './AssignUsersModal';


export default function TasksPage() {
    const {tasks, fetchTasks} = useApp();
    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showAttachmentsModal, setShowAttachmentsModal] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [taskAssignments, setTaskAssignments] = useState({});
    const {canDeleteTask, canAssignUsers, canUpdateTaskStatus, currentUser} = useRole();

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

        try {
            const assignments = await api.getTaskAssignments(task.id);
            setTaskAssignments(prev => ({
                ...prev,
                [task.id]: assignments
            }));
        } catch (err) {
            console.error('Error fetching assignments:', err);
        }
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

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">All Tasks ({tasks.length})</h3>
            </div>

            <div className="bg-white rounded-lg shadow">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Task</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned
                                To
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deadline</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                        {tasks.map(task => {
                            const assignments = taskAssignments[task.id] || [];

                            return (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-semibold">{task.title}</p>
                                            <p className="text-sm text-gray-600">{task.description}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={task.status}
                                            onChange={(e) => handleUpdateTaskStatus(task.id, e.target.value, task)}
                                            disabled={!canUpdateTaskStatus(task)}
                                            className={`px-3 py-1 rounded text-sm ${getStatusColor(task.status)} ${
                                                !canUpdateTaskStatus(task) ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                        >
                                            <option value="TODO">TODO</option>
                                            <option value="IN_PROGRESS">IN PROGRESS</option>
                                            <option value="DONE">DONE</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded text-sm ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {assignments.length > 0 ? (
                                            <div className="flex flex-col gap-1">
                                                {assignments.slice(0, 2).map(a => (
                                                    <span key={a.id} className="text-sm text-gray-700">
                              {a.userName}
                            </span>
                                                ))}
                                                {assignments.length > 2 && (
                                                    <span className="text-xs text-gray-500">
                              +{assignments.length - 2} more
                            </span>
                                                )}
                                            </div>
                                        ) : (
                                            <span className="text-sm text-gray-400">Not assigned</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm">{formatDate(task.deadline)}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            {canAssignUsers && (
                                                <button
                                                    onClick={() => handleOpenAssignModal(task)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                                                    title="Assign Users"
                                                >
                                                    <Users size={18}/>
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleOpenAttachmentsModal(task)}
                                                className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg"
                                                title="File Attachments"
                                            >
                                                <Paperclip size={18}/>
                                            </button>
                                            {canDeleteTask && (
                                                <button
                                                    onClick={() => handleDelete(task.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

            {showAssignModal && selectedTask && (
                <AssignUsersModal
                    task={selectedTask}
                    onClose={() => {
                        setShowAssignModal(false);
                        setSelectedTask(null);
                    }}
                    onSuccess={() => {
                        fetchTasks();
                        handleOpenAssignModal(selectedTask);
                    }}
                />
            )}

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