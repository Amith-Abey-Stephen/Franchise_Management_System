"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Edit2, Trash2, Plus, MapPin, Check, X, Filter, User, Mail, Lock, Search } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';

export default function FranchisesPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const [searchTerm, setSearchTerm] = useState('');
    const globalSearch = (searchParams.get('search') || searchTerm).toLowerCase();

    const [franchises, setFranchises] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingFranchise, setEditingFranchise] = useState<any>(null);
    const [franchiseForm, setFranchiseForm] = useState({ 
        franchiseName: '', 
        region: '', 
        commissionPercentage: '10',
        parentId: '',
        ownerName: '',
        ownerEmail: '',
        ownerPassword: ''
    });

    useEffect(() => {
        fetchFranchises();
    }, []);

    const fetchFranchises = async () => {
        try {
            const res = await api.get('/franchises');
            setFranchises(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleOpenAddModal = () => {
        setEditingFranchise(null);
        setFranchiseForm({ 
            franchiseName: '', 
            region: '', 
            commissionPercentage: '10',
            parentId: '',
            ownerName: '',
            ownerEmail: '',
            ownerPassword: ''
        });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (franchise: any) => {
        setEditingFranchise(franchise);
        setFranchiseForm({
            franchiseName: franchise.franchiseName,
            region: franchise.region,
            commissionPercentage: franchise.commissionPercentage.toString(),
            parentId: franchise.parentId?._id || '',
            ownerName: franchise.ownerId?.name || '',
            ownerEmail: franchise.ownerId?.email || '',
            ownerPassword: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...franchiseForm,
                commissionPercentage: Number(franchiseForm.commissionPercentage)
            };

            if (editingFranchise) {
                await api.put(`/franchises/${editingFranchise._id}`, payload);
            } else {
                await api.post('/franchises', payload);
            }
            
            setIsModalOpen(false);
            fetchFranchises();
        } catch (err: any) {
            alert(err.response?.data?.message || "Failed to save store");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this store?")) return;
        try {
            await api.delete(`/franchises/${id}`);
            fetchFranchises();
        } catch (err) {
            alert("Failed to delete store");
        }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await api.put(`/franchises/${id}/status`, { status });
            fetchFranchises();
        } catch (err) {
            console.error(err);
        }
    };

    // Filter data based on global search
    const filteredFranchises = franchises.filter((f: any) => 
        f.franchiseName.toLowerCase().includes(globalSearch) ||
        f.region.toLowerCase().includes(globalSearch) ||
        f.ownerId?.email?.toLowerCase().includes(globalSearch) ||
        f.ownerId?.name?.toLowerCase().includes(globalSearch)
    );

    const columns = [
        { 
            header: 'Store', 
            accessor: (row: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{row.franchiseName}</span>
                    <span className="text-[10px] font-medium text-gray-500 flex items-center gap-1 uppercase">
                        <MapPin className="w-3 h-3" /> {row.region}
                    </span>
                </div>
            )
        },
        { 
            header: 'Owner', 
            accessor: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{row.ownerId?.name || 'Assigned'}</span>
                    <span className="text-[10px] text-gray-500">{row.ownerId?.email}</span>
                </div>
            )
        },
        { 
            header: 'Network Parent', 
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <span className="px-2 py-1 rounded-md text-[9px] font-black tracking-widest uppercase bg-primary/10 text-primary">
                        {row.organizationId?.name || 'MASTER BRAND'}
                    </span>
                </div>
            ) 
        },
        { 
            header: 'Commission (%)', 
            accessor: (row: any) => (
                <div className="flex items-center gap-1.5 font-bold text-primary italic">
                    {row.commissionPercentage}%
                </div>
            ) 
        },
        {
            header: 'Status', accessor: (row: any) => (
                <Badge variant={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'} className="font-bold uppercase text-[9px] px-2">
                    {row.status}
                </Badge>
            )
        },
        {
            header: 'Actions', accessor: (row: any) => (
                <div className="flex items-center gap-3">
                    {row.status === 'pending' && user?.role === 'admin' && (
                        <>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => updateStatus(row._id, 'approved')} 
                                className="h-8 px-2 hover:bg-success/20 text-success gap-1"
                            >
                                <Check className="w-4 h-4" /> <span className="text-[10px] font-bold">APPROVE</span>
                            </Button>
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => updateStatus(row._id, 'rejected')} 
                                className="h-8 px-2 hover:bg-danger/20 text-danger gap-1"
                            >
                                <X className="w-4 h-4" /> <span className="text-[10px] font-bold">REJECT</span>
                            </Button>
                        </>
                    )}
                    <button 
                        onClick={() => handleOpenEditModal(row)}
                        className="p-3 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all active:scale-90"
                        title="Edit Store"
                    >
                        <Edit2 className="w-4.5 h-4.5 text-primary" />
                    </button>
                    <button 
                        onClick={() => handleDelete(row._id)}
                        className="p-3 bg-danger/5 hover:bg-danger/10 rounded-xl transition-all active:scale-90"
                        title="Delete Store"
                    >
                        <Trash2 className="w-4.5 h-4.5 text-danger" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['admin', 'system-superadmin']}>
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 p-2 md:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0 bg-gray-50/50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5 md:bg-transparent md:p-0 md:rounded-none md:border-none">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Franchise Stores</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-tight">Manage all store locations and orchestrate node settings.</p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="rounded-2xl h-14 md:h-16 px-8 shadow-xl shadow-primary/20 font-black uppercase italic tracking-widest text-[10px] md:text-xs">
                        <Plus className="w-5 h-5 mr-3" /> Add New Store
                    </Button>
                </div>

                <Card className="border-none shadow-premium bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 dark:border-white/5 p-6 md:p-8 gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-primary/10 text-primary rounded-xl">
                                <Search className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white italic leading-tight">Filter Results</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                                    {globalSearch ? `Matches for "${globalSearch}"` : "All stores active in network"}
                                </p>
                            </div>
                        </div>
                        
                        <div className="relative w-full md:w-72 group">
                            <Input 
                                className="h-11 bg-gray-50 dark:bg-white/5 border-none rounded-2xl pl-10 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/20 transition-all"
                                placeholder="SEARCH STORES..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {loading ? (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-gray-100 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading network nodes...</p>
                            </div>
                        ) : (
                            <div className="p-4 md:p-8">
                                <DataTable
                                    columns={columns}
                                    data={filteredFranchises}
                                    keyExtractor={(row) => row._id}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingFranchise ? "Edit Store Details" : "Add New Store Account"}>
                <form onSubmit={handleSubmit} className="space-y-8 pt-2">
                    <div className="space-y-6">
                        {/* Store Section */}
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                <span className="w-4 h-[1px] bg-primary" /> Store Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Store Name"
                                    required
                                    value={franchiseForm.franchiseName}
                                    onChange={(e) => setFranchiseForm({ ...franchiseForm, franchiseName: e.target.value })}
                                    placeholder="e.g. Main Street Burgers"
                                    className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold uppercase"
                                />
                                <Input
                                    label="Region"
                                    required
                                    value={franchiseForm.region}
                                    onChange={(e) => setFranchiseForm({ ...franchiseForm, region: e.target.value })}
                                    placeholder="e.g. North Area"
                                    className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold uppercase"
                                />
                            </div>
                            <Input
                                label="Commission (%)"
                                required
                                type="number"
                                value={franchiseForm.commissionPercentage}
                                onChange={(e) => setFranchiseForm({ ...franchiseForm, commissionPercentage: e.target.value })}
                                placeholder="10"
                                className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                            />
                        </div>

                        {/* Owner Section (Only for new stores or editing if empty) */}
                        {!editingFranchise && (
                            <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                                    <span className="w-4 h-[1px] bg-primary" /> Manager Account
                                </h3>
                                <div className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        required
                                        value={franchiseForm.ownerName}
                                        onChange={(e) => setFranchiseForm({ ...franchiseForm, ownerName: e.target.value })}
                                        placeholder="Enter manager name"
                                        className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                                    />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            label="Email Address"
                                            required
                                            type="email"
                                            value={franchiseForm.ownerEmail}
                                            onChange={(e) => setFranchiseForm({ ...franchiseForm, ownerEmail: e.target.value })}
                                            placeholder="manager@example.com"
                                            className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                                        />
                                        <Input
                                            label="Initial Password"
                                            required={!editingFranchise}
                                            type="password"
                                            value={franchiseForm.ownerPassword}
                                            onChange={(e) => setFranchiseForm({ ...franchiseForm, ownerPassword: e.target.value })}
                                            placeholder="Create password"
                                            className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-white/5">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 italic block">Network Hierarchy</label>
                            <select 
                                className="w-full bg-gray-50 dark:bg-slate-800 border-none h-14 rounded-2xl font-bold uppercase text-[10px] px-4 focus:ring-1 focus:ring-primary appearance-none text-gray-900 dark:text-white"
                                value={franchiseForm.parentId}
                                onChange={(e) => setFranchiseForm({ ...franchiseForm, parentId: e.target.value })}
                            >
                                <option value="" className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">Standalone L1 Store (Master Hub)</option>
                                {franchises.filter((f:any) => f._id !== editingFranchise?._id).map((f:any) => (
                                    <option key={f._id} value={f._id} className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white">
                                        Sub-branch of {f.franchiseName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold uppercase shadow-xl shadow-primary/20">
                        {editingFranchise ? "Save Changes" : "Create Store & Account"}
                    </Button>
                </form>
            </Modal>
        </ProtectedRoute>
    );
}
