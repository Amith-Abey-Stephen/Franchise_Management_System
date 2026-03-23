"use client";
import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import ProtectedRoute from '../ProtectedRoute';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 transition-colors duration-500">
                <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
                
                <div className="lg:ml-72 flex flex-col min-h-screen">
                    <Navbar toggleSidebar={toggleSidebar} />
                    
                    <main className="flex-1 p-6 lg:p-10 mt-16 max-w-7xl mx-auto w-full">
                        {children}
                    </main>
                    
                    <footer className="p-6 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest opacity-50">
                        FranchiseFlow v1.0 • Enterprise Edition
                    </footer>
                </div>
            </div>
        </ProtectedRoute>
    );
};

