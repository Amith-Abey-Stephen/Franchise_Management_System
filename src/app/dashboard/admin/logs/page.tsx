"use client";
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Network, History, MapPin, Check, Info } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

export default function LogsPage() {
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchActivities();
    }, []);

    const fetchActivities = async () => {
        try {
            const res = await api.get('/activities');
            setActivities(res.data);
            setLoading(false);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const columns = [
        { 
            header: 'EVENT TELEMETRY', 
            accessor: (row: any) => (
                <div className="flex items-center gap-4">
                    <div className={`p-2.5 rounded-xl shrink-0 ${row.type === 'franchise' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'}`}>
                        {row.type === 'franchise' ? <Network className="w-5 h-5" /> : <History className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-xs font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{row.action}</p>
                        <p className="text-[10px] text-gray-500 font-medium leading-tight mt-0.5">{row.details}</p>
                    </div>
                </div>
            )
        },
        { 
            header: 'MESH OPERATOR', 
            accessor: (row: any) => (
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 uppercase italic leading-none mb-1">{row.user?.name}</span>
                    <Badge variant="default" className="text-[8px] bg-gray-50 dark:bg-white/5 border-none px-1.5 py-0.5 mt-1 font-black uppercase tracking-widest">{row.user?.role}</Badge>
                </div>
            )
        },
        { 
            header: 'TIMESTAMP', 
            accessor: (row: any) => (
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-900 dark:text-white italic">{new Date(row.createdAt).toLocaleDateString()}</span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{new Date(row.createdAt).toLocaleTimeString()}</span>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['admin', 'system-superadmin']}>
            <div className="space-y-6 md:space-y-8 animate-in fade-in duration-700 p-2 md:p-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Audit Registry</h1>
                        <p className="text-[10px] md:text-sm text-gray-500 font-medium tracking-tight italic">Analyzing chronicled network activities across the mesh.</p>
                    </div>
                </div>

                <Card className="border-none shadow-premium bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden">
                    <CardHeader className="p-8 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 flex items-center gap-4">
                        <History className="w-6 h-6 text-primary" />
                        <div>
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white italic">Event Chronicle</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Full audit trail of regional operations</p>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-24 flex flex-col items-center justify-center space-y-4">
                                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Scanning Audit Stream...</p>
                            </div>
                        ) : (
                            <div className="p-4 md:p-10">
                                <DataTable columns={columns} data={activities} keyExtractor={(row) => row._id} />
                                {activities.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50/50 dark:bg-white/5 rounded-[2rem] border border-dashed border-gray-200 dark:border-white/10">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic opacity-60">No chronicled data detected.</p>
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
