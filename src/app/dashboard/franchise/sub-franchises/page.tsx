"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Network, Plus, MapPin, User, Mail, Lock, Search, Filter } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SubFranchisesPage() {
    const { user } = useAuth();
    const [subNodes, setSubNodes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ 
        franchiseName: '', 
        region: '', 
        ownerName: '', 
        ownerEmail: '', 
        ownerPassword: '' 
    });

    useEffect(() => {
        fetchSubNodes();
    }, []);

    const fetchSubNodes = async () => {
        try {
            const res = await api.get('/franchises/sub-nodes');
            setSubNodes(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // When a franchisee creates one, the backend sets parentId to current franchisee node
            await api.post('/franchises', form);
            setIsModalOpen(false);
            setForm({ franchiseName: '', region: '', ownerName: '', ownerEmail: '', ownerPassword: '' });
            fetchSubNodes();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to create node");
        }
    };

    const columns = [
        { 
            header: 'Node Identity', 
            accessor: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black">
                        {row.franchiseName.charAt(0)}
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-black text-gray-900 dark:text-white uppercase italic leading-none">{row.franchiseName}</p>
                            {row._id === user?.franchiseId && (
                                <span className="bg-primary/10 text-primary text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-widest">Main Hub</span>
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mt-1">{row.region}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Manager Info', 
            accessor: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase leading-none mb-1">{row.ownerId?.name || 'Unassigned'}</span>
                    <span className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{row.ownerId?.email}</span>
                </div>
            )
        },
        { 
            header: 'Status', 
            accessor: (row: any) => (
                <Badge variant={row.status === 'approved' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'}>
                    {row.status}
                </Badge>
            )
        }
    ];

    const mainNode = subNodes.find((row: any) => row._id === user?.franchiseId);
    const otherNodes = subNodes.filter((row: any) => row._id !== user?.franchiseId);

    return (
        <ProtectedRoute allowedRoles={['franchisee']}>
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 p-2 md:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Network Registry</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-tight italic">Monitor your primary hub and regional branch telemetry.</p>
                    </div>
                    <Button onClick={() => setIsModalOpen(true)} className="rounded-2xl h-14 md:h-16 px-8 shadow-xl shadow-primary/20 font-black italic uppercase tracking-widest text-[10px] md:text-xs">
                        <Plus className="w-5 h-5 mr-3" /> REQUEST NEW BRANCH
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6 md:space-y-8">
                        {/* THE PRIMARY HUB */}
                        {mainNode && (
                            <Card className="border-none shadow-premium bg-gray-900 text-white p-6 md:p-12 rounded-[2.5rem] relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
                                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 md:gap-8">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                                        <div className="w-14 h-14 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white text-gray-900 flex items-center justify-center text-2xl md:text-3xl font-black italic shadow-2xl shrink-0">
                                            {mainNode.franchiseName.charAt(0)}
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter leading-none">{mainNode.franchiseName}</h3>
                                                <Badge className="bg-primary text-[7px] md:text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 border-none h-fit">MAIN HUB</Badge>
                                            </div>
                                            <p className="text-[8px] md:text-xs font-bold text-white/40 uppercase tracking-widest italic">{mainNode.region} OPERATIONAL CENTER</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-start md:items-end gap-2 border-t border-white/10 md:border-none pt-4 md:pt-0">
                                        <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-white/30 italic">MESH IDENTITY: {mainNode._id.slice(-8)}</p>
                                        <Badge variant="success" className="px-4 md:px-6 py-1.5 md:py-2 rounded-lg md:rounded-xl font-black uppercase text-[8px] md:text-xs italic border-white/10 tracking-widest shadow-xl">ENFORCED & ACTIVE</Badge>
                                    </div>
                                </div>
                            </Card>
                        )}

                        <Card className="border-none shadow-premium overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem]">
                            <CardHeader className="p-6 md:p-10 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
                                <Network className="w-6 h-6 text-primary" />
                                <div>
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white italic">Regional Nodes</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Sub-franchise mesh members</p>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto selection:bg-primary/10">
                                {loading ? (
                                    <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Scanning Regional Mesh...</p>
                                    </div>
                                ) : (
                                    <div className="p-4 md:p-10">
                                        <DataTable columns={columns} data={otherNodes} keyExtractor={(row) => row._id} />
                                        {otherNodes.length === 0 && (
                                            <div className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic opacity-60">No sub-nodes detected in this sector.</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="border-none bg-primary text-white p-6 rounded-[2.5rem] shadow-xl shadow-primary/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10" />
                            <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-60 mb-6">Network Health</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-3xl font-black italic">{subNodes.length}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-80">Total Sub-Branches</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-black italic">{subNodes.filter((s:any) => s.status === 'approved').length}</p>
                                    <p className="text-[10px] font-bold uppercase opacity-80">Active Nodes</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Sub-Franchise Application">
                <form onSubmit={handleApply} className="space-y-8 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Branch Name"
                            required
                            value={form.franchiseName}
                            onChange={(e) => setForm({ ...form, franchiseName: e.target.value })}
                            placeholder="e.g. West Hub"
                            className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase tracking-tight"
                        />
                        <Input
                            label="Region/City"
                            required
                            value={form.region}
                            onChange={(e) => setForm({ ...form, region: e.target.value })}
                            placeholder="e.g. Manchester"
                            className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase tracking-tight"
                        />
                    </div>
                    
                    <div className="pt-6 border-t border-gray-100 dark:border-white/5 space-y-6">
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Sub-Manager Credentials</p>
                        <Input
                            label="Full Name"
                            required
                            value={form.ownerName}
                            onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                            placeholder="Manager Name"
                            className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase tracking-tight"
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Input
                                label="Manager Email"
                                required
                                type="email"
                                value={form.ownerEmail}
                                onChange={(e) => setForm({ ...form, ownerEmail: e.target.value })}
                                placeholder="manager@branch.com"
                                className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                            />
                            <Input
                                label="Manager Password"
                                required
                                type="password"
                                value={form.ownerPassword}
                                onChange={(e) => setForm({ ...form, ownerPassword: e.target.value })}
                                placeholder="••••••••"
                                className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold"
                            />
                        </div>
                    </div>

                    <Button type="submit" className="w-full h-16 rounded-[2rem] font-black uppercase italic tracking-widest text-sm shadow-2xl shadow-primary/20 transition-all hover:scale-[1.01] active:scale-95">
                        Submit Sub-Node Application
                    </Button>
                </form>
            </Modal>
        </ProtectedRoute>
    );
}
