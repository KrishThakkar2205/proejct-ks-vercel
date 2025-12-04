import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
import { Sparkles, Users, ArrowRight } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative bg-white overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-orange to-transparent" />
                <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                </svg>
            </div>

            <div className="container mx-auto px-4 relative z-10 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 text-primary-orange text-sm font-medium mb-8 animate-fade-in">
                    <Sparkles className="w-4 h-4" />
                    <span>The Ultimate Tool for Professional Creators</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bebas tracking-wide font-bold text-deep-black mb-8 leading-tight max-w-5xl mx-auto">
                    Master Your Schedule <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-orange to-orange-600">
                        Own Your Time
                    </span>
                </h1>

                <p className="text-xl text-medium-gray max-w-2xl mx-auto mb-12 leading-relaxed">
                    The all-in-one calendar and schedule manager designed for influencers. Organize shoots, track upload deadlines, and manage your content workflow effortlessly.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/signup">
                        <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-orange-200">
                            Start Organizing Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </Link>
                    <Link to="/login">
                        <Button variant="white" size="lg" className="w-full sm:w-auto">
                            <Users className="mr-2 w-5 h-5" />
                            Log In
                        </Button>
                    </Link>
                </div>


            </div>
        </section>
    );
};

export default HeroSection;
