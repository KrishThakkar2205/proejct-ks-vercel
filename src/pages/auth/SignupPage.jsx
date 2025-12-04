import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import MultiSelect from '../../components/ui/MultiSelect';
import { Linkedin, Briefcase, Camera } from 'lucide-react';

const SignupPage = () => {
    const [searchParams] = useSearchParams();
    const [userType, setUserType] = useState('influencer'); // Default to influencer
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        priceMin: '',
        priceMax: '',
        categories: [],
        agreeTerms: false,
    });

    useEffect(() => {
        const type = searchParams.get('type');
        if (type === 'influencer') {
            setUserType(type);
        }
    }, [searchParams]);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Signup attempt:', { ...formData, userType });
        // Mock signup success
        navigate('/influencer');
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-warm-cream/50">
            <Card className="max-w-md w-full space-y-8 p-8 sm:p-10">
                <div className="text-center">
                    <h2 className="text-3xl flex flex-col items-center justify-center gap-1">
                        <span className="font-sans font-bold text-deep-black text-xl uppercase tracking-widest">Join</span>
                        <div className="flex items-center gap-1">
                            <span className="font-bebas text-3xl tracking-wide text-deep-black">SYNC</span>
                            <span className="font-bebas text-3xl tracking-wide text-primary-orange">KONNECTSPHERE</span>
                        </div>
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Create your influencer account to get started
                    </p>
                </div>

                {/* Account Type Selection - Hidden for now */}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label={userType === 'brand' ? "Company Name" : "Full Name"}
                            type="text"
                            name="name"
                            required
                            placeholder={userType === 'brand' ? "Acme Inc." : "John Doe"}
                            value={formData.name}
                            onChange={handleChange}
                        />

                        <Input
                            label="Email address"
                            type="email"
                            name="email"
                            required
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={handleChange}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                        />

                        <Input
                            label="Confirm Password"
                            type="password"
                            name="confirmPassword"
                            required
                            placeholder="••••••••"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />

                        {/* Price Range */}
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

                        {/* Categories */}
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
                    </div>

                    <Button type="submit" className="w-full shadow-lg shadow-orange-100">
                        Create Account
                    </Button>


                </form>

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
