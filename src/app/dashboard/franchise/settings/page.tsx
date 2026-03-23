"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Building2, Globe, Mail, User, Percent, Activity, ShieldCheck, Zap } from 'lucide-react';
import api from '@/lib/api';

export default function ShopSettingsPage() {
    const [franchise, setFranchise] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const res = await api.get('/franchises/my');
                setFranchise(res.data);
            } catch (err) {
                console.error("Failed to fetch shop settings");
            } finally {
                setLoading(false);
            }
        };
        fetchShop();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
        </div>
    );

    if (!franchise) return (
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-gray-100 dark:border-white/5">
            <ShieldCheck className="w-12 h-12 text-danger mx-auto mb-4" />
            <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Access Violation</h2>
            <p className="text-sm text-gray-500 mt-2">Franchise node data not found or unauthorized.</p>
        </div>
    );

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-primary" /> Configuration Hub
                    </p>
                    <h1 className="text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Shop Settings</h1>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={franchise.status === 'approved' ? 'success' : 'warning'} className="h-10 px-6 rounded-xl font-black italic tracking-widest text-xs">
                        {franchise.status?.toUpperCase()} NODE
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Core Data Card */}
                <Card className="lg:col-span-2 border-none shadow-premium overflow-hidden">
                    <CardHeader className="p-8 bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5">
                        <div className="flex items-center gap-3">
                            <Building2 className="w-6 h-6 text-primary" />
                            <h2 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">Store Infrastructure</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 space-y-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Legal Franchise Name</label>
                                <p className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{franchise.franchiseName}</p>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Operational Region</label>
                                <p className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{franchise.region}</p>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Node ID</label>
                                <p className="text-sm font-mono font-bold text-gray-400 bg-gray-50 dark:bg-white/5 p-2 rounded-lg truncate">{franchise._id}</p>
                            </div>
                            <div className="space-y-1.5 flex flex-col">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Join Date</label>
                                <p className="text-lg font-bold text-gray-900 dark:text-white uppercase tracking-tight">{new Date(franchise.createdAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                            <h3 className="text-xs font-black uppercase italic text-gray-400 mb-6 tracking-widest">Operator Ownership</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-5 rounded-2xl">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                        <User className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Principle Operator</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white uppercase">{franchise.ownerId?.name || 'Unknown'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-5 rounded-2xl">
                                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/20">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Network Email</p>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white">{franchise.ownerId?.email || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Fiscal Policies Card */}
                <div className="space-y-8">
                    <Card className="border-none shadow-premium overflow-hidden bg-primary text-white">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between">
                                <Percent className="w-8 h-8 opacity-20" />
                                < Zap className="w-5 h-5 text-white animate-pulse" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 pt-6">
                            <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em] mb-2">Network Commission Rate</p>
                            <h3 className="text-5xl font-black italic tracking-tighter mb-4">{franchise.commissionPercentage}%</h3>
                            <p className="text-xs font-medium text-white/70 leading-relaxed">
                                This is the standard commission share deducted from all terminal revenue for network maintenance.
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="border-none shadow-premium overflow-hidden">
                        <CardHeader className="p-6 pb-2">
                             <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Activity className="w-4 h-4" /> Node Health
                             </h3>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Status</span>
                                    <span className="text-xs font-black text-success uppercase">Active</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Latency</span>
                                    <span className="text-xs font-black text-gray-900 dark:text-white tracking-widest">0.4ms</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-gray-500 uppercase">Traffic</span>
                                    <span className="text-xs font-black text-gray-900 dark:text-white tracking-widest">Normal</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            
            <div className="flex justify-end p-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" /> System Managed Configuration - Edits restricted to Admin nodes
                </p>
            </div>
        </div>
    );
}
