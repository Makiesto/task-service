import React, {useState} from 'react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';
import {useRole} from "../../hooks/useRole.js";


export default function TeamsPage() {
    const {teams, fetchTeams} = useApp();
    const [showForm, setShowForm] = useState(false);
    const [editingTeamId, setEditingTeamId] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);
    const {currentUser} = useRole();

    const isAdmin = currentUser?.role === 'ADMIN';

    const fetchAvailableUsers = async () => {
        try {
            const data = await api.getAvailableUsers();
            setAvailableUsers(data);
        } catch (error) {
            console.error("Error in TeamsPage:", error);
        }
    };

    const handleAddMember = async (teamId, userId) => {
        if (!isAdmin) return;
        const res = await api.addUserToTeam(teamId, userId);

        if (res.ok) {
            setAvailableUsers(prev => prev.filter(u => u.id !== parseInt(userId)));

            await fetchTeams();
        }
    };

    const handleRemoveMember = async (teamId, userId) => {
        if (!isAdmin) return;
        if (confirm("Are you sure you want to remove this member?")) {
            try {
                const res = await api.removeUserFromTeam(teamId, userId);

                if (res.ok) {
                    fetchTeams();
                    if (availableUsers.length > 0) fetchAvailableUsers();
                } else {
                    console.error("Failed to remove member");
                }
            } catch (error) {
                console.error("Connection error:", error);
            }
        }
    };

    return (
        <div className="space-y-6">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {teams.map(team => (
                    <div key={team.id} className="bg-white rounded-xl shadow-sm border p-6">
                        <div className="flex justify-between items-start mb-4">
                            <h4 className="text-xl font-bold">{team.name}</h4>
                            {isAdmin && (
                                <button
                                    onClick={() => setEditingTeamId(editingTeamId === team.id ? null : team.id)}
                                    className="text-sm text-blue-600 hover:underline"
                                >
                                    {editingTeamId === team.id ? 'Close' : 'Manage Members'}
                                </button>
                            )}
                        </div>

                        {editingTeamId === team.id ? (
                            <div className="space-y-4 border-t pt-4">
                                <h5 className="font-semibold text-sm text-gray-700">Current Members:</h5>
                                <div className="space-y-2">
                                    {team.members?.map(member => (
                                        <div key={member.id}
                                             className="flex justify-between items-center bg-gray-50 p-2 rounded">
                                            <span className="text-sm">{member.firstName} {member.lastName}</span>
                                            <button
                                                onClick={() => handleRemoveMember(team.id, member.id)}
                                                className="text-red-500 hover:bg-red-100 p-1 rounded transition-colors"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                    {(!team.members || team.members.length === 0) && (
                                        <p className="text-xs text-gray-400 italic">No members yet.</p>
                                    )}
                                </div>

                                <div className="pt-2">
                                    {availableUsers.length === 0 ? (
                                        <button
                                            onClick={fetchAvailableUsers}
                                            className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-sm text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all"
                                        >
                                            + Load Available Members
                                        </button>
                                    ) : (
                                        <div className="space-y-2">
                                            <select
                                                className="w-full p-2 text-sm border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                                                defaultValue=""
                                                onChange={(e) => {
                                                    if (e.target.value) {
                                                        handleAddMember(team.id, e.target.value);
                                                        e.target.value = "";
                                                    }
                                                }}
                                            >
                                                <option value="" disabled>Choose a developer...</option>
                                                {availableUsers.map(user => (
                                                    <option key={user.id} value={user.id}>
                                                        {user.firstName} {user.lastName}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => setAvailableUsers([])}
                                                className="w-full text-[10px] text-gray-400 hover:text-gray-600 text-center uppercase tracking-wider"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="border-t pt-4">
                                <p className="text-sm text-gray-500 mb-2">Members ({team.members?.length || 0})</p>
                                <div className="flex -space-x-2 overflow-hidden">
                                    {team.members?.slice(0, 5).map(member => (
                                        <div key={member.id}
                                             className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
                                            {member.firstName[0]}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}