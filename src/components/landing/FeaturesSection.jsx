import React from 'react';
import { BarChart, DollarSign, MessageCircle, ShieldCheck } from 'lucide-react';

const FeaturesSection = () => {
    const features = [
        {
            title: "Smart Calendar Management",
            description: "Visualize your entire month at a glance. Drag and drop shoots, set availability, and never double-book yourself again.",
            icon: <BarChart className="w-6 h-6 text-white" />,
            image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&q=80&w=2368"
        },
        {
            title: "Upload Scheduling",
            description: "Track every deliverable. Know exactly what to post and when, across all your platforms like Instagram, TikTok, and YouTube.",
            icon: <MessageCircle className="w-6 h-6 text-white" />,
            image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2372"
        },
        {
            title: "Shoot Details & Logistics",
            description: "Keep all your shoot info in one place. Access location maps, brand notes, campaign details, and call times instantly.",
            icon: <ShieldCheck className="w-6 h-6 text-white" />,
            image: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=2370"
        },
        {
            title: "Completion Tracking",
            description: "Mark shoots and uploads as completed with a single click. Track your progress and ensure you get paid on time.",
            icon: <DollarSign className="w-6 h-6 text-white" />,
            image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2626"
        }
    ];

    return (
        <section className="py-24 bg-white">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <h2 className="text-3xl md:text-4xl font-bebas tracking-wide font-bold text-deep-black mb-4">
                        Everything You Need to Stay Organized
                    </h2>
                    <p className="text-medium-gray max-w-2xl mx-auto">
                        Powerful tools designed to help you manage your time and content workflow.
                    </p>
                </div>

                <div className="space-y-24">
                    {features.map((feature, index) => (
                        <div key={index} className={`flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                            <div className="flex-1">
                                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-orange mb-6 shadow-lg shadow-orange-200">
                                    {feature.icon}
                                </div>
                                <h3 className="text-3xl font-bebas tracking-wide font-bold text-deep-black mb-6">
                                    {feature.title}
                                </h3>
                                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                                    {feature.description}
                                </p>
                                <ul className="space-y-3">
                                    {['Stay organized', 'Never miss a deadline', 'Manage multiple campaigns'].map((item, i) => (
                                        <li key={i} className="flex items-center text-gray-700">
                                            <div className="w-2 h-2 rounded-full bg-primary-orange mr-3" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="flex-1 w-full">
                                <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3] group">
                                    <div className="absolute inset-0 bg-deep-black/10 group-hover:bg-transparent transition-colors duration-500" />
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
