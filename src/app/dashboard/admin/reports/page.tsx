"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Download, FileText, Globe, Percent, Users } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';

export default function ReportsPage() {
    const [isExporting, setIsExporting] = useState<string | null>(null);

    const handleExport = async (type: string) => {
        setIsExporting(type);
        try {
            const res = await api.get('/franchises');
            const data = res.data;

            // Generate simple CSV
            let csvContent = "";
            if (type === 'stores') {
                csvContent = "Store Name,Region,Status,Owner\n";
                data.forEach((f: any) => {
                    csvContent += `${f.franchiseName},${f.region},${f.status},${f.ownerId?.email || 'N/A'}\n`;
                });
            } else if (type === 'fees') {
                csvContent = "Store Name,Commission (%)\n";
                data.forEach((f: any) => {
                    csvContent += `${f.franchiseName},${f.commissionPercentage}%\n`;
                });
            }

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", `${type}_report_${new Date().toISOString().split('T')[0]}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert("Export failed: " + error);
        } finally {
            setIsExporting(null);
        }
    };

    return (
        <ProtectedRoute allowedRoles={['admin']}>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-gray-900 dark:text-white uppercase">Reports</h1>
                    <p className="text-sm font-bold text-gray-400 mt-1 uppercase tracking-widest">Network Analytics & Exports</p>
                </div>

                <Card className="border-none shadow-premium overflow-hidden">
                    <CardHeader className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-white/5 p-6 md:p-8">
                        <div className="flex items-center gap-3">
                            <FileText className="w-6 h-6 text-primary" />
                            <h2 className="text-lg font-black uppercase italic tracking-tight text-gray-900 dark:text-white">Generated Reports</h2>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 md:p-8 grid grid-cols-1 gap-4">
                        <ReportItem 
                            icon={<Globe className="w-5 h-5" />}
                            title="Store Directory"
                            description="Full list of all registered stores, regions and current status."
                            onExport={() => handleExport('stores')}
                            isLoading={isExporting === 'stores'}
                        />
                        <ReportItem 
                            icon={<Percent className="w-5 h-5 text-success" />}
                            title="Fee Structure"
                            description="Overview of assigned commission percentages across the network."
                            onExport={() => handleExport('fees')}
                            isLoading={isExporting === 'fees'}
                            bgColor="bg-success/10"
                            textColor="text-success"
                        />
                        <ReportItem 
                            icon={<Users className="w-5 h-5 text-warning" />}
                            title="Admin Logs"
                            description="Record of administrative actions and store approvals."
                            onExport={() => alert("Admin logs are currently restricted to live viewing.")}
                            isLoading={false}
                            bgColor="bg-warning/10"
                            textColor="text-warning"
                        />
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}

function ReportItem({ icon, title, description, onExport, isLoading, bgColor = "bg-primary/10", textColor = "text-primary" }: any) {
    return (
        <div className="border border-gray-100 dark:border-white/5 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between bg-white dark:bg-white/5 hover:border-primary/20 transition-all duration-300 group gap-6">
            <div className="flex items-start md:items-center gap-4">
                <div className={`p-4 ${bgColor} ${textColor} rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                    {icon}
                </div>
                <div>
                    <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase italic tracking-tight">{title}</h3>
                    <p className="text-xs font-bold text-gray-400 mt-0.5">{description}</p>
                </div>
            </div>
            <Button 
                onClick={onExport}
                isLoading={isLoading}
                variant="outline" 
                className="w-full md:w-auto h-12 px-6 rounded-xl font-bold uppercase italic tracking-tighter gap-2 border-2 hover:bg-gray-50 dark:hover:bg-white/10"
            >
                <Download className="w-4 h-4" /> Export CSV
            </Button>
        </div>
    );
}
