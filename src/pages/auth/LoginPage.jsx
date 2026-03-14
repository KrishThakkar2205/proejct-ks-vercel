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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px 20px',
            background: 'linear-gradient(160deg, #ffffff 0%, #fff4eb 30%, #ffe8d5 50%, #fff4eb 70%, #ffffff 100%)',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Large top-right orb */}
            <div style={{
                position: 'absolute', top: '-120px', right: '-100px',
                width: '420px', height: '420px',
                background: 'radial-gradient(circle, rgba(255,107,26,0.2) 0%, rgba(255,140,74,0.08) 50%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Bottom-left orb */}
            <div style={{
                position: 'absolute', bottom: '-100px', left: '-80px',
                width: '350px', height: '350px',
                background: 'radial-gradient(circle, rgba(255,107,26,0.15) 0%, rgba(255,160,100,0.05) 50%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Center-left accent blob */}
            <div style={{
                position: 'absolute', top: '30%', left: '-40px',
                width: '200px', height: '200px',
                background: 'radial-gradient(circle, rgba(255,107,26,0.1) 0%, transparent 70%)',
                borderRadius: '50%', pointerEvents: 'none',
                filter: 'blur(40px)',
            }} />
            {/* Top-left geometric ring */}
            <div style={{
                position: 'absolute', top: '60px', left: '30px',
                width: '80px', height: '80px',
                border: '3px solid rgba(255,107,26,0.12)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Bottom-right geometric ring */}
            <div style={{
                position: 'absolute', bottom: '80px', right: '40px',
                width: '60px', height: '60px',
                border: '3px solid rgba(255,107,26,0.1)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Small floating dot top */}
            <div style={{
                position: 'absolute', top: '15%', right: '20%',
                width: '12px', height: '12px',
                background: 'rgba(255,107,26,0.2)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Small floating dot bottom */}
            <div style={{
                position: 'absolute', bottom: '25%', left: '15%',
                width: '8px', height: '8px',
                background: 'rgba(255,107,26,0.25)',
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            {/* Diagonal accent stripe */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '100%', height: '100%',
                background: 'linear-gradient(135deg, transparent 0%, transparent 45%, rgba(255,107,26,0.03) 45%, rgba(255,107,26,0.03) 55%, transparent 55%)',
                pointerEvents: 'none',
            }} />

            {/* Logo + Brand */}
            <div style={{ textAlign: 'center', marginBottom: '28px', position: 'relative', zIndex: 1 }}>
                <img
                    src="/logo.png"
                    alt="InfluRunner Logo"
                    style={{
                        width: '80px', height: '80px',
                        borderRadius: '18px',
                        objectFit: 'contain',
                        display: 'block',
                        margin: '0 auto 12px',
                        filter: 'drop-shadow(0 4px 16px rgba(255,107,26,0.3))',
                    }}
                />
                <h1 style={{ color: '#1A1A1A', fontSize: '22px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '3px', margin: 0 }}>INFLURUNNER</h1>
                <p style={{ color: 'rgba(0,0,0,0.4)', fontSize: '12px', margin: '4px 0 0', letterSpacing: '1px' }}>CREATOR MANAGEMENT PLATFORM</p>
            </div>

            {/* Card */}
            <div style={{
                width: '100%', maxWidth: '400px', position: 'relative', zIndex: 1,
                background: '#ffffff',
                borderRadius: '24px',
                border: '1px solid rgba(0,0,0,0.08)',
                padding: '32px 28px',
                boxShadow: '0 12px 40px rgba(0,0,0,0.08)',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <h2 style={{ color: '#1A1A1A', fontSize: '26px', fontFamily: 'Bebas Neue, sans-serif', letterSpacing: '2px', margin: '0 0 6px' }}>
                        Welcome Back
                    </h2>
                    <p style={{ color: 'rgba(0,0,0,0.45)', fontSize: '13px', margin: 0 }}>
                        Sign in to access your dashboard
                    </p>
                </div>

                <form style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} onSubmit={handleSubmit}>
                    {error && (
                        <div style={{
                            padding: '12px 14px', background: 'rgba(239,68,68,0.08)',
                            border: '1px solid rgba(239,68,68,0.2)', borderRadius: '12px',
                            color: '#dc2626', fontSize: '13px',
                        }}>
                            {typeof error === 'string' ? error : 'Something went wrong. Please try again.'}
                        </div>
                    )}

                    <div>
                        <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Email address</label>
                        <input
                            type="email" name="email" required placeholder="you@example.com"
                            value={formData.email} onChange={handleChange}
                            style={{
                                width: '100%', padding: '12px 14px', fontSize: '14px',
                                background: '#f9fafb', border: '1.5px solid #e5e7eb',
                                borderRadius: '12px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
                                fontFamily: 'Outfit, sans-serif',
                            }}
                            onFocus={e => e.target.style.borderColor = '#FF6B1A'}
                            onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                        />
                    </div>

                    <div>
                        <label style={{ color: '#374151', fontSize: '13px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'} name="password" required placeholder="••••••••"
                                value={formData.password} onChange={handleChange}
                                style={{
                                    width: '100%', padding: '12px 44px 12px 14px', fontSize: '14px',
                                    background: '#f9fafb', border: '1.5px solid #e5e7eb',
                                    borderRadius: '12px', color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
                                    fontFamily: 'Outfit, sans-serif',
                                }}
                                onFocus={e => e.target.style.borderColor = '#FF6B1A'}
                                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <div style={{ textAlign: 'right', marginTop: '6px' }}>
                            <Link to="/forgot-password" style={{ color: '#FF6B1A', fontSize: '12px', textDecoration: 'none' }}>
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <button type="submit" disabled={loading} style={{
                        width: '100%', padding: '14px', marginTop: '6px',
                        background: loading ? 'rgba(255,107,26,0.5)' : 'linear-gradient(135deg, #FF6B1A, #ff8c4a)',
                        border: 'none', borderRadius: '12px', color: '#fff',
                        fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 20px rgba(255,107,26,0.35)', fontFamily: 'Outfit, sans-serif',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                    }}>
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Logging in...
                            </>
                        ) : 'Log In'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: 'rgba(0,0,0,0.4)', fontSize: '13px', marginTop: '20px', marginBottom: 0 }}>
                    Don't have an account?{' '}
                    <Link to="/signup" style={{ color: '#FF6B1A', fontWeight: '600', textDecoration: 'none' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );

};

export default LoginPage;
