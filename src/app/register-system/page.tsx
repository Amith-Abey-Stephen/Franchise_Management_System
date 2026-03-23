"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Zap, Globe, ArrowLeft , ArrowRight, ShieldCheck, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function RegisterSystemPage() {
    const [formData, setFormData] = useState({
        systemName: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/systems/register', formData);
            setSubmitted(true);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create system");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium p-12 text-center space-y-8 border border-gray-100 dark:border-white/5">
                    <div className="w-24 h-24 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto animate-pulse">
                        <Rocket className="w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">System Deployed!</h1>
                        <p className="text-sm font-medium text-gray-500 mt-4 leading-relaxed">
                            Your master franchise system **{formData.systemName}** is now active. <br/>You can now log in and start onboarding your first shops.
                        </p>
                    </div>
                    <Link href="/login" className="flex items-center justify-center gap-2 w-full py-5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                        Log In to Dashboard <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 py-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            
            <Link href="/" className="mb-12 flex items-center space-x-3 group animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                    FLOW<span className="text-primary not-italic">CMS</span>
                </span>
            </Link>

            <div className="max-w-4xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Left Side */}
                <div className="md:w-5/12 bg-gray-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none mb-6">Launch Your <br/>Network.</h2>
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Pure Tenant Isolation</p>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="p-2 bg-white/5 rounded-lg border border-white/5"><Globe className="w-5 h-5 text-primary" /></div>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Global Operational Sync</p>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Right Side */}
                <div className="md:w-7/12 p-8 md:p-14 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Organization Registration</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Register your master franchise brand</p>
                        </div>

                        <div className="space-y-6">
                            <Input 
                                label="Master System Name"
                                required
                                value={formData.systemName}
                                onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                                placeholder="e.g. Thomson Global"
                                className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase text-xs"
                            />

                            <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">System Administrator Credentials</p>
                                <Input 
                                    label="Full Name"
                                    required
                                    value={formData.adminName}
                                    onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                                    placeholder="Your Full Name"
                                    className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input 
                                        label="Business Email"
                                        required
                                        type="email"
                                        value={formData.adminEmail}
                                        onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                                        placeholder="admin@brand.com"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                    />
                                    <Input 
                                        label="Access Password"
                                        required
                                        type="password"
                                        value={formData.adminPassword}
                                        onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                                        placeholder="••••••••"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button 
                            type="submit" 
                            disabled={loading}
                            className="w-full h-16 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-2xl shadow-primary/20 transition-all active:scale-95"
                        >
                            {loading ? "INITIALIZING PLATFORM..." : "CREATE MASTER SYSTEM"}
                        </Button>
                    </form>
                </div>
            </div>
            
            <Link href="/" className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] hover:text-primary transition-colors flex items-center gap-2">
                <ArrowLeft className="w-3 h-3" /> EXIT TO TERMINAL
            </Link>
        </div>
    );
}
