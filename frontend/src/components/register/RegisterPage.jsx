import React, {useState} from 'react';
import {CheckCircle} from 'lucide-react';
import {useApp} from '../../context/AppContext';
import {api} from '../../api/api';

export default function RegisterPage() {
    const {fetchUsers, setCurrentPage} = useApp();
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        password: '',
        role: 'DEVELOPER',
    });
    const [success, setSuccess] = useState(false);

    const handleSubmit = async () => {
        try {
            await api.createUser(formData);
            setSuccess(true);
            fetchUsers();

            setTimeout(() => {
                setSuccess(false);
                setCurrentPage('login');
            }, 2000);

            setFormData({email: '', firstName: '', lastName: '', password: '', role: 'DEVELOPER'});
        } catch (err) {
            alert('Error registering user');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-2xl font-bold mb-6">Register New User</h3>

                {success && (
                    <div className="mb-4 p-4 bg-green-100 text-green-800 rounded-lg flex items-center gap-2">
                        <CheckCircle size={20}/>
                        User registered successfully!
                    </div>
                )}

                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="First Name"
                            value={formData.firstName}
                            onChange={e => setFormData({...formData, firstName: e.target.value})}
                            className="border rounded-lg px-4 py-3"
                        />
                        <input
                            type="text"
                            placeholder="Last Name"
                            value={formData.lastName}
                            onChange={e => setFormData({...formData, lastName: e.target.value})}
                            className="border rounded-lg px-4 py-3"
                        />
                    </div>
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={e => setFormData({...formData, email: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({...formData, password: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3"
                    />
                    <select
                        value={formData.role}
                        onChange={e => setFormData({...formData, role: e.target.value})}
                        className="w-full border rounded-lg px-4 py-3"
                    >
                        <option value="DEVELOPER">Developer</option>
                        <option value="MANAGER">Manager</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
                    >
                        Register User
                    </button>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => setCurrentPage('login')}
                            className="text-purple-600 font-semibold hover:text-purple-700 hover:underline"
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}