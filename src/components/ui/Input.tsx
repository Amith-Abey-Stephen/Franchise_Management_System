import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className = '', label, error, ...props }, ref) => {
        return (
            <div className="w-full flex flex-col space-y-1 my-2">
                {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
                <input
                    ref={ref}
                    className={`flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 ${error ? 'border-danger focus:ring-danger' : ''} ${className}`}
                    {...props}
                />
                {error && <span className="text-sm text-danger">{error}</span>}
            </div>
        );
    }
);
Input.displayName = 'Input';
