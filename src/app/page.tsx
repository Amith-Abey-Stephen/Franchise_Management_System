import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { CheckCircle, BarChart3, Users, ShieldCheck, Globe, Zap, ArrowRight, Star, Twitter, Linkedin, Github, Facebook, MessageSquare } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-background selection:bg-primary selection:text-white">
            {/* Header */}
            <header className="px-6 lg:px-12 h-20 flex items-center border-b border-gray-100 dark:border-white/10 sticky top-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl z-50">
                <Link className="flex items-center justify-center space-x-2.5 group" href="/">
                    <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform duration-300">
                        < Zap className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                        FLOW<span className="text-primary not-italic">CMS</span>
                    </span>
                </Link>
                <nav className="ml-auto flex items-center gap-8">
                    <Link className="hidden md:block text-sm font-bold text-gray-500 hover:text-primary transition-colors tracking-tight" href="#features">FEATURES</Link>
                    <Link className="hidden md:block text-sm font-bold text-gray-500 hover:text-primary transition-colors tracking-tight" href="/login">LOGIN</Link>
                    <Link href="/register-system">
                        <Button size="sm" className="rounded-xl px-6 font-bold shadow-lg shadow-primary/20">DEPLOY SYSTEM</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-24 lg:py-40 overflow-hidden relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-20 animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] opacity-20"></div>
                    </div>
                    
                    <div className="container px-4 md:px-6 mx-auto text-center space-y-10">
                        <div className="inline-flex items-center space-x-3 bg-primary-soft/50 backdrop-blur-md border border-primary/20 text-primary px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase animate-in fade-in slide-in-from-bottom-4">
                            <span className="flex h-2 w-2 rounded-full bg-primary animate-ping" />
                            <span>v2.1 Open Network is Now Live</span>
                        </div>
                        <h1 className="text-5xl font-black tracking-tighter sm:text-6xl md:text-7xl lg:text-8xl max-w-5xl mx-auto leading-[0.9] text-gray-900 dark:text-white uppercase italic">
                            The Operating System for <span className="text-primary not-italic">Global Scale.</span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 font-medium leading-relaxed">
                            Engineered for high-growth franchises. Consolidate your entire operation into a single, high-performance command center.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-6">
                            <Link href="/register-system">
                                <Button size="lg" className="px-10 h-16 text-lg shadow-2xl shadow-primary/30 rounded-2xl font-black italic tracking-tight group">
                                    LAUNCH YOUR NETWORK <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Link>
                            <Link href="/apply">
                                <Button variant="outline" size="lg" className="px-10 h-16 text-lg rounded-2xl font-bold border-2 hover:bg-gray-100 dark:hover:bg-white/5 transition-all text-primary border-primary/20 hover:border-primary">
                                    JOIN EXISTING BRAND
                                </Button>
                            </Link>
                        </div>

                        {/* Social Proof */}
                        <div className="pt-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-700 flex flex-wrap justify-center gap-12 lg:gap-24 items-center">
                            <span className="text-2xl font-black tracking-tighter italic">FORBES</span>
                            <span className="text-2xl font-black tracking-tighter italic">TECHCRUNCH</span>
                            <span className="text-2xl font-black tracking-tighter italic">WIRED</span>
                            <span className="text-2xl font-black tracking-tighter italic">VERGE</span>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="w-full py-32 bg-slate-50 dark:bg-slate-950/50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col lg:flex-row items-end justify-between mb-20 gap-8">
                            <div className="max-w-2xl space-y-4">
                                <p className="text-primary font-black tracking-widest text-xs uppercase">Core Capabilities</p>
                                <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Built for the <br />1% of Operators</h2>
                            </div>
                            <p className="text-gray-500 max-w-sm font-medium">Enterprise infrastructure that scales with you, from your first location to your thousandth.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            <ThemeCard 
                                icon={<BarChart3 className="w-6 h-6" />} 
                                title="PREDICTIVE ANALYTICS" 
                                desc="Gain deep insights with AI-driven sales forecasting and visual trend analysis for every location." 
                            />
                            <ThemeCard 
                                icon={<Users className="w-6 h-6" />} 
                                title="TALENT ORCHESTRATION" 
                                desc="Efficiently manage roles, permissions, and performance for all your franchise employees." 
                            />
                            <ThemeCard 
                                icon={<Zap className="w-6 h-6" />} 
                                title="HYPER-POS SYSTEM" 
                                desc="Built-in point-of-sale system for frictionless transactions and immediate data synchronization." 
                            />
                            <ThemeCard 
                                icon={<ShieldCheck className="w-6 h-6" />} 
                                title="FORTRESS SECURITY" 
                                desc="Enterprise-grade security with role-based access control and military-strength encryption." 
                            />
                            <ThemeCard 
                                icon={<Globe className="w-6 h-6" />} 
                                title="GLOBAL DOMINANCE" 
                                desc="Easily manage multiple regions and franchise territories from a single centralized hub." 
                            />
                            <ThemeCard 
                                icon={<Star className="w-6 h-6" />} 
                                title="AUTONOMOUS SUPPLY" 
                                desc="Automated stock updates and low-inventory notifications to keep your operations running smoothly." 
                            />
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="w-full py-32 overflow-hidden bg-primary relative">
                    <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-white mb-8 uppercase italic">Ready to automate your future?</h2>
                        <p className="text-primary-soft text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto opacity-90">
                            Join over 5,000+ franchise locations using FlowCMS to dominate their respective markets.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <Link href="/register-system">
                                <Button variant="ghost" size="lg" className="bg-white text-[#4f46e5] hover:bg-slate-50 px-12 h-16 text-lg font-black italic rounded-2xl shadow-2xl">
                                    START YOUR SYSTEM
                                </Button>
                            </Link>
                            <Link href="/apply">
                                <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10 px-12 h-16 text-lg font-bold rounded-2xl">
                                    JOIN A NETWORK
                                </Button>
                            </Link>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-10 left-10 w-64 h-64 border-4 border-white rounded-full animate-ping" />
                        <div className="absolute bottom-20 right-20 w-96 h-96 border-4 border-white rounded-full opacity-20" />
                    </div>
                </section>
            </main>


            {/* Footer */}
            <footer className="border-t border-gray-100 dark:border-white/10 py-16 bg-white dark:bg-slate-950">
                <div className="container px-6 md:px-12 mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
                    <div className="flex flex-col gap-6">
                        <Link className="flex items-center space-x-2.5 group" href="/">
                            <div className="bg-primary p-2 rounded-xl">
                                <Zap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">
                                FLOW<span className="text-primary not-italic">CMS</span>
                            </span>
                        </Link>
                        <p className="text-sm text-gray-500 max-w-xs font-medium">The world's most advanced franchise management engine. Built for performance, scale, and uncompromising reliability.</p>
                        <div className="flex gap-4">
                            <Link href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Linkedin className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Github className="w-5 h-5" />
                            </Link>
                            <Link href="#" className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center text-gray-400 hover:text-primary transition-colors">
                                <Facebook className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-12 lg:gap-24">
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Product</h4>
                            <ul className="space-y-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                                <li><Link className="hover:text-primary transition-colors" href="/login">OPERATIONS</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/login">ANALYTICS</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/login">INVENTORY</Link></li>
                            </ul>
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Company</h4>
                            <ul className="space-y-2 text-sm font-bold text-gray-600 dark:text-gray-400">
                                <li><Link className="hover:text-primary transition-colors" href="mailto:sales@flowcms.io">TALK TO SALES</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="/login">MEMBER ACCESS</Link></li>
                                <li><Link className="hover:text-primary transition-colors" href="#">KNOWLEDGE BASE</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="container px-6 md:px-12 mx-auto mt-20 pt-8 border-t border-gray-50 dark:border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">
                    <span>© 2026 FLOWCMS INC. • ALL RIGHTS RESERVED</span>
                    <div className="flex gap-8">
                        <Link className="hover:text-primary transition-colors" href="#">PRIVACY</Link>
                        <Link className="hover:text-primary transition-colors" href="#">TERMS</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function ThemeCard({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) {
    return (
        <div className="group p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-transparent hover:border-primary/20 hover:shadow-premium transition-all duration-500 hover:-translate-y-2">
            <div className="p-4 bg-primary-soft text-primary rounded-2xl w-fit mb-8 group-hover:bg-primary group-hover:text-white group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-primary/30">
                {icon}
            </div>
            <h3 className="text-xl font-black mb-4 tracking-tighter uppercase italic text-gray-900 dark:text-white">{title}</h3>
            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm font-medium">{desc}</p>
        </div>
    );
}



