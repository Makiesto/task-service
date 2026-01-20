import React, {useState} from 'react';
import {useApp} from '../../context/AppContext';
import {LogIn, AlertCircle} from 'lucide-react';

export default function LoginPage() {
    const {login, setCurrentPage} = useApp();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log('=== LOGIN BUTTON CLICKED ===');
        console.log('Form data:', formData);

        setError('');
        setLoading(true);

        try {
            console.log('Calling login function...');
            const result = await login(formData);
            console.log('Login result:', result);

            if (!result.success) {
                console.log('Login failed:', result.message);
                setError(result.message || 'Invalid email or password');
            } else {
                console.log('Login successful!');
            }
        } catch (err) {
            console.error('Login exception:', err);
            setError('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <LogIn size={32} className="text-white"/>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-800">Task Manager</h1>
                    <p className="text-gray-600 mt-2">Sign in to your account</p>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg flex items-center gap-2">
                        <AlertCircle size={20}/>
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="your@email.com"
                            value={formData.email}
                            onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={e => setFormData({...formData, password: e.target.value})}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <button
                            onClick={() => setCurrentPage('register')}
                            className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                        >
                            Register here
                        </button>
                    </p>
                </div>

                <div className="mt-6 text-center text-sm text-gray-600">
                    <p>Demo credentials:</p>
                    <p className="font-mono mt-1">test@example.com / pass</p>
                </div>
            </div>
        </div>
    );
}