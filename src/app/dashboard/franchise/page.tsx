"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Globe, Activity, ShieldCheck, Zap, Percent, Box, ArrowRight } from 'lucide-react';
import api from '@/lib/api';
import ProtectedRoute from '@/components/ProtectedRoute';
import Link from 'next/link';

export default function FranchiseDashboard() {
    const [franchise, setFranchise] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [franchiseRes, productsRes] = await Promise.all([
                    api.get('/franchises/my'),
                    api.get('/products')
                ]);
                setFranchise(franchiseRes.data);
                setProducts(productsRes.data.slice(0, 4));
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                <p className="text-sm font-medium text-gray-400">Loading...</p>
            </div>
        );
    }

    if (!franchise) {
        return (
            <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl shadow-premium border border-gray-100 dark:border-white/5">
                <ShieldCheck className="w-12 h-12 text-danger mx-auto mb-4" />
                <h2 className="text-xl font-black uppercase italic tracking-tighter text-gray-900 dark:text-white">Store Unavailable</h2>
                <p className="text-sm text-gray-500 mt-2">Could not find your store details.</p>
            </div>
        );
    }

    return (
        <ProtectedRoute allowedRoles={['franchisee']}>
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">My Hub</h1>
                        <p className="text-gray-500 mt-1 font-bold uppercase text-[10px] tracking-widest">Store: {franchise.franchiseName}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Primary Focus: Commission */}
                    <Card className="lg:col-span-2 border-none shadow-premium bg-primary text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-white/20 transition-all duration-700" />
                        <CardHeader className="p-10 pb-0 flex flex-row items-center justify-between relative z-10">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.3em]">Operational Level: {franchise.parentId ? 'Regional Node' : 'Master Hub'}</p>
                                <h2 className="text-2xl font-black uppercase italic tracking-tighter">Network Commission</h2>
                            </div>
                            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
                                <Percent className="w-8 h-8 text-white" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 relative z-10">
                            <h3 className="text-8xl font-black italic tracking-tighter mb-4">{franchise.commissionPercentage}%</h3>
                            <div className="flex items-center gap-4 pt-6 border-t border-white/10">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                    <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Online</span>
                                </div>
                                <div className="w-px h-3 bg-white/20" />
                                <span className="text-[10px] font-black uppercase tracking-widest opacity-60 italic">Store is active in mesh</span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Node Metadata Section */}
                    <div className="space-y-8">
                        <Card className="border-none shadow-premium overflow-hidden bg-gray-900 text-white p-6 rounded-[2.5rem]">
                            <h3 className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-6 italic">Regional Authority</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-1">Region</p>
                                    <p className="text-2xl font-black italic uppercase tracking-tighter">{franchise.region}</p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-2">Network Depth</p>
                                    <div className="flex items-center gap-2">
                                        <div className="px-3 py-1 bg-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                            {franchise.parentId ? 'L2 Branch' : 'L1 Master'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="border-none shadow-premium overflow-hidden p-6 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-gray-100 dark:border-white/5">
                            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Master Identity</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                                    {franchise.ownerId?.name?.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-xs font-black text-gray-900 dark:text-white uppercase italic">{franchise.ownerId?.name}</p>
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{franchise.ownerId?.email}</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <Card className="border-none shadow-premium overflow-hidden">
                        <CardHeader className="p-8 border-transparent bg-gray-50/50 dark:bg-white/5 flex flex-row items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Box className="w-6 h-6 text-primary" />
                                <h2 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">Active Product List</h2>
                            </div>
                            <Link href="/dashboard/franchise/products" className="text-xs font-black text-primary uppercase italic flex items-center gap-1 hover:underline">
                                Full Catalog <ArrowRight className="w-4 h-4" />
                            </Link>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="bg-transparent text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <th className="px-8 py-4">Item Name</th>
                                            <th className="px-8 py-4">Category</th>
                                            <th className="px-8 py-4 text-right">MSRP</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                        {products.map((p) => (
                                            <tr key={p._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-8 py-5">
                                                    <span className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-tight">{p.name}</span>
                                                </td>
                                                <td className="px-8 py-5 text-[10px] font-bold text-gray-400 uppercase">
                                                    {p.category}
                                                </td>
                                                <td className="px-8 py-5 text-right font-black italic text-sm text-primary">
                                                    ${p.basePrice.toFixed(2)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Footer Notice */}
                <div className="pt-10 flex justify-center pb-12">
                    <div className="px-8 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl flex items-center gap-4">
                        <Zap className="w-5 h-5 text-primary" />
                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                            Settings managed by <span className="text-gray-900 dark:text-white font-black italic">Store Admin</span>
                        </p>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    );
}
