"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { 
    Globe, Check, X, ShieldAlert, BarChart3, Database, 
    Plus, Search, Edit2, Trash2, XCircle, ShieldCheck, 
    ArrowLeft, Loader2 
} from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

export default function SuperAdminOrgsPage() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<any>(null);
    const [formLoading, setFormLoading] = useState(false);

    // Form Stats
    const [formData, setFormData] = useState({
        systemName: '',
        adminName: '',
        adminEmail: '',
        adminPassword: ''
    });

    useEffect(() => {
        fetchOrgs();
    }, []);

    const fetchOrgs = async () => {
        try {
            const res = await api.get('/systems');
            setOrganizations(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        try {
            if (editingOrg) {
                await api.put(`/systems/${editingOrg._id}`, { name: formData.systemName });
            } else {
                await api.post('/systems/register', formData);
            }
            fetchOrgs();
            setIsFormOpen(false);
            setEditingOrg(null);
            setFormData({ systemName: '', adminName: '', adminEmail: '', adminPassword: '' });
        } catch (err: any) {
            alert(err.response?.data?.message || "Operation failed");
        } finally {
            setFormLoading(false);
        }
    };

    const updateStatus = async (id: string, status: string) => {
        if (!confirm(`Switch network state to ${status}?`)) return;
        try {
            await api.put(`/systems/${id}/status`, { status });
            fetchOrgs();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to update status");
        }
    };

    const deleteOrg = async (id: string) => {
        if (!confirm("CRITICAL ACTION: This will permanently purge ALL data, users, and nodes associated with this system. Proceed?")) return;
        try {
            await api.delete(`/systems/${id}`);
            fetchOrgs();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to purge system");
        }
    };

    const openEdit = (row: any) => {
        setEditingOrg(row);
        setFormData({ 
            systemName: row.name, 
            adminName: row.ownerId?.name || '', 
            adminEmail: row.ownerId?.email || '', 
            adminPassword: '' 
        });
        setIsFormOpen(true);
    };

    const filteredOrgs = organizations.filter((org: any) => 
        org.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        org.ownerId?.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const columns = [
        { 
            header: 'Master Brand', 
            accessor: (row: any) => (
                <div className="flex items-center gap-3 md:gap-4 min-w-[150px]">
                    <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gray-900 dark:bg-white dark:text-gray-900 text-white flex items-center justify-center font-black italic shadow-lg shrink-0">
                        {row.name.charAt(0)}
                    </div>
                    <div className="flex flex-col truncate">
                        <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter italic truncate">{row.name}</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mt-1">ID: {row._id.slice(-6)}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'Owner', 
            accessor: (row: any) => (
                <div className="flex flex-col min-w-[120px]">
                    <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase leading-none mb-1">{row.ownerId?.name || 'ROOT'}</span>
                    <span className="text-[10px] text-gray-400 font-medium truncate max-w-[120px]">{row.ownerId?.email}</span>
                </div>
            )
        },
        { 
            header: 'State', 
            accessor: (row: any) => (
                <Badge variant={row.status === 'active' ? 'success' : row.status === 'pending' ? 'warning' : 'danger'}>
                    {row.status}
                </Badge>
            )
        },
        { 
            header: 'Control Actions', 
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    {row.status === 'pending' ? (
                        <Button 
                            size="sm" 
                            onClick={() => updateStatus(row._id, 'active')}
                            className="bg-success/10 hover:bg-success text-success hover:text-white rounded-xl h-8 px-3 transition-all"
                        >
                            <Check className="w-3.5 h-3.5" />
                        </Button>
                    ) : (
                        <Button 
                            size="sm" 
                            onClick={() => updateStatus(row._id, row.status === 'active' ? 'suspended' : 'active')}
                            className={`${row.status === 'active' ? 'bg-orange-500/10 text-orange-500 hover:bg-orange-500' : 'bg-primary/10 text-primary hover:bg-primary'} hover:text-white rounded-xl h-8 px-3 transition-all`}
                        >
                            {row.status === 'active' ? <XCircle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                        </Button>
                    )}
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => openEdit(row)}
                        className="text-gray-400 hover:text-primary transition-colors"
                    >
                        <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => deleteOrg(row._id)}
                        className="text-gray-400 hover:text-danger hover:bg-danger/5 transition-all"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['system-superadmin']}>
            <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 p-2 md:p-0">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 md:gap-8 bg-gray-50/50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-primary/10 text-primary border-none text-[8px] font-black tracking-[0.2em] px-2 py-0.5">ORCHESTRAL LAYER</Badge>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Managed Systems</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium max-w-lg leading-relaxed">Global governance over the multi-tenant mesh of franchise brands.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-4 bg-white dark:bg-slate-900 p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5">
                            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary font-black">
                                {organizations.length}
                            </div>
                            <div className="pr-4">
                                <p className="text-[10px] font-black text-gray-400 uppercase leading-none mb-1">Scale</p>
                                <p className="text-xs font-bold text-gray-900 dark:text-white uppercase italic tracking-tighter">Global Tenants</p>
                            </div>
                        </div>
                        <Button 
                            onClick={() => { setEditingOrg(null); setIsFormOpen(true); }}
                            className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl h-14 md:h-16 px-6 md:px-8 font-black uppercase italic tracking-widest text-[10px] md:text-xs shadow-xl transition-all hover:scale-[1.02] flex items-center gap-3 shrink-0"
                        >
                            <Plus className="w-5 h-5" /> CREATE NEW SYSTEM
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
                    <Card className="xl:col-span-3 border-none shadow-premium overflow-hidden bg-white dark:bg-slate-900 rounded-[2.5rem]">
                        <CardHeader className="p-6 md:p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="p-2.5 bg-gray-900 text-white rounded-xl shadow-lg">
                                    <Database className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white italic">Master System Registry</h2>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Tenant Status & Governance</p>
                                </div>
                            </div>

                            {/* Search Bar */}
                            <div className="relative w-full md:w-72 group">
                                <Input 
                                    className="h-11 bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-10 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/20 transition-all"
                                    placeholder="SEARCH SYSTEM OR OWNER..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-0 overflow-x-auto">
                            {loading ? (
                                <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Reading platform ledger...</p>
                                </div>
                            ) : (
                                <div className="p-4 md:p-8">
                                    <DataTable columns={columns} data={filteredOrgs} keyExtractor={(row) => row._id} />
                                    {filteredOrgs.length === 0 && (
                                        <div className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-3xl mt-4 border border-dashed border-gray-200 dark:border-white/10">
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No matching systems found in the mesh.</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="space-y-6">
                        <Card className="border-none bg-success text-white p-8 rounded-[2.5rem] shadow-xl shadow-success/20 overflow-hidden relative group">
                             <BarChart3 className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 group-hover:scale-110 transition-transform duration-700" />
                             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Active Ecosystem</h4>
                             <p className="text-5xl font-black italic mb-1">{organizations.filter((o:any) => o.status === 'active').length}</p>
                             <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest leading-none">Operational Hubs</p>
                        </Card>

                        <Card className="border-none bg-orange-500 text-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-500/20 overflow-hidden relative group">
                             <ShieldAlert className="absolute -right-4 -bottom-4 w-32 h-32 opacity-20 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
                             <h4 className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-6">Awaiting Review</h4>
                             <p className="text-5xl font-black italic mb-1">{organizations.filter((o:any) => o.status === 'pending').length}</p>
                             <p className="text-[10px] font-bold uppercase opacity-80 tracking-widest leading-none">Access Requests</p>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Modal Overlay Component for Add/Edit */}
            {isFormOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
                    <Card className="w-full max-w-xl bg-white dark:bg-slate-900 border-none shadow-premium rounded-[2.5rem] p-6 md:p-12 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
                        
                        <div className="flex items-center justify-between mb-10">
                            <div>
                                <h3 className="text-2xl font-black uppercase tracking-tighter italic text-gray-900 dark:text-white">
                                    {editingOrg ? 'Update Network Record' : 'Deploy New Franchise System'}
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Configure your master tenant account</p>
                            </div>
                            <Button variant="ghost" className="rounded-xl" onClick={() => setIsFormOpen(false)}>
                                <XCircle className="w-6 h-6 text-gray-400" />
                            </Button>
                        </div>

                        <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                            <div className="space-y-4">
                                <label className="text-[10px] font-black uppercase tracking-widest text-primary ml-1 italic block">Brand Node Identity</label>
                                <Input 
                                    className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold uppercase text-xs"
                                    placeholder="E.G. THOMSON GLOBAL"
                                    required
                                    value={formData.systemName}
                                    onChange={(e) => setFormData({...formData, systemName: e.target.value})}
                                />
                            </div>

                            {!editingOrg && (
                                <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5 transition-all">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 italic block">Initial Master Credentials</label>
                                    <Input 
                                        className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                        placeholder="OWNER NAME"
                                        required
                                        value={formData.adminName}
                                        onChange={(e) => setFormData({...formData, adminName: e.target.value})}
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input 
                                            className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                            placeholder="ADMIN EMAIL"
                                            required
                                            type="email"
                                            value={formData.adminEmail}
                                            onChange={(e) => setFormData({...formData, adminEmail: e.target.value})}
                                        />
                                        <Input 
                                            className="bg-gray-50 dark:bg-white/5 border-none h-14 rounded-2xl font-bold text-xs"
                                            placeholder="SECURE ACCESS CODE"
                                            required
                                            type="password"
                                            value={formData.adminPassword}
                                            onChange={(e) => setFormData({...formData, adminPassword: e.target.value})}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <Button 
                                    type="submit" 
                                    disabled={formLoading}
                                    className="flex-1 bg-gray-900 dark:bg-primary-dark text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-xl transition-all"
                                >
                                    {formLoading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : (editingOrg ? 'UPDATE MESH DETAILS' : 'ACTIVATE NEW SYSTEM')}
                                </Button>
                                <Button 
                                    type="button" 
                                    variant="ghost" 
                                    className="rounded-2xl h-14 px-8 text-[10px] font-bold uppercase text-gray-400"
                                    onClick={() => setIsFormOpen(false)}
                                >
                                    CANCEL
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            )}
        </ProtectedRoute>
    );
}
