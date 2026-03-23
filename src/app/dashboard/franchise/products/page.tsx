"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Box, Filter, Search } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function FranchiseProductsPage() {
    const searchParams = useSearchParams();
    const globalSearch = searchParams.get('search')?.toLowerCase() || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await api.get('/products');
            setProducts(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    // Filter products based on global search
    const filteredProducts = products.filter((p: any) => 
        p.name.toLowerCase().includes(globalSearch) ||
        p.category.toLowerCase().includes(globalSearch)
    );

    const columns = [
        { 
            header: 'Product Name', 
            accessor: (row: any) => (
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft flex items-center justify-center text-primary">
                        <Box className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tight">{row.name}</span>
                </div>
            )
        },
        { 
            header: 'Category', 
            accessor: (row: any) => (
                <span className="px-2 py-1 bg-gray-50 dark:bg-white/5 rounded-md text-[10px] font-black tracking-widest uppercase text-gray-400">
                    {row.category}
                </span>
            )
        },
        { 
            header: 'Suggested Price', 
            accessor: (row: any) => (
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">${row.basePrice.toFixed(2)}</span>
            )
        },
        { 
            header: 'Global Stock Status', 
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.stock < 10 ? 'bg-danger animate-pulse' : 'bg-success'}`} />
                    <span className="font-bold text-[11px] text-gray-500 uppercase tracking-tight">{row.stock > 0 ? 'In Stock' : 'Out of Stock'}</span>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['franchisee']}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Product Catalog</h1>
                        <p className="text-sm text-gray-500 font-medium">View official products available for your franchise.</p>
                    </div>
                </div>

                <Card className="border-none shadow-premium">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-transparent bg-transparent pb-0 px-4 md:px-8 pt-6 md:pt-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Search className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white italic leading-tight">Catalog Filter</h2>
                                {globalSearch ? (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Searching for "{globalSearch}"</p>
                                ) : (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Official items listed by Admin</p>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Compiling catalog...</p>
                            </div>
                        ) : (
                            <div className="px-4 md:px-8 pb-8">
                                <DataTable 
                                    columns={columns} 
                                    data={filteredProducts} 
                                    keyExtractor={(row) => row._id} 
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </ProtectedRoute>
    );
}
