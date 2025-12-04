import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const CTASection = () => {
    return (
        <section className="py-20 bg-white">
            <div className="container mx-auto px-4">
                <div className="bg-deep-black rounded-3xl overflow-hidden relative py-16 px-8 md:px-16 text-center">
                    {/* Abstract Background */}
                    <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-gray-800 to-transparent opacity-30 pointer-events-none" />

                    <div className="relative z-10 max-w-3xl mx-auto">
                        <h3 className="text-4xl md:text-5xl font-bebas tracking-wide font-bold text-white mb-6">
                            Ready to Take Control of Your Schedule?
                        </h3>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Join thousands of creators who are saving time, hitting deadlines, and staying organized with our professional tools.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-orange-500/20">
                                    Join Now - It's Free
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
