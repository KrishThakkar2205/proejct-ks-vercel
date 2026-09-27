import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { forgetPassword, verifyForgetOtp, resetPassword } from '../../store/slices/authSlice';

const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Step 1: Send OTP to email (/api/forget-password)
    const handleSendOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        
        if (!email) {
            setError('Please enter your email address');
            return;
        }

        setLoading(true);

        try {
            await dispatch(forgetPassword({ email })).unwrap();
            setLoading(false);
            setStep(2);
        } catch (err) {
            setLoading(false);
            setError(typeof err === 'string' ? err : 'Failed to send OTP. Please try again.');
        }
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

    // Step 2: Verify OTP (/api/verify-forget-otp)
    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        const enteredOTP = otp.join('');

        if (enteredOTP.length !== 6) {
            setError('Please enter complete 6-digit OTP');
            return;
        }

        setLoading(true);

        try {
            await dispatch(verifyForgetOtp({ email, otp: enteredOTP })).unwrap();
            setLoading(false);
            setStep(3);
        } catch (err) {
            setLoading(false);
            setError(typeof err === 'string' ? err : 'Invalid OTP. Please try again.');
        }
    };

    // Step 3: Reset Password (/api/reset-password)
    const handleResetPassword = async (e) => {
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

        try {
            await dispatch(resetPassword({ email, password: newPassword })).unwrap();
            setLoading(false);
            setStep(4);
        } catch (err) {
            setLoading(false);
            setError(typeof err === 'string' ? err : 'Password reset failed. Please try again.');
        }
    };

    // Resend OTP (/api/forget-password)
    const handleResendOTP = async () => {
        setOtp(['', '', '', '', '', '']);
        setError('');
        setSuccessMessage('');
        setResendLoading(true);

        try {
            await dispatch(forgetPassword({ email })).unwrap();
            setResendLoading(false);
            setSuccessMessage('OTP has been resent to your email address.');
        } catch (err) {
            setResendLoading(false);
            setError(typeof err === 'string' ? err : 'Failed to resend OTP.');
        }
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

                            {successMessage && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                                    {successMessage}
                                </div>
                            )}

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

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? 'Verifying OTP...' : 'Verify OTP'}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resendLoading}
                                    className="text-sm font-medium text-primary-orange hover:text-orange-600 disabled:opacity-50"
                                >
                                    {resendLoading ? 'Resending OTP...' : 'Resend OTP'}
                                </button>
                            </div>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setError('');
                                        setSuccessMessage('');
                                        setStep(1);
                                    }}
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
