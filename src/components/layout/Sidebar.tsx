"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Activity, FileText, Settings, Zap, Box, BarChart2, Shield, Network, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
    const pathname = usePathname();
    const { user } = useAuth();

    const superAdminLinks = [
        { name: 'Global View', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Managed Systems', href: '/dashboard/superadmin/organizations', icon: Globe },
        { name: 'Network Registry', href: '/dashboard/admin/franchises', icon: Users },
    ];

    const adminLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Franchises', href: '/dashboard/admin/franchises', icon: Users },
        { name: 'Products', href: '/dashboard/admin/products', icon: Box },
        { name: 'Commissions', href: '/dashboard/admin/commissions', icon: BarChart2 },
        { name: 'Reports', href: '/dashboard/admin/reports', icon: FileText },
    ];

    const franchiseeLinks = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        { name: 'Network Nodes', href: '/dashboard/franchise/sub-franchises', icon: Network },
        { name: 'Product Catalog', href: '/dashboard/franchise/products', icon: Box },
        { name: 'Fees & Stats', href: '/dashboard/franchise/commissions', icon: Activity },
        { name: 'Profile Settings', href: '/dashboard/franchise/settings', icon: Settings },
    ];


    let links = adminLinks;
    if (user?.role === 'system-superadmin') links = superAdminLinks;
    if (user?.role === 'franchisee') links = franchiseeLinks;

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`fixed top-0 left-0 z-50 w-72 h-screen transition-all duration-500 transform ${isOpen ? 'translate-x-0 shadow-premium' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-slate-900 border-r border-gray-100 dark:border-white/5`}>
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="p-8 pb-4">
                        <Link className="flex items-center space-x-3 group" href="/dashboard">
                            <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                <Zap className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                                FLOW<span className="text-primary not-italic">CMS</span>
                            </span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 overflow-y-auto">
                        <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-4 opacity-50">
                            {user?.role === 'system-superadmin' ? 'SYSTEM ORCHESTRATOR' : 'Enterprise Mesh'}
                        </p>
                        <ul className="space-y-1.5">
                            {links.map((link) => {
                                const Icon = link.icon;
                                const isActive = pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href));
                                return (
                                    <li key={link.name}>
                                        <Link
                                            href={link.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`relative flex items-center px-4 py-3 rounded-2xl group transition-all duration-300 ${isActive
                                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 translate-x-1'
                                                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 mr-3 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                            <span className="text-xs font-bold tracking-tight uppercase">{link.name}</span>
                                            {isActive && (
                                                <div className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                                            )}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Footer / User Preview */}
                    <div className="p-6 border-t border-gray-100 dark:border-white/5 mt-auto">
                        <div className="bg-primary-soft dark:bg-primary-soft/10 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white font-bold">
                                {user?.name?.charAt(0)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate text-gray-900 dark:text-white leading-none mb-1">{user?.name}</p>
                                <p className="text-[10px] font-bold text-primary uppercase">{user?.role === 'system-superadmin' ? 'SUPERADMIN' : user?.role}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};
