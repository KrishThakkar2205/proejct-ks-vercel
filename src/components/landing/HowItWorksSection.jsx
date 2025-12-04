import React from 'react';
import { Calendar, Layers, CheckCircle } from 'lucide-react';

const HowItWorksSection = () => {
    const steps = [
        {
            icon: <Calendar className="w-8 h-8 text-primary-orange" />,
            title: "1. Add Your Bookings",
            description: "Input your shoot details, locations, and times. Sync your entire schedule in one easy-to-view calendar."
        },
        {
            icon: <Layers className="w-8 h-8 text-primary-orange" />,
            title: "2. Plan Your Content",
            description: "Schedule your uploads for each campaign. Set deadlines for Instagram, TikTok, and YouTube deliverables."
        },
        {
            icon: <CheckCircle className="w-8 h-8 text-primary-orange" />,
            title: "3. Stay Organized",
            description: "Get reminders for upcoming shoots and uploads. Mark tasks as completed and keep your workflow smooth."
        }
    ];

    return (
        <section className="py-24 bg-warm-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bebas tracking-wide font-bold text-deep-black mb-4">
                        How It Works
                    </h2>
                    <p className="text-medium-gray max-w-2xl mx-auto">
                        Streamline your influencer marketing workflow in three simple steps.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {steps.map((step, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow text-center group">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                {step.icon}
                            </div>
                            <h3 className="text-xl font-bold text-deep-black mb-4">{step.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorksSection;
