import React from 'react';

const Badge: React.FC<{ children: React.ReactNode; variant?: 'success' | 'warning' | 'danger' | 'info' | 'default', className?: string }> = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        success: 'bg-success/10 text-success border-success/20',
        warning: 'bg-warning/10 text-warning border-warning/20',
        danger: 'bg-danger/10 text-danger border-danger/20',
        info: 'bg-blue-100 text-blue-700 border-blue-200',
        default: 'bg-gray-100 text-gray-700 border-gray-200',
    };

    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export { Badge };
