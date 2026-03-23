"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { DollarSign, Calendar, Filter, FileText, CheckCircle, Search } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function CommissionsPage() {
    const { user } = useAuth();
    const [commissions, setCommissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchCommissions();
    }, []);

    const fetchCommissions = async () => {
        try {
            const res = await api.get('/commissions');
            setCommissions(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    const handleMarkPaid = async (id: string) => {
        try {
            await api.put(`/commissions/${id}/pay`);
            fetchCommissions();
        } catch (err) {
            alert("Failed to update status");
        }
    };

    const calculateCurrentCommissions = async () => {
        try {
            const month = new Date().toISOString().slice(0, 7); // 'YYYY-MM'
            const res = await api.post('/commissions/generate-all', { month });
            alert(res.data.message);
            fetchCommissions();
        } catch (err) {
            alert("Failed to generate commissions");
        }
    }

    const isMaster = user?.role === 'admin' || user?.role === 'system-superadmin';

    const filteredData = commissions.filter((c: any) => 
        c.franchiseId?.franchiseName?.toLowerCase().includes(search.toLowerCase()) ||
        c.month.includes(search)
    );

    const columns = [
        { 
            header: 'Franchise Node', 
            accessor: (row: any) => (
                <div className="flex flex-col">
                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight italic">{row.franchiseId?.franchiseName || 'N/A'}</span>
                    <span className="text-[10px] text-gray-400 font-bold uppercase">{row.franchiseId?.region}</span>
                </div>
            )
        },
        { 
            header: 'Fiscal Month', 
            accessor: (row: any) => (
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                    <Calendar className="w-3.5 h-3.5 text-primary" /> {row.month}
                </div>
            )
        },
        { 
            header: 'Gross Revenue', 
            accessor: (row: any) => (
                <span className="font-bold text-gray-900 dark:text-white">${row.totalSales.toFixed(2)}</span>
            ) 
        },
        { 
            header: 'Earnings (Net)', 
            accessor: (row: any) => (
                <div className="flex items-center gap-1.5 font-black text-success italic">
                    <DollarSign className="w-3 h-3" /> {row.commissionAmount.toFixed(2)}
                </div>
            )
        },
        {
            header: 'Status', accessor: (row: any) => (
                <Badge variant={row.paidStatus ? 'success' : 'warning'} className="font-black uppercase tracking-widest text-[10px] italic">
                    {row.paidStatus ? 'RESOLVED' : 'AWAITING'}
                </Badge>
            )
        }
    ];

    // Add Action column ONLY for Masters
    if (isMaster) {
        columns.push({
            header: 'Settlement', accessor: (row: any) => (
                <Button 
                    size="sm" 
                    variant={row.paidStatus ? "ghost" : "primary"} 
                    disabled={row.paidStatus}
                    onClick={() => handleMarkPaid(row._id)}
                    className="h-8 rounded-lg text-[10px] font-black italic tracking-tight"
                >
                    {row.paidStatus ? <CheckCircle className="w-4 h-4 text-success" /> : "PROCESS PAYMENT"}
                </Button>
            )
        } as any);
    }

    return (
        <ProtectedRoute allowedRoles={['admin', 'franchisee', 'system-superadmin']}>
            <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 p-2 md:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gray-50/50 dark:bg-white/5 p-6 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">Fiscal Engine</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-tight">
                            {isMaster ? 'Platform-wide dividend distribution oversight.' : 'Monitor your earnings and dividend history.'}
                        </p>
                    </div>
                    {isMaster && (
                        <Button onClick={calculateCurrentCommissions} className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl h-14 md:h-16 px-8 italic font-black uppercase tracking-widest text-xs shadow-xl transition-all hover:scale-[1.02] active:scale-95">
                            <FileText className="w-5 h-5 mr-3" /> GENERATE CURRENT CYCLE
                        </Button>
                    )}
                </div>

                <Card className="border-none shadow-premium bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-100 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                            <div className="p-2.5 bg-success/10 text-success rounded-xl">
                                <DollarSign className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white italic">Dividend Ledger</h2>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Settlement Transparency</p>
                            </div>
                        </div>

                        <div className="relative w-full md:w-72 group">
                            <Input 
                                placeholder="FILTER BY NODE OR MONTH..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 h-12 bg-gray-50 dark:bg-white/5 border-none rounded-2xl text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-primary/20 transition-all"
                            />
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-0 overflow-x-auto">
                        {loading ? (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-gray-100 border-t-success rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Calculating Dividends...</p>
                            </div>
                        ) : (
                            <div className="p-4 md:p-8">
                                <DataTable 
                                    columns={columns} 
                                    data={filteredData} 
                                    keyExtractor={(row) => row._id} 
                                />
                                {filteredData.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-3xl mt-4 border border-dashed border-gray-200 dark:border-white/10">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">No financial records detected in the ledger.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
