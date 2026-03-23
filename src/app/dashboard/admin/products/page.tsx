"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Edit2, Trash2, Plus, Box, Filter, DollarSign, Package, Search } from 'lucide-react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const globalSearch = searchParams.get('search')?.toLowerCase() || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);
    const [productForm, setProductForm] = useState({ name: '', category: '', basePrice: '', stock: '' });

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

    const handleOpenAddModal = () => {
        setEditingProduct(null);
        setProductForm({ name: '', category: '', basePrice: '', stock: '' });
        setIsModalOpen(true);
    };

    const handleOpenEditModal = (product: any) => {
        setEditingProduct(product);
        setProductForm({
            name: product.name,
            category: product.category,
            basePrice: product.basePrice.toString(),
            stock: product.stock.toString()
        });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...productForm,
                basePrice: Number(productForm.basePrice),
                stock: Number(productForm.stock)
            };

            if (editingProduct) {
                await api.put(`/products/${editingProduct._id}`, payload);
            } else {
                await api.post('/products', payload);
            }
            
            setIsModalOpen(false);
            fetchProducts();
        } catch (err) {
            alert("Failed to save product");
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            alert("Failed to delete product");
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
            header: 'Base Price', 
            accessor: (row: any) => (
                <span className="font-bold text-gray-900 dark:text-white uppercase tracking-tighter">${row.basePrice.toFixed(2)}</span>
            )
        },
        { 
            header: 'Stock Level', 
            accessor: (row: any) => (
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${row.stock < 10 ? 'bg-danger animate-pulse' : 'bg-success'}`} />
                    <span className="font-bold text-[11px] text-gray-500 uppercase tracking-tight">{row.stock} in stock</span>
                </div>
            )
        },
        {
            header: 'Actions', accessor: (row: any) => (
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => handleOpenEditModal(row)}
                        className="p-3 bg-primary/5 hover:bg-primary/10 rounded-xl transition-all active:scale-90"
                        title="Edit Product"
                    >
                        <Edit2 className="w-4.5 h-4.5 text-primary" />
                    </button>
                    <button 
                        onClick={() => handleDelete(row._id)}
                        className="p-3 bg-danger/5 hover:bg-danger/10 rounded-xl transition-all active:scale-90"
                        title="Delete Product"
                    >
                        <Trash2 className="w-4.5 h-4.5 text-danger" />
                    </button>
                </div>
            )
        }
    ];

    return (
        <ProtectedRoute allowedRoles={['admin', 'system-superadmin']}>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black tracking-tighter text-gray-900 dark:text-white uppercase italic">Product List</h1>
                        <p className="text-sm text-gray-500 font-medium">Manage your items, pricing, and global stock levels.</p>
                    </div>
                    <Button onClick={handleOpenAddModal} className="rounded-xl shadow-lg shadow-primary/20 font-bold uppercase tracking-wider">
                        <Plus className="w-4 h-4 mr-2" /> Add New Product
                    </Button>
                </div>

                <Card className="border-none shadow-premium">
                    <CardHeader className="flex flex-col md:flex-row md:items-center justify-between border-transparent bg-transparent pb-0 px-4 md:px-8 pt-6 md:pt-8 gap-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/10 text-primary rounded-lg">
                                <Search className="w-4 h-4" />
                            </div>
                            <div>
                                <h2 className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white italic leading-tight">Filter Results</h2>
                                {globalSearch ? (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Showing matches for "{globalSearch}"</p>
                                ) : (
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Monitoring global item movements</p>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading inventory...</p>
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

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingProduct ? "Edit Product" : "Add New Product"}>
                <form onSubmit={handleSubmit} className="space-y-8 pt-2">
                    <div className="space-y-6">
                        <div className="space-y-4">
                             <Input
                                label="Product Name"
                                required
                                value={productForm.name}
                                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                                placeholder="e.g. Cheese Pizza"
                                className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold uppercase"
                            />
                            <Input
                                label="Category"
                                required
                                value={productForm.category}
                                onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                                placeholder="e.g. Food"
                                className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold uppercase"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Price ($)"
                                required
                                type="number"
                                step="0.01"
                                value={productForm.basePrice}
                                onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                                placeholder="0.00"
                                className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                            />
                            <Input
                                label="Stock"
                                required
                                type="number"
                                value={productForm.stock}
                                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                                placeholder="0"
                                className="bg-gray-50 dark:bg-white/5 border-none rounded-xl h-12 font-bold"
                            />
                        </div>
                    </div>
                    <Button type="submit" className="w-full h-14 rounded-2xl font-bold uppercase shadow-xl shadow-primary/20">
                        {editingProduct ? "Save Changes" : "Create Product"}
                    </Button>
                </form>
            </Modal>
        </ProtectedRoute>
    );
}
