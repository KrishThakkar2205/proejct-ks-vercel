import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Mock OTP for demo (in production, this would be sent via email)
    const MOCK_OTP = '123456';

    // Step 1: Send OTP to email
    const handleSendOTP = (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(2);
            // In production, this would trigger an email with OTP
            console.log('OTP sent to:', email, 'OTP:', MOCK_OTP);
        }, 1000);
    };

    // Handle OTP input
    const handleOTPChange = (index, value) => {
        if (value.length > 1) return; // Only allow single digit

        const newOTP = [...otp];
        newOTP[index] = value;
        setOtp(newOTP);
        setError('');

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`);
            if (nextInput) nextInput.focus();
        }
    };

    // Handle OTP backspace
    const handleOTPKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`);
            if (prevInput) prevInput.focus();
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = (e) => {
        e.preventDefault();
        setError('');
        const enteredOTP = otp.join('');

        if (enteredOTP.length !== 6) {
            setError('Please enter complete OTP');
            return;
        }

        if (enteredOTP !== MOCK_OTP) {
            setError('Invalid OTP. Please try again.');
            return;
        }

        setStep(3);
    };

    // Step 3: Reset Password
    const handleResetPassword = (e) => {
        e.preventDefault();
        setError('');

        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setStep(4);
            // In production, this would update the password in the database
            console.log('Password reset successful for:', email);
        }, 1000);
    };

    // Resend OTP
    const handleResendOTP = () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        console.log('OTP resent to:', email, 'OTP:', MOCK_OTP);
        // Show success message (you could add a toast notification here)
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-cream/50">
            <Card className="max-w-md w-full space-y-8 p-8 sm:p-10">
                {/* Step 1: Email Input */}
                {step === 1 && (
                    <>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="text-primary-orange" size={32} />
                            </div>
                            <h2 className="text-3xl font-bebas tracking-wide font-bold text-deep-black">
                                Forgot Password?
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Enter your email address and we'll send you an OTP to reset your password
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <Input
                                label="Email address"
                                type="email"
                                name="email"
                                required
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Sending OTP...' : 'Send OTP'}
                            </Button>

                            <div className="text-center">
                                <Link to="/login" className="text-sm font-medium text-primary-orange hover:text-orange-600 inline-flex items-center gap-2">
                                    <ArrowLeft size={16} />
                                    Back to Login
                                </Link>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 2: OTP Verification */}
                {step === 2 && (
                    <>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="text-primary-orange" size={32} />
                            </div>
                            <h2 className="text-3xl font-bebas tracking-wide font-bold text-deep-black">
                                Enter OTP
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                We've sent a 6-digit code to
                            </p>
                            <p className="text-sm font-medium text-deep-black">{email}</p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            {/* OTP Demo Hint */}
                            <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-center">
                                <p className="font-semibold text-blue-900 mb-1">Demo OTP:</p>
                                <p className="text-blue-700 font-mono text-lg">{MOCK_OTP}</p>
                            </div>

                            {/* OTP Input */}
                            <div className="flex gap-2 justify-center">
                                {otp.map((digit, index) => (
                                    <input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOTPChange(index, e.target.value.replace(/\D/g, ''))}
                                        onKeyDown={(e) => handleOTPKeyDown(index, e)}
                                        className="w-12 h-12 text-center text-xl font-bold border-2 border-gray-300 rounded-lg focus:border-primary-orange focus:ring-2 focus:ring-primary-orange focus:ring-opacity-20 focus:outline-none"
                                    />
                                ))}
                            </div>

                            <Button type="submit" className="w-full">
                                Verify OTP
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    className="text-sm font-medium text-primary-orange hover:text-orange-600"
                                >
                                    Resend OTP
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-sm font-medium text-gray-600 hover:text-gray-900 inline-flex items-center gap-2"
                                >
                                    <ArrowLeft size={16} />
                                    Change Email
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 3: New Password */}
                {step === 3 && (
                    <>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                <Lock className="text-primary-orange" size={32} />
                            </div>
                            <h2 className="text-3xl font-bebas tracking-wide font-bold text-deep-black">
                                Create New Password
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Your new password must be different from previously used passwords
                            </p>
                        </div>

                        <form className="mt-8 space-y-6" onSubmit={handleResetPassword}>
                            {error && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="relative">
                                    <Input
                                        label="New Password"
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        required
                                        placeholder="••••••••"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Confirm Password"
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        required
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Resetting Password...' : 'Reset Password'}
                            </Button>
                        </form>
                    </>
                )}

                {/* Step 4: Success */}
                {step === 4 && (
                    <>
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="text-green-600" size={32} />
                            </div>
                            <h2 className="text-3xl font-bebas tracking-wide font-bold text-deep-black">
                                Password Reset Successful!
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Your password has been successfully reset. You can now log in with your new password.
                            </p>
                        </div>

                        <div className="mt-8">
                            <Button
                                onClick={() => navigate('/login')}
                                className="w-full"
                            >
                                Go to Login
                            </Button>
                        </div>
                    </>
                )}
            </Card>
        </div>
    );
};

export default ForgotPasswordPage;
