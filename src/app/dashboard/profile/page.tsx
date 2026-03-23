"use client";
import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User, Mail, Lock, Shield, Save, CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export default function ProfilePage() {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password && formData.password !== formData.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const res = await api.put('/auth/profile', {
                name: formData.name,
                email: formData.email,
                password: formData.password || undefined
            });
            
            // Atomic state refresh
            updateUser(res.data);
            
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
            <div className="px-4 md:px-0">
                <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Account Settings</h1>
                <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-tight italic">Manage your operator identity and security credentials.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Card */}
                <Card className="lg:col-span-1 border-none shadow-premium bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden self-start">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-[2rem] bg-primary flex items-center justify-center text-3xl text-white font-black shadow-2xl shadow-primary/30 mb-6 relative group overflow-hidden">
                            {user?.name?.charAt(0)}
                            <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase italic">{user?.name}</h2>
                        <Badge className="mt-2 bg-primary/10 text-primary border-none px-4 py-1 font-black uppercase tracking-[0.2em] text-[10px]">
                            {user?.role}
                        </Badge>
                        <div className="w-full h-[1px] bg-gray-100 dark:bg-white/5 my-6" />
                        <div className="space-y-4 w-full text-left">
                            <div className="flex items-center gap-3 text-gray-500">
                                <Mail className="w-4 h-4" />
                                <span className="text-[11px] font-bold truncate">{user?.email}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-500">
                                <Shield className="w-4 h-4" />
                                <span className="text-[11px] font-bold uppercase tracking-widest">{user?.isApproved ? 'Verified Operator' : 'Pending Verification'}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Edit Form */}
                <Card className="lg:col-span-2 border-none shadow-premium bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white italic">Operator Identity</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Update your personal information</p>
                            </div>
                            {success && (
                                <div className="flex items-center gap-2 text-success animate-in fade-in zoom-in duration-300">
                                    <CheckCircle className="w-4 h-4" />
                                    <span className="text-[10px] font-black uppercase tracking-widest">Saved</span>
                                </div>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 md:p-10">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Public Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold italic"
                                    placeholder="Operator Name"
                                />
                                <Input
                                    label="Contact Email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold opacity-70"
                                    placeholder="operator@mesh.com"
                                    disabled
                                />
                            </div>

                            <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary italic">Security Upgrade</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        label="New Nexus Key (Password)"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                                        placeholder="Leave blank to keep current"
                                    />
                                    <Input
                                        label="Confirm Nexus Key"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                                        placeholder="Repeat new password"
                                    />
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button 
                                    type="submit" 
                                    disabled={loading}
                                    className="w-full md:w-auto px-12 h-14 rounded-2xl shadow-xl shadow-primary/20 font-black italic uppercase tracking-[0.2em] text-xs"
                                >
                                    {loading ? 'Transmitting...' : 'Commit Changes'}
                                    <Save className="ml-3 w-4 h-4" />
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function Badge({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${className}`}>
            {children}
        </span>
    );
}
