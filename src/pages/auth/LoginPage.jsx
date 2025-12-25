import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Eye, EyeOff } from 'lucide-react';
import { MOCK_USERS } from '../../data/mockData';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(''); // Clear error on input change
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if user exists in mock data
        const user = MOCK_USERS[formData.email];

        if (!user) {
            setError('Invalid email or password');
            return;
        }

        if (user.password !== formData.password) {
            setError('Invalid email or password');
            return;
        }

        // Store user info in localStorage for session management
        localStorage.setItem('currentUser', JSON.stringify({
            email: formData.email,
            name: user.name,
            role: user.role
        }));

        // Navigate to appropriate dashboard
        navigate(user.redirectTo);
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-cream/50">
            <Card className="max-w-md w-full space-y-8 p-8 sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl font-bebas tracking-wide font-bold text-deep-black">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to access your dashboard
                    </p>
                    {/* Test credentials hint */}
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-left">
                        <p className="font-semibold text-blue-900 mb-1">Test Credentials:</p>
                        <p className="text-blue-700">Brand: brand@test.com / brand123</p>
                        <p className="text-blue-700">Influencer: influencer@test.com / influencer123</p>
                        <p className="text-blue-700">Admin: admin@test.com / admin123</p>
                    </div>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <div>
                            <div className="relative">
                                <Input
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    required
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            <div className="flex justify-end mt-1">
                                <Link to="/forgot-password" className="text-sm font-medium text-primary-orange hover:text-orange-600">
                                    Forgot your password?
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Button type="submit" className="w-full shadow-lg shadow-orange-100">
                        Log In
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-gray-600">Don't have an account? </span>
                    <Link to="/signup" className="font-medium text-primary-orange hover:text-orange-600">
                        Sign Up
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default LoginPage;
