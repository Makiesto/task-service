import React, { useState, useEffect } from 'react';
import { UserPlus, UserMinus, Users } from 'lucide-react';
import { api } from '../../api/api';

const TeamMembers = ({ teamId }) => {
    const [members, setMembers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState('');

    useEffect(() => {
        loadData();
    }, [teamId]);

    const loadData = async () => {
        const [membersData, usersData] = await Promise.all([
            api.getTeamMembers(teamId),
            api.getUsers()
        ]);
        setMembers(membersData);
        setAllUsers(usersData);
    };

    const handleAdd = async () => {
        if (!selectedUserId) return;
        await api.addUserToTeam(teamId, selectedUserId);
        loadData();
    };

    const handleRemove = async (userId) => {
        if (confirm("Remove user from team?")) {
            await api.removeUserFromTeam(teamId, userId);
            loadData();
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Users className="text-blue-600" size={20} />
                <h3 className="font-bold text-lg">Team Members</h3>
            </div>


            <div className="flex gap-2 mb-6">
                <select
                    className="flex-1 border rounded-lg px-3 py-2 outline-none"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                >
                    <option value="">Select user to add...</option>
                    {allUsers.filter(u => !members.find(m => m.id === u.id)).map(user => (
                        <option key={user.id} value={user.id}>{user.email}</option>
                    ))}
                </select>
                <button
                    onClick={handleAdd}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                >
                    <UserPlus size={20} />
                </button>
            </div>

            <div className="space-y-3">
                {members.map(member => (
                    <div key={member.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                        <div>
                            <p className="font-medium text-sm">{member.username}</p>
                            <p className="text-xs text-gray-500">{member.email}</p>
                        </div>
                        <button
                            onClick={() => handleRemove(member.id)}
                            className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                            <UserMinus size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TeamMembers;