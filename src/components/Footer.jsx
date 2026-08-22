import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-deep-black text-white pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
                    {/* Logo & Info */}
                    <div className="flex flex-col space-y-4">
                        <Link to="/" className="inline-block">
                            <img src="/logo.png" alt="InfluRunner Logo" className="h-10 w-auto brightness-0 invert" />
                        </Link>
                        <p className="text-gray-400 max-w-xs">
                            The professional toolkit for creators and brands to collaborate seamlessly.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-bebas tracking-wide font-bold mb-6">Quick Links</h4>
                        <ul className="space-y-3">
                            <li><Link to="/" className="text-gray-400 hover:text-primary-orange transition-colors">Home</Link></li>
                            <li><Link to="/login" className="text-gray-400 hover:text-primary-orange transition-colors">Log In</Link></li>
                            <li><Link to="/signup" className="text-gray-400 hover:text-primary-orange transition-colors">Get Started</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-lg font-bebas tracking-wide font-bold mb-6">Legal</h4>
                        <ul className="space-y-3">
                            <li><Link to="/privacy-policy" className="text-gray-400 hover:text-primary-orange transition-colors">Privacy Policy</Link></li>
                            <li><Link to="/terms-and-conditions" className="text-gray-400 hover:text-primary-orange transition-colors">Terms & Conditions</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} InfluRunner Technologies LLP. All rights reserved.
                    </p>
                    <div className="flex flex-wrap items-center gap-6">
                        <a href="tel:9099368070" className="text-gray-500 hover:text-primary-orange transition-colors text-sm">
                            📞 +91 9099368070
                        </a>
                        <a href="mailto:business@influrunner.com" className="text-gray-500 hover:text-primary-orange transition-colors text-sm">
                            ✉️ business@influrunner.com
                        </a>
                        <a href="https://contact.influrunner.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-orange transition-colors text-sm font-medium">
                            🌐 contact.influrunner.com
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
