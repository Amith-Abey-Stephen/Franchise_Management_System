import React from 'react';

export const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className = ''
}) => {
    return (
        <div className={`bg-white dark:bg-slate-800/50 rounded-card shadow-soft-md border border-gray-100 dark:border-white/5 overflow-hidden transition-all duration-300 hover:shadow-lg ${className}`}>
            {children}
        </div>
    );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children, className = ''
}) => (
    <div className={`px-6 py-5 border-b border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-white/5 ${className}`}>
        {children}
    </div>
);

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children, className = ''
}) => <div className={`p-6 ${className}`}>{children}</div>;

