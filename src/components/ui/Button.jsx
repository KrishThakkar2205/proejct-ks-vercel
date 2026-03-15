import React from 'react';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none min-h-[44px]';

    const variants = {
        primary: 'text-white hover:opacity-90 focus:ring-primary-orange',
        secondary: 'border-2 border-primary-orange text-primary-orange hover:bg-orange-50 focus:ring-primary-orange',
        ghost: 'text-primary-orange hover:bg-orange-50 hover:underline',
        white: 'bg-white text-deep-black border border-gray-200 hover:bg-gray-50',
        black: 'bg-deep-black text-white hover:bg-gray-800',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-6 py-2.5 text-base',
        lg: 'px-8 py-3 text-lg',
    };

    const inlineStyle = variant === 'primary' ? {
        background: 'linear-gradient(135deg, #FF6B1A, #ff8c4a)',
        boxShadow: '0 4px 20px rgba(255,107,26,0.35)',
    } : {};

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            style={inlineStyle}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
