"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Zap, ArrowRight, ShieldCheck, Mail, Lock, User, Building2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['franchisee', 'staff']),
    franchiseId: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');
    const [franchises, setFranchises] = useState([]);

    const { register, handleSubmit, formState: { errors, isSubmitting }, watch } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
        defaultValues: { role: 'franchisee' }
    });

    const currentRole = watch('role');

    useEffect(() => {
        if (currentRole === 'staff') {
            const fetchFranchises = async () => {
                try {
                    const res = await api.get('/franchises');
                    setFranchises(res.data);
                } catch (err) {
                    console.error("Failed to fetch available franchises");
                }
            };
            fetchFranchises();
        }
    }, [currentRole]);

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError('');
            const response = await api.post('/auth/register', data);
            login(response.data, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please contact system admin.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2.5 group mb-6">
                        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            < Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                            FLOW<span className="text-primary not-italic">CMS</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Create Account</h1>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Join the management network</p>
                </div>

                <Card className="border-none shadow-premium overflow-hidden">
                    <CardHeader className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 py-6">
                        <div className="flex items-center justify-center gap-6">
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold mb-1 shadow-lg shadow-primary/20">1</div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Basics</span>
                            </div>
                            <div className="w-12 h-[1px] bg-gray-200 dark:bg-white/10 mt-[-20px]" />
                            <div className="flex flex-col items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 flex items-center justify-center font-bold mb-1 border border-gray-200 dark:border-white/10">2</div>
                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Finalize</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger animate-shake">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                                </div>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Full Name"
                                    type="text"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    placeholder="John Doe"
                                    className="bg-gray-50 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
                                />
                                <Input
                                    label="Email Address"
                                    type="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    placeholder="your@email.com"
                                    className="bg-gray-50 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Input
                                    label="Password"
                                    type="password"
                                    {...register('password')}
                                    error={errors.password?.message}
                                    placeholder="••••••••"
                                    className="bg-gray-50 dark:bg-white/5 border-none h-12 rounded-xl font-bold"
                                />
                                <div className="space-y-1.5 flex flex-col">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Your Role</label>
                                    <select 
                                        {...register('role')} 
                                        className="h-12 bg-gray-100 dark:bg-slate-800 border-none rounded-xl font-bold uppercase px-4 text-sm appearance-none outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer text-gray-900 dark:text-white"
                                    >
                                        <option value="franchisee">Franchisee</option>
                                        <option value="staff">Staff</option>
                                    </select>
                                    {errors.role && <p className="text-[10px] text-danger font-bold mt-1 uppercase">{errors.role.message}</p>}
                                </div>
                            </div>

                            {currentRole === 'staff' && (
                                <div className="space-y-1.5 flex flex-col animate-in slide-in-from-top-2 duration-300">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Select Franchise</label>
                                    <select 
                                        {...register('franchiseId')} 
                                        className="h-12 bg-gray-100 dark:bg-slate-800 border-none rounded-xl font-bold uppercase px-4 text-sm appearance-none outline-none focus:ring-2 focus:ring-primary/20 text-gray-900 dark:text-white"
                                    >
                                        <option value="">Choose your location...</option>
                                        {franchises.map((f: any) => (
                                            <option key={f._id} value={f._id}>{f.franchiseName}</option>
                                        ))}
                                    </select>
                                    {errors.franchiseId && <p className="text-[10px] text-danger font-bold mt-1 uppercase">{errors.franchiseId.message}</p>}
                                </div>
                            )}

                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-2xl italic font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                                isLoading={isSubmitting}
                            >
                                CREATE ACCOUNT <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">
                                Already Registered? {' '}
                                <Link href="/login" className="text-primary hover:underline underline-offset-4">LOGIN</Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

