"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Globe, Building2, Users, Activity, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState({ 
        totalSystems: 0, 
        activeSystems: 0, 
        pendingSystems: 0, 
        globalNodes: 0 
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [systems, franchises] = await Promise.all([
                    api.get('/systems'),
                    api.get('/franchises') // Fetching all because super-admin
                ]);
                setStats({
                    totalSystems: systems.data.length,
                    activeSystems: systems.data.filter((s:any) => s.status === 'active').length,
                    pendingSystems: systems.data.filter((s:any) => s.status === 'pending').length,
                    globalNodes: franchises.data.length
                });
            } catch (err) {
                console.error("Dashboard metric synch error");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        { title: 'Total Systems', value: stats.totalSystems, icon: Globe, color: 'text-primary', bg: 'bg-primary/10' },
        { title: 'Active Ecosystems', value: stats.activeSystems, icon: Building2, color: 'text-success', bg: 'bg-success/10' },
        { title: 'Awaiting Review', value: stats.pendingSystems, icon: AlertCircle, color: 'text-orange-500', bg: 'bg-orange-500/10' },
        { title: 'Global Node Count', value: stats.globalNodes, icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    ];

    return (
        <ProtectedRoute allowedRoles={['system-superadmin']}>
            <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 p-2 md:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Platform Overview</h1>
                        <p className="text-xs md:text-sm text-gray-500 font-medium">Real-time health and telemetry metrics for all franchise systems.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {cards.map((card, i) => (
                        <Card key={i} className="border-none shadow-premium overflow-hidden transition-all duration-300 hover:scale-[1.02] rounded-[2rem]">
                            <CardContent className="p-6 md:p-8">
                                <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 md:p-4 rounded-2xl ${card.bg} ${card.color}`}>
                                        <card.icon className="h-5 w-5 md:h-6 md:w-6" />
                                    </div>
                                    <TrendingUp className="h-4 w-4 text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-[10px] md:text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-2">{card.title}</p>
                                    <h3 className="text-2xl md:text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white leading-none">{card.value}</h3>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 border-none shadow-premium p-8 md:p-12 bg-gray-900 text-white rounded-[2.5rem] relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700" />
                        <div className="relative z-10 space-y-6 md:space-y-8">
                            <h2 className="text-2xl md:text-4xl font-black uppercase italic tracking-tighter leading-tight md:leading-none">Global Infrastructure <br className="hidden md:block" />Command Center</h2>
                            <p className="text-xs md:text-sm text-white/60 max-w-lg font-medium leading-relaxed">
                                You are monitoring a multi-tenant blockchain of franchise nodes. Each system is fully isolated. Switch to 'Managed Systems' to authorize new head offices.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm w-fit">
                                    <Activity className="w-4 h-4 text-success" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Core Sync: 100% Online</span>
                                </div>
                                <div className="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm w-fit">
                                    <Users className="w-4 h-4 text-primary" />
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-widest">Isolation: Enforced</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="border-none shadow-premium bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] flex flex-col justify-between group">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 italic">Security Log</h4>
                        <div className="space-y-4 py-8">
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-success mt-1.5 shrink-0" />
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">System verification completed for **{stats.activeSystems}** brands.</p>
                            </div>
                            <div className="flex gap-3 items-start">
                                <div className="w-2 h-2 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">**{stats.pendingSystems}** systems awaiting manual review.</p>
                            </div>
                        </div>
                        <p className="text-[10px] font-bold uppercase text-primary italic group-hover:translate-x-1 transition-transform cursor-default">Monitoring Global State &gt;&gt;</p>
                    </Card>
                </div>
            </div>
        </ProtectedRoute>
    );
}
