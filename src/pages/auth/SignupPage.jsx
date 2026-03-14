import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import MultiSelect from '../../components/ui/MultiSelect';
import ErrorAlert from '../../components/ui/ErrorAlert';
import { Check, Eye, EyeOff, Loader2 } from 'lucide-react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const phoneInputStyles = `
  /* Container */
  .phone-field .react-tel-input { width: 100%; }

  /* Input */
  .phone-field .react-tel-input .form-control {
    width: 100% !important;
    height: 44px !important;
    font-size: 14px !important;
    font-family: 'Outfit', sans-serif !important;
    border: 1.5px solid #e5e7eb !important;
    border-radius: 10px !important;
    padding-left: 54px !important;
    background: #fff !important;
    color: #1A1A1A !important;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04) !important;
    transition: border-color 0.2s, box-shadow 0.2s !important;
  }
  .phone-field .react-tel-input .form-control:focus {
    outline: none !important;
    border-color: #FF6B1A !important;
    box-shadow: 0 0 0 3px rgba(255,107,26,0.12) !important;
  }
  .phone-field .react-tel-input .form-control::placeholder {
    color: #9ca3af !important;
  }

  /* Flag button */
  .phone-field .react-tel-input .flag-dropdown {
    border: 1.5px solid #e5e7eb !important;
    border-right: none !important;
    border-radius: 10px 0 0 10px !important;
    background: linear-gradient(135deg, #fff8f0 0%, #fff 100%) !important;
    transition: background 0.2s !important;
  }
  .phone-field .react-tel-input .flag-dropdown:hover,
  .phone-field .react-tel-input .flag-dropdown.open {
    background: linear-gradient(135deg, #fff0e0 0%, #ffe8d0 100%) !important;
  }
  .phone-field .react-tel-input .flag-dropdown.open {
    border-color: #FF6B1A !important;
  }
  .phone-field .react-tel-input .selected-flag {
    padding: 0 8px 0 10px !important;
    border-radius: 10px 0 0 10px !important;
    background: transparent !important;
  }
  .phone-field .react-tel-input .selected-flag .arrow {
    border-top-color: #FF6B1A !important;
    margin-left: 4px !important;
  }
  .phone-field .react-tel-input .selected-flag .arrow.up {
    border-bottom-color: #FF6B1A !important;
    border-top: none !important;
  }

  /* Dropdown */
  .phone-field .react-tel-input .country-list {
    border-radius: 12px !important;
    border: 1.5px solid #f3f4f6 !important;
    box-shadow: 0 10px 30px rgba(0,0,0,0.12) !important;
    margin-top: 4px !important;
    max-height: 220px !important;
    font-family: 'Outfit', sans-serif !important;
    font-size: 13px !important;
    overflow-y: auto !important;
    scrollbar-width: thin !important;
    scrollbar-color: #FF6B1A #f3f4f6 !important;
  }
  .phone-field .react-tel-input .country-list .country {
    padding: 8px 12px !important;
    transition: background 0.15s !important;
  }
  .phone-field .react-tel-input .country-list .country:hover {
    background: #fff8f0 !important;
  }
  .phone-field .react-tel-input .country-list .country.highlight {
    background: #fff0e0 !important;
    color: #FF6B1A !important;
    font-weight: 600 !important;
  }
  .phone-field .react-tel-input .country-list .country-name {
    color: #1A1A1A !important;
  }
  .phone-field .react-tel-input .country-list .dial-code {
    color: #FF6B1A !important;
    font-weight: 500 !important;
  }

  /* Search box */
  .phone-field .react-tel-input .country-list .search {
    padding: 8px 10px !important;
    background: #fff !important;
    border-bottom: 1px solid #f3f4f6 !important;
    position: sticky !important;
    top: 0 !important;
    z-index: 1 !important;
  }
  .phone-field .react-tel-input .country-list .search-box {
    width: 100% !important;
    border: 1.5px solid #e5e7eb !important;
    border-radius: 8px !important;
    padding: 6px 10px !important;
    font-size: 13px !important;
    font-family: 'Outfit', sans-serif !important;
    outline: none !important;
    transition: border-color 0.2s !important;
  }
  .phone-field .react-tel-input .country-list .search-box:focus {
    border-color: #FF6B1A !important;
    box-shadow: 0 0 0 2px rgba(255,107,26,0.1) !important;
  }
  .phone-field .react-tel-input .divider {
    border-bottom: 1px solid #f3f4f6 !important;
    margin: 4px 0 !important;
  }
`;
import { signupInitiate, verifyOtp, signupFinal, clearError } from '../../store/slices/authSlice';

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
    const [errorAlert, setErrorAlert] = useState({ isOpen: false, message: '' });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

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

    // Clear errors when step changes
    useEffect(() => {
        dispatch(clearError());
    }, [currentStep, dispatch]);

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

    const validateStep1 = () => {
        if (!formData.name || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword) {
            setErrorAlert({ isOpen: true, message: 'Please fill in all fields' });
            return false;
        }
        if (formData.password !== formData.confirmPassword) {
            setErrorAlert({ isOpen: true, message: 'Passwords do not match' });
            return false;
        }
        if (formData.password.length < 8) {
            setErrorAlert({ isOpen: true, message: 'Password must be at least 8 characters long' });
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setErrorAlert({ isOpen: true, message: 'Please enter a valid email address' });
            return false;
        }
        const phoneRegex = /^[0-9]{8,15}$/;
        if (!phoneRegex.test(formData.phone)) {
            setErrorAlert({ isOpen: true, message: 'Please enter a valid phone number' });
            return false;
        }
        return true;
    };

    const validateStep3 = () => {
        if (!formData.priceMin || !formData.priceMax) {
            setErrorAlert({ isOpen: true, message: 'Please enter your price range' });
            return false;
        }
        if (parseInt(formData.priceMin) >= parseInt(formData.priceMax)) {
            setErrorAlert({ isOpen: true, message: 'Maximum price must be greater than minimum price' });
            return false;
        }
        if (formData.categories.length === 0) {
            setErrorAlert({ isOpen: true, message: 'Please select at least one category' });
            return false;
        }
        if (!formData.location) {
            setErrorAlert({ isOpen: true, message: 'Please enter your location' });
            return false;
        }
        if (!formData.agreeTerms) {
            setErrorAlert({ isOpen: true, message: 'Please agree to the Terms & Conditions' });
            return false;
        }
        return true;
    };

    const handleNext = async () => {
        if (currentStep === 1 && validateStep1()) {
            const result = await dispatch(signupInitiate({
                email: formData.email,
                phone: formData.phone,
                name: formData.name,
                password: formData.password,
            }));

            if (!result.error) {
                setCurrentStep(2);
                setOtpTimer(60);
                setCanResendOtp(false);
            }
        } else if (currentStep === 2) {
            if (otp.length !== 6) {
                setErrorAlert({ isOpen: true, message: 'Please enter a valid 6-digit OTP' });
                return;
            }

            const result = await dispatch(verifyOtp({
                email: formData.email,
                otp: otp,
            }));

            if (!result.error) {
                setCurrentStep(3);
            }
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleResendOtp = async () => {
        setOtpTimer(60);
        setCanResendOtp(false);
        setOtp('');
        // Re-call signup-initiate to resend OTP
        await dispatch(signupInitiate({
            email: formData.email,
            phone: formData.phone,
            name: formData.name,
            password: formData.password,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateStep3()) {
            const result = await dispatch(signupFinal({
                email: formData.email,
                priceMin: formData.priceMin,
                priceMax: formData.priceMax,
                categories: formData.categories,
                location: formData.location,
            }));

            if (!result.error) {
                navigate('/influencer');
            }
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
                        <div className="flex items-center justify-center mb-2">
                            <img src="/logo.png" alt="InfluRunner Logo" className="h-12 w-auto mx-auto" />
                        </div>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your influencer account to get started
                    </p>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm animate-fade-in-slide">
                        <p className="font-medium">Error</p>
                        <p>{typeof error === 'string' ? error : 'Something went wrong. Please try again.'}</p>
                    </div>
                )}

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

                        <div>
                            <style>{phoneInputStyles}</style>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number <span className="text-red-500">*</span></label>
                            <div className="phone-field">
                                <PhoneInput
                                    country="in"
                                    value={formData.phone}
                                    onChange={(phone) => setFormData({ ...formData, phone })}
                                    containerStyle={{ width: '100%' }}
                                    enableSearch
                                    searchPlaceholder="Search country..."
                                    preferredCountries={['in', 'us', 'gb', 'ae', 'sg']}
                                    inputProps={{ name: 'phone', required: true, placeholder: '98765 43210' }}
                                />
                            </div>
                        </div>

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

                        <Button
                            type="button"
                            onClick={handleNext}
                            className="w-full shadow-lg shadow-orange-100"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Loader2 size={18} className="animate-spin" />
                                    Sending OTP...
                                </span>
                            ) : (
                                'Next'
                            )}
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
                                    disabled={loading}
                                    className="text-primary-orange hover:underline font-medium disabled:opacity-50"
                                >
                                    {loading ? 'Resending...' : 'Resend OTP'}
                                </button>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <Button type="button" onClick={handleBack} variant="outline" className="flex-1" disabled={loading}>
                                Back
                            </Button>
                            <Button
                                type="button"
                                onClick={handleNext}
                                className="flex-1 shadow-lg shadow-orange-100"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        Verifying...
                                    </span>
                                ) : (
                                    'Verify'
                                )}
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
                            <Button type="button" onClick={handleBack} variant="outline" className="flex-1" disabled={loading}>
                                Back
                            </Button>
                            <Button type="submit" className="flex-1 shadow-lg shadow-orange-100" disabled={loading}>
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Loader2 size={18} className="animate-spin" />
                                        Creating Account...
                                    </span>
                                ) : (
                                    'Create Account'
                                )}
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

            <ErrorAlert
                isOpen={errorAlert.isOpen}
                message={errorAlert.message}
                onClose={() => setErrorAlert({ isOpen: false, message: '' })}
            />
        </div>
    );
};

export default SignupPage;
