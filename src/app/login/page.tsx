"use client";
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Zap, Lock, Mail, ArrowRight, ShieldCheck, Globe } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

const loginSchema = z.object({
    email: z.string().email('Invalid network identify signature'),
    password: z.string().min(6, 'Access key must be at least 6 characters'),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
    const { login } = useAuth();
    const [error, setError] = useState('');

    const { register, handleSubmit, formState: { errors, isSubmitting }, resetField } = useForm<LoginForm>({
        resolver: zodResolver(loginSchema)
    });

    const onSubmit = async (data: LoginForm) => {
        try {
            setError('');
            const response = await api.post('/auth/login', data);
            login(response.data, response.data.token);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Access Denied: Connection unstable');
            resetField('password'); // Preserve email, clear password
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

            <div className="w-full max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="text-center mb-10">
                    <Link href="/" className="inline-flex items-center space-x-2.5 group mb-6">
                        <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                            < Zap className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                            FLOW<span className="text-primary not-italic">CMS</span>
                        </span>
                    </Link>
                    <h1 className="text-3xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Sign In</h1>
                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mt-2">Access your dashboard</p>
                </div>

                <Card className="border-none shadow-premium overflow-hidden">
                    <CardContent className="p-6 md:p-10 pt-10 md:pt-12">
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-danger/10 border border-danger/20 rounded-xl flex items-center gap-3 text-danger animate-shake">
                                    <ShieldCheck className="w-5 h-5 flex-shrink-0" />
                                    <p className="text-xs font-bold uppercase tracking-tight">{error}</p>
                                </div>
                            )}

                            <div className="space-y-6">
                                <div className="relative">
                                    <Input
                                        label="Email Address"
                                        type="email"
                                        {...register('email')}
                                        error={errors.email?.message}
                                        placeholder="your@email.com"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-xl pl-12 font-bold"
                                    />
                                    <Mail className="absolute left-4 top-[40px] w-5 h-5 text-gray-400" />
                                </div>

                                <div className="relative">
                                    <Input
                                        label="Password"
                                        type="password"
                                        {...register('password')}
                                        error={errors.password?.message}
                                        placeholder="••••••••"
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-xl pl-12 font-bold"
                                    />
                                    <Lock className="absolute left-4 top-[40px] w-5 h-5 text-gray-400" />
                                </div>
                            </div>

                            <div className="flex items-center justify-between py-2">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary/20 transition-all cursor-pointer" />
                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-600 transition-colors">Remember me</span>
                                </label>
                                <Link href="#" className="text-xs font-bold text-primary uppercase tracking-widest hover:underline underline-offset-4">Forgot password?</Link>
                            </div>

                            <Button 
                                type="submit" 
                                className="w-full h-14 rounded-2xl italic font-black shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]" 
                                isLoading={isSubmitting}
                            >
                                SIGN IN <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </form>

                        <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5 text-center">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest leading-loose">
                                Don't have an account? 
                                <Link href="/apply" className="ml-2 text-primary hover:underline underline-offset-4 inline-flex items-center gap-1 group">
                                    Apply Now <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
