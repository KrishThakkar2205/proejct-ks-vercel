import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white border-b border-light-gray sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link to="/" className="text-2xl flex items-center gap-1">
                    <span className="font-bebas text-3xl tracking-wide text-deep-black">SYNC</span>
                    <span className="font-bebas text-3xl tracking-wide text-primary-orange">KONNECTSPHERE</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link to="/login" className="text-deep-black hover:text-primary-orange transition-colors">Log In</Link>
                    <Link to="/signup" className="bg-primary-orange text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors">
                        Get Started
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-deep-black hover:text-primary-orange focus:outline-none relative w-6 h-6 z-50"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <div className={`absolute inset-0 transition-all duration-300 transform ${isMenuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'}`}>
                        <Menu size={24} />
                    </div>
                    <div className={`absolute inset-0 transition-all duration-300 transform ${isMenuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'}`}>
                        <X size={24} />
                    </div>
                </button>
            </div>

            {/* Mobile Navigation Drawer */}
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden z-40 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden z-50 flex flex-col ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="p-6 border-b border-gray-100">
                    <Link to="/" className="text-2xl flex items-center gap-1" onClick={() => setIsMenuOpen(false)}>
                        <span className="font-bebas text-3xl tracking-wide text-deep-black">SYNC</span>
                        <span className="font-bebas text-3xl tracking-wide text-primary-orange">KONNECTSPHERE</span>
                    </Link>
                </div>

                <div className="flex flex-col p-4 space-y-4">

                    <Link
                        to="/login"
                        className="text-deep-black hover:text-primary-orange transition-colors py-2 px-2 rounded-md hover:bg-gray-50"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Log In
                    </Link>
                    <Link
                        to="/signup"
                        className="bg-primary-orange text-white px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors text-center mt-4"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        Get Started
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
