import React, {useState} from 'react';
import {Plus, Trash2, Mail, Calendar, MessageSquare} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';
import TaskForm from './TaskForm';
import TaskDetailsModal from './TaskDetailsModal';

export default function TasksPage() {
    const {tasks, fetchTasks} = useApp();
    const [showForm, setShowForm] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);

    const [searchQuery, setSearchQuery] = useState('');
    const [filterPriority, setFilterPriority] = useState('ALL');
    const [filterUser, setFilterUser] = useState('ALL');
    const [filterTeam, setFilterTeam] = useState('ALL');

    const [dateRange, setDateRange] = useState({start: '', end: ''});

    const handleDelete = async (id) => {
        if (!confirm('Delete this task?')) return;
        try {
            await api.deleteTask(id);
            fetchTasks();
        } catch (err) {
            alert('Error deleting task');
        }
    };

    const handleStatusChange = async (taskId, newStatus) => {
        try {
            await api.updateTaskStatus(taskId, newStatus);
            fetchTasks();
        } catch (err) {
            alert('Error updating status');
        }
    };

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
        const matchesUser = filterUser === 'ALL' || task.assignedToEmail === filterUser;

        const taskDate = new Date(task.deadline).toISOString().split('T')[0];
        const matchesStart = !dateRange.start || taskDate >= dateRange.start;
        const matchesEnd = !dateRange.end || taskDate <= dateRange.end;

        const matchesTeam = filterTeam === 'ALL' || task.teamId?.toString() === filterTeam;

        return matchesSearch && matchesPriority && matchesUser && matchesTeam && matchesStart && matchesEnd;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold">All Tasks ({tasks.length})</h3>
                <button
                    onClick={() => setShowForm(true)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                    <Plus size={20}/>
                    Add Task
                </button>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-sm border space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <select
                        className="border rounded-lg px-3 py-2 outline-none"
                        value={filterPriority}
                        onChange={(e) => setFilterPriority(e.target.value)}
                    >
                        <option value="ALL">All Priorities</option>
                        <option value="HIGH">High Priority</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                    </select>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">From:</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm outline-none"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">To:</span>
                        <input
                            type="date"
                            className="border rounded-lg px-2 py-1 text-sm outline-none"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                        />
                    </div>
                </div>
            </div>

            {selectedTask && (
                <TaskDetailsModal
                    task={selectedTask}
                    onClose={() => setSelectedTask(null)}
                />
            )}

            {showForm && (
                <TaskForm
                    onClose={() => setShowForm(false)}
                    onSuccess={() => {
                        setShowForm(false);
                        fetchTasks();
                    }}
                />
            )}

            <div className="grid grid-cols-3 gap-6">
                {['TODO', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                    <div key={status} className="bg-gray-100 rounded-lg p-4">
                        <h4 className="font-bold mb-4">{status.replace('_', ' ')}</h4>
                        <div className="space-y-3">
                            {filteredTasks.filter(t => t.status === status).map(task => (
                                <div key={task.id} className="bg-white rounded-lg p-4 shadow">
                                    <div className="flex justify-between items-start mb-2">
                                        <h5
                                            className="font-semibold cursor-pointer hover:text-blue-600 transition-colors"
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            {task.title}
                                        </h5>
                                        <button
                                            onClick={() => handleDelete(task.id)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            <Trash2 size={16}/>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{task.description}</p>

                                    <div className="space-y-1 mb-3">
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Mail size={12}/>
                                            {task.assignedToEmail || 'Unassigned'}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500">
                                            <Calendar size={12}/>
                                            {new Date(task.deadline).toLocaleDateString()}
                                        </div>
                                        <div
                                            className="flex items-center gap-2 text-xs text-blue-500 cursor-pointer pt-1"
                                            onClick={() => setSelectedTask(task)}
                                        >
                                            <MessageSquare size={12}/>
                                            <span>View details & comments</span>
                                        </div>
                                    </div>

                                    <select
                                        value={task.status}
                                        onChange={(e) => handleStatusChange(task.id, e.target.value)}
                                        className="w-full text-xs border rounded px-2 py-1 mb-2"
                                    >
                                        <option value="TODO">TODO</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="COMPLETED">COMPLETED</option>
                                    </select>
                                    <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                                        task.priority === 'HIGH' ? 'bg-red-100 text-red-800' :
                                            task.priority === 'MEDIUM' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-green-100 text-green-800'
                                    }`}>
                                        {task.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}