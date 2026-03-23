"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Users, AlertCircle, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Badge } from '@/components/ui/Badge';

export default function AdminDashboard() {
    const [franchises, setFranchises] = useState([]);
    const [stats, setStats] = useState({
        totalFranchises: 0,
        pendingApprovals: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const res = await api.get('/franchises');
                const data = res.data;
                setFranchises(data);
                setStats({
                    totalFranchises: data.length,
                    pendingApprovals: data.filter((f: any) => f.status === 'pending').length
                });
                setLoading(false);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-gray-400 font-medium animate-pulse">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Dashboard</h1>
                        <p className="text-gray-500 mt-1 font-bold uppercase text-[10px] tracking-widest">Overview of all stores</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <StatCard 
                        icon={<Users className="w-5 h-5" />} 
                        label="Total Stores" 
                        value={stats.totalFranchises} 
                        color="bg-primary" 
                        trend="Operating units"
                    />
                    <StatCard 
                        icon={<AlertCircle className="w-5 h-5" />} 
                        label="Need Approval" 
                        value={stats.pendingApprovals} 
                        color="bg-warning" 
                        trend="New requests"
                    />
                </div>

                <Card className="border-none shadow-premium overflow-hidden">
                    <CardHeader className="p-6 md:p-8 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Activity className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">Store List</h2>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[700px] text-left">
                                <thead>
                                    <tr className="bg-gray-50 dark:bg-white/5">
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Store Name</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Location</th>
                                        <th className="px-6 md:px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Commission (%)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    {franchises.map((f: any) => (
                                        <tr key={f._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 md:px-8 py-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center font-bold text-xs">
                                                        {f.franchiseName.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{f.franchiseName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 md:px-8 py-6">
                                                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{f.region}</span>
                                            </td>
                                            <td className="px-6 md:px-8 py-6 text-right">
                                                <span className="inline-flex items-center px-4 py-2 rounded-xl bg-success/10 text-success text-sm font-black italic">
                                                    {f.commissionPercentage}% <ArrowUpRight className="ml-1 w-3 h-3" />
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}

function StatCard({ icon, label, value, color, trend }: { icon: React.ReactNode, label: string, value: string | number, color: string, trend: string }) {
    return (
        <Card className="border-none shadow-soft-md hover:shadow-premium group">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className={`p-2.5 ${color} text-white rounded-xl shadow-lg ring-4 ring-white dark:ring-slate-800 transition-transform group-hover:scale-110`}>
                        {icon}
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{label}</p>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-none">{value}</h3>
                    </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 dark:border-white/5 flex items-center text-[10px] font-bold text-gray-400">
                    <TrendingUp className="w-3 h-3 mr-1 text-success" />
                    <span>{trend}</span>
                </div>
            </CardContent>
        </Card>
    );
}
