import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { login, clearError } from '../../store/slices/authSlice';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { loading, error } = useSelector((state) => state.auth);

    // Where to go after login — defaults to /influencer
    const from = location.state?.from?.pathname || '/influencer';

    // Clear auth errors when component mounts or inputs change
    useEffect(() => {
        return () => {
            dispatch(clearError());
        };
    }, [dispatch]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        if (error) dispatch(clearError());
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await dispatch(login({
            email: formData.email,
            password: formData.password,
        }));

        if (!result.error) {
            navigate(from, { replace: true });
        }
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
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700 animate-fade-in-slide">
                            <p className="font-medium">Error</p>
                            <p>{typeof error === 'string' ? error : 'Something went wrong. Please try again.'}</p>
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

                    <Button type="submit" className="w-full shadow-lg shadow-orange-100" disabled={loading}>
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <Loader2 size={18} className="animate-spin" />
                                Logging in...
                            </span>
                        ) : (
                            'Log In'
                        )}
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
