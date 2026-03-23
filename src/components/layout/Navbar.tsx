"use client";
import React, { useState, useEffect } from 'react';
import { Menu, LogOut, Bell, Search, X, Check, Info } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../ui/Button';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import api from '@/lib/api';
import { Badge } from '../ui/Badge';

interface NavbarProps {
    toggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();
    
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || "");
    const [notifications, setNotifications] = useState<any[]>([]);

    // Update URL when search query changes
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            const currentSearch = searchParams.get('search') || "";
            if (currentSearch === searchQuery) return;

            const params = new URLSearchParams(searchParams.toString());
            if (searchQuery) {
                params.set('search', searchQuery);
            } else {
                params.delete('search');
            }
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, pathname, router]);

    const fetchActivities = async () => {
        try {
            const res = await api.get('/activities');
            const formatted = res.data.map((a: any) => ({
                id: a._id,
                title: a.action,
                desc: a.details,
                time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: a.type === 'franchise' ? 'info' : 'success',
                isRead: a.isRead
            }));
            setNotifications(formatted);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        if (showNotifications) fetchActivities();
    }, [showNotifications]);

    // Cleanup interval for real-time-ish updates (optional)
    useEffect(() => {
        const interval = setInterval(fetchActivities, 30000);
        return () => clearInterval(interval);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            await api.put(`/activities/${id}/read`);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const deleteNotification = async (id: string) => {
        try {
            await api.delete(`/activities/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <nav className="fixed top-0 right-0 z-40 w-full lg:w-[calc(100%-18rem)] bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-gray-100 dark:border-white/5 transition-all duration-500">
            <div className="px-4 py-3 lg:px-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 rounded-xl transition-colors"
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                        <div className="hidden md:flex items-center bg-gray-50 dark:bg-white/5 px-4 py-2 rounded-2xl border border-gray-100 dark:border-white/5 w-64 group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                            <Search className="w-4 h-4 text-gray-400 mr-2" />
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search everything..." 
                                className="bg-transparent border-none text-sm focus:outline-none w-full text-gray-600 dark:text-gray-300 placeholder-gray-400"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2 lg:gap-6">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                className={`relative p-2 rounded-xl transition-all ${showNotifications ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:text-primary hover:bg-gray-100 dark:hover:bg-white/5'}`}
                            >
                                <Bell className="w-5 h-5" />
                                {notifications.some(n => !n.isRead) && (
                                    <span className="absolute top-2 right-2 w-2 h-2 bg-danger rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse" />
                                )}
                            </button>

                            {showNotifications && (
                                <>
                                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                                    <div className="fixed md:absolute right-4 md:right-0 inset-x-4 md:inset-auto mt-3 md:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-premium border border-gray-100 dark:border-white/5 z-20 overflow-hidden animate-in fade-in slide-in-from-top-5 duration-300">
                                        <div className="p-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between bg-gray-50/50 dark:bg-white/2">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white italic">Recent Activity</h3>
                                            <div className="flex items-center gap-2">
                                                <Badge variant="default" className="text-[8px] border-none bg-primary/10 text-primary font-black uppercase tracking-widest">{notifications.length} EVENTS</Badge>
                                                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
                                            </div>
                                        </div>
                                        <div className="max-h-[70vh] md:max-h-[400px] overflow-y-auto custom-scrollbar">
                                            {notifications.length === 0 ? (
                                                <div className="py-12 text-center">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic grayscale opacity-50">No new telemetry detected.</p>
                                                </div>
                                            ) : (
                                                notifications.map((n) => (
                                                    <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-white/2 hover:bg-gray-50 dark:hover:bg-white/5 transition-all flex gap-3 group/item relative ${n.isRead ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                                                        <div className={`mt-1 p-2 rounded-lg shrink-0 ${n.type === 'success' ? 'bg-success/10 text-success' : 'bg-primary/10 text-primary'}`}>
                                                            {n.type === 'success' ? <Check className="w-3 h-3" /> : <Info className="w-3 h-3" />}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-start justify-between gap-2">
                                                                <p className="text-[13px] font-black text-gray-900 dark:text-white uppercase italic tracking-tight truncate">{n.title}</p>
                                                                <p className="text-[9px] text-gray-400 font-bold whitespace-nowrap">{n.time}</p>
                                                            </div>
                                                            <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5 line-clamp-2">{n.desc}</p>
                                                            
                                                            <div className="flex items-center gap-3 mt-2">
                                                                {!n.isRead && (
                                                                    <button 
                                                                        onClick={() => markAsRead(n.id)}
                                                                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                                                                    >
                                                                        Acknowledge
                                                                    </button>
                                                                )}
                                                                <button 
                                                                    onClick={() => deleteNotification(n.id)}
                                                                    className="text-[9px] font-black text-danger/60 uppercase tracking-widest hover:text-danger hover:underline"
                                                                >
                                                                    Dismiss
                                                                </button>
                                                            </div>
                                                        </div>
                                                        {!n.isRead && (
                                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full transition-all group-hover/item:scale-150" />
                                                        )}
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="p-4 text-center border-t border-gray-50 dark:border-white/5">
                                            <button 
                                                onClick={() => {
                                                    setShowNotifications(false);
                                                    router.push('/dashboard/admin/logs');
                                                }}
                                                className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline italic"
                                            >
                                                Analyze Full Registry
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="h-8 w-[1px] bg-gray-100 dark:bg-white/5" />

                        <div className="flex items-center gap-3">
                            <div className="hidden sm:flex flex-col items-end">
                                <span className="text-sm font-bold text-gray-900 dark:text-white leading-none mb-0.5">{user?.name}</span>
                                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">{user?.role}</span>
                            </div>
                            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white font-black shadow-lg shadow-primary/20 relative group cursor-pointer overflow-hidden backdrop-blur-md">
                                {user?.name?.charAt(0) || 'U'}
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={logout} 
                                className="hidden md:flex text-gray-400 hover:text-danger hover:bg-danger/5 rounded-xl font-black uppercase italic tracking-tighter text-[10px]"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                SIGN OUT
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};
