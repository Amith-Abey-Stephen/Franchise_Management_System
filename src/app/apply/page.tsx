"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Zap, MapPin, User, Mail, Lock, CheckCircle2, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, Globe, Building2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import api from '@/lib/api';

export default function ApplyPage() {
    const [organizations, setOrganizations] = useState([]);
    const [formData, setFormData] = useState({
        franchiseName: '',
        region: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: '',
        organizationId: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingOrgs, setFetchingOrgs] = useState(true);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const fetchOrgs = async () => {
            try {
                const res = await api.get('/systems/active');
                setOrganizations(res.data);
            } catch (err) {
                console.error("Failed to fetch systems");
            } finally {
                setFetchingOrgs(false);
            }
        };
        fetchOrgs();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.organizationId) {
            alert("Choose a Master Franchise System first.");
            return;
        }
        setLoading(true);
        try {
            await api.post('/franchises/apply', formData);
            setSubmitted(true);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to submit application");
        } finally {
            setLoading(false);
        }
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[3rem] shadow-premium p-12 text-center space-y-8 border border-gray-100 dark:border-white/5 animate-in zoom-in duration-500">
                    <div className="w-24 h-24 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto animate-bounce">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Application Sent!</h1>
                        <p className="text-sm font-medium text-gray-500 mt-4 leading-relaxed">
                            Thank you for your interest. <br/>The master franchise team will review your node request and contact you shortly.
                        </p>
                    </div>
                    <Link href="/login" className="flex items-center justify-center gap-2 w-full py-5 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                        Back to Terminal <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 py-20 relative overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -z-10" />

            <Link href="/" className="mb-12 flex items-center space-x-3 group animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="bg-primary p-2.5 rounded-2xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                    <Zap className="h-7 w-7 text-white" />
                </div>
                <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                    FLOW<span className="text-primary not-italic">CMS</span>
                </span>
            </Link>

            <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-premium overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                {/* Visual Sidebar */}
                <div className="md:w-[40%] bg-gradient-to-br from-indigo-700 via-primary to-blue-700 p-12 text-white flex flex-col justify-between relative">
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full text-[9px] font-black uppercase tracking-widest mb-6 border border-white/20">
                            <Sparkles className="w-3 h-3" /> Multi-Tenant Network
                        </div>
                        <h2 className="text-5xl font-black uppercase italic leading-[0.85] tracking-tighter mb-4">Launch Your <br/>Node <br/>Instantly.</h2>
                    </div>
                    
                    <div className="space-y-4 relative z-10">
                        <div className="p-6 bg-white/10 backdrop-blur-md rounded-[2rem] border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
                                    <Globe className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h4 className="text-xs font-black uppercase tracking-widest leading-none">Smart Routing</h4>
                                    <p className="text-[10px] font-bold text-white/60 uppercase tracking-tighter mt-1">Direct to head office</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Registration Form */}
                <div className="md:w-[60%] p-8 md:p-14 bg-white dark:bg-slate-900">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">Partner Application</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed">Join a world-class franchise network today.</p>
                        </div>

                        <div className="space-y-6">
                            {/* System Selection Dropdown */}
                            <div className="relative group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 mb-2 block">1. Select Master Franchise System</label>
                                <div className="relative">
                                    <select 
                                        required
                                        value={formData.organizationId}
                                        onChange={(e) => setFormData({...formData, organizationId: e.target.value})}
                                        className="w-full h-16 bg-primary/5 hover:bg-primary/10 border-2 border-primary/20 rounded-2xl pl-12 pr-10 appearance-none font-black uppercase text-xs tracking-widest outline-none transition-all focus:border-primary/40 text-primary cursor-pointer disabled:opacity-50"
                                        disabled={fetchingOrgs}
                                    >
                                        <option value="">{fetchingOrgs ? "CONNECTING TO INFRASTRUCTURE..." : "CHOOSE A BRAND NETWORK"}</option>
                                        {organizations.map((org: any) => (
                                            <option key={org._id} value={org._id}>{org.name}</option>
                                        ))}
                                    </select>
                                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary" />
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100 dark:border-white/5">
                                <div className="relative">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block italic">New Site Identity</label>
                                    <Input 
                                        required
                                        value={formData.franchiseName}
                                        onChange={(e) => setFormData({...formData, franchiseName: e.target.value})}
                                        placeholder="Hub Name (e.g. Phoenix Hub)"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 mb-2 block italic">Operations Region</label>
                                    <Input 
                                        required
                                        value={formData.region}
                                        onChange={(e) => setFormData({...formData, region: e.target.value})}
                                        placeholder="Territory (e.g. West Coast)"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase"
                                    />
                                </div>
                            </div>

                            <div className="pt-8 space-y-4">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-300 ml-1">Manager Credentials</p>
                                <Input 
                                    required
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({...formData, ownerName: e.target.value})}
                                    placeholder="Full Legal Name"
                                    className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input 
                                        required
                                        type="email"
                                        value={formData.ownerEmail}
                                        onChange={(e) => setFormData({...formData, ownerEmail: e.target.value})}
                                        placeholder="Corporate Email"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                                    />
                                    <Input 
                                        required
                                        type="password"
                                        value={formData.ownerPassword}
                                        onChange={(e) => setFormData({...formData, ownerPassword: e.target.value})}
                                        placeholder="Set Private Key"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6">
                            <Button 
                                type="submit" 
                                disabled={loading || !formData.organizationId}
                                className="w-full h-18 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-[2rem] font-black uppercase italic tracking-[.3em] text-xs shadow-2xl transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-3"
                            >
                                {loading ? "TRANSMITTING DATA..." : (
                                    <>SECURE PARTNERSHIP <ArrowRight className="w-5 h-5" /></>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
            
            <Link href="/" className="mt-12 text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] hover:text-primary transition-all flex items-center gap-2 group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Exit to Terminal
            </Link>
        </div>
    );
}
