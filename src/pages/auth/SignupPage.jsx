import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import MultiSelect from '../../components/ui/MultiSelect';
import { Check, Eye, EyeOff } from 'lucide-react';

const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const [userType, setUserType] = useState('influencer');
    const [currentStep, setCurrentStep] = useState(1);
    const [otp, setOtp] = useState('');
    const [otpTimer, setOtpTimer] = useState(60);
    const [canResendOtp, setCanResendOtp] = useState(false);
    const [verificationMethod, setVerificationMethod] = useState('email');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        priceMin: '',
        priceMax: '',
        categories: [],
        location: '',
        agreeTerms: false,
    });

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'influencer') {
            setUserType(type);
        }
    }, [searchParams]);

    // OTP Timer
    useEffect(() => {
        if (currentStep === 2 && otpTimer > 0) {
            const timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
            return () => clearTimeout(timer);
        } else if (otpTimer === 0) {
            setCanResendOtp(true);
        }
    }, [currentStep, otpTimer]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const navigate = useNavigate();

    const validateStep1 = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            alert('Please fill in all fields');
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            alert('Passwords do not match');
            return false;
        }
        if (formData.password.length < 8) {
            alert('Password must be at least 8 characters long');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            alert('Please enter a valid email address');
            return false;
        }
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            alert('Please enter a valid 10-digit phone number');
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        if (otp.length !== 6) {
            alert('Please enter a valid 6-digit OTP');
            return false;
        }
        // Mock OTP verification - in production, verify with backend
        if (otp !== '123456') {
            alert('Invalid OTP. For demo, use: 123456');
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!formData.priceMin || !formData.priceMax) {
            alert('Please enter your price range');
            return false;
        }
        if (parseInt(formData.priceMin) >= parseInt(formData.priceMax)) {
            alert('Maximum price must be greater than minimum price');
            return false;
        }
        if (formData.categories.length === 0) {
            alert('Please select at least one category');
            return false;
        }
        if (!formData.location) {
            alert('Please enter your location');
            return false;
        }
        if (!formData.agreeTerms) {
            alert('Please agree to the Terms & Conditions');
            return false;
        }
        return true;
    };

    const handleNext = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
            // Mock: Send OTP to email
            console.log('OTP sent to email:', formData.email);
        } else if (currentStep === 2 && validateStep2()) {
            setCurrentStep(3);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleResendOtp = () => {
        setOtpTimer(60);
        setCanResendOtp(false);
        setOtp('');
        console.log('OTP resent to email:', formData.email);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateStep3()) {
            console.log('Signup complete:', { ...formData, userType });
            navigate('/influencer');
        }
    };

    const steps = [
        { number: 1, title: 'Basic Info' },
        { number: 2, title: 'Verify OTP' },
        { number: 3, title: 'Details' }
    ];

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-cream/50">
            <Card className="max-w-md w-full space-y-8 p-8 sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl flex flex-col items-center justify-center gap-1">
                        <span className="font-sans font-bold text-deep-black text-xl uppercase tracking-widest">Join</span>
                        <div className="flex items-center gap-1">
                            <span className="font-bebas text-3xl tracking-wide text-deep-black">INFLU</span>
                            <span className="font-bebas text-3xl tracking-wide text-primary-orange">RUNNER</span>
                        </div>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your influencer account to get started
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="flex items-center justify-between px-4">
                    {steps.map((step, index) => (
                        <React.Fragment key={step.number}>
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${currentStep > step.number
                                    ? 'bg-green-500 text-white'
                                    : currentStep === step.number
                                        ? 'bg-primary-orange text-white'
                                        : 'bg-gray-200 text-gray-500'
                                    }`}>
                                    {currentStep > step.number ? <Check size={20} /> : step.number}
                                </div>
                                <span className={`text-xs mt-1 font-medium ${currentStep >= step.number ? 'text-primary-orange' : 'text-gray-400'
                                    }`}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-1 mx-2 rounded transition-all duration-300 ${currentStep > step.number ? 'bg-green-500' : 'bg-gray-200'
                                    }`} />
                            )}
                        </React.Fragment>
                    ))}
                </div>

                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                    <div className="mt-8 space-y-4 animate-fade-in-slide">
                        <Input
                            label="Full Name"
                            type="text"
                            name="name"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email Address"
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Phone Number"
                            type="tel"
                            name="phone"
                            required
                            placeholder="9876543210"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                        />

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
                                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <div className="relative">
                            <Input
                                label="Confirm Password"
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                required
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-[38px] text-gray-500 hover:text-gray-700 transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>

                        <Button type="button" onClick={handleNext} className="w-full shadow-lg shadow-orange-100">
                            Next
                        </Button>
                    </div>
                )}

                {/* Step 2: OTP Verification */}
                {currentStep === 2 && (
                    <div className="mt-8 space-y-4 animate-fade-in-slide">
                        <div className="text-center mb-6">
                            <h3 className="text-lg font-semibold text-gray-800">Verify Your Email</h3>
                            <p className="text-sm text-gray-600 mt-1">
                                Enter the 6-digit code sent to your email
                            </p>
                            <p className="text-sm font-medium text-primary-orange mt-1">
                                {formData.email}
                            </p>
                        </div>

                        <Input
                            label="Enter OTP"
                            type="text"
                            name="otp"
                            required
                            placeholder="123456"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            maxLength="6"
                        />

                        <div className="text-center text-sm">
                            {otpTimer > 0 ? (
                                <p className="text-gray-600">
                                    Resend OTP in <span className="font-semibold text-primary-orange">{otpTimer}s</span>
                                </p>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    className="text-primary-orange hover:underline font-medium"
                                >
                                    Resend OTP
                                </button>
                            )}
                        </div>

                        <div className="text-xs text-center text-gray-500 bg-blue-50 p-3 rounded-lg">
                            💡 Demo OTP: <span className="font-mono font-semibold">123456</span>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                                Back
                            </Button>
                            <Button type="button" onClick={handleNext} className="flex-1 shadow-lg shadow-orange-100">
                                Verify
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Additional Details */}
                {currentStep === 3 && (
                    <form className="mt-8 space-y-4 animate-fade-in-slide" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Price Range (₹) *
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    type="number"
                                    name="priceMin"
                                    required
                                    placeholder="Min (e.g., 5000)"
                                    value={formData.priceMin}
                                    onChange={handleChange}
                                    min="0"
                                />
                                <Input
                                    type="number"
                                    name="priceMax"
                                    required
                                    placeholder="Max (e.g., 50000)"
                                    value={formData.priceMax}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <MultiSelect
                            label="Category of Operation"
                            name="categories"
                            value={formData.categories}
                            onChange={handleChange}
                            options={[
                                'Fashion',
                                'Beauty & Makeup',
                                'Lifestyle',
                                'Fitness & Wellness',
                                'Food & Cooking',
                                'Travel',
                                'Technology',
                                'Gaming',
                                'Education',
                                'Entertainment',
                                'Sports',
                                'Music',
                                'Art & Design',
                                'Business',
                                'Parenting',
                                'Home & Decor',
                                'Photography',
                                'Sustainability'
                            ]}
                            placeholder="Select your categories"
                            required
                        />

                        <Input
                            label="Location"
                            type="text"
                            name="location"
                            required
                            placeholder="e.g., Mumbai, Maharashtra"
                            value={formData.location}
                            onChange={handleChange}
                        />

                        <div className="flex items-center">
                            <input
                                id="agreeTerms"
                                name="agreeTerms"
                                type="checkbox"
                                required
                                className="h-4 w-4 text-primary-orange focus:ring-primary-orange border-gray-300 rounded"
                                checked={formData.agreeTerms}
                                onChange={handleChange}
                            />
                            <label htmlFor="agreeTerms" className="ml-2 block text-sm text-gray-900">
                                I agree to the{' '}
                                <Link to="/terms" className="text-primary-orange hover:underline">
                                    Terms & Conditions
                                </Link>
                            </label>
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" onClick={handleBack} variant="outline" className="flex-1">
                                Back
                            </Button>
                            <Button type="submit" className="flex-1 shadow-lg shadow-orange-100">
                                Create Account
                            </Button>
                        </div>
                    </form>
                )}

                <div className="text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/login" className="font-medium text-primary-orange hover:text-orange-600">
                        Log In
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default SignupPage;
