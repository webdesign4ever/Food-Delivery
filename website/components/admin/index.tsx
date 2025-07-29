'use client'
import React, { useEffect, useRef } from 'react'
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminDashboard from "@/components/admin/admin-dashboard";
import OrdersTable from "@/components/admin/orders-table";
import BillingDashboard from "@/components/admin/billing-dashboard";
import { Package, Plus, Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { OrderStats, Product, Customer, BoxType, Invoice, Payment, BillingRecord, Order, ProductForm, BagForm } from "@/lib/types";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import Image from 'next/image';
import BagsManagement from './bags-management';

const Admin = () => {

    const initialProductData: ProductForm = {
        name: "",
        category: "fruit",
        price: "",
        unit: "kg",
        imageUrl: null,
        description: null,
        isAvailable: true,
        // nutritionInfo: {
        //     calories: "",
        //     carbs: "",
        //     fiber: ""
        // }
    };

    const [activeTab, setActiveTab] = useState("dashboard");

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [productData, setProductData] = useState<ProductForm>(initialProductData);

    const [errors, setErrors] = useState<Record<string, string>>({})

    const [editingProduct, setEditingProduct] = useState<null | ProductForm>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const { toast } = useToast();

    const { data: stats, isLoading: statsLoading } = useQuery<OrderStats>({
        queryKey: ["/stats"],
    });

    const { data: bags = [], isLoading: bagsLoading } = useQuery<BagForm[]>({
        queryKey: ["/bag-types"],
    });

    const { data: orders = [], isLoading: ordersLoading } = useQuery<
        (Order & { customer: Customer; bagType: BoxType; orderItems: any[] })[]
    >({
        queryKey: ["/orders"],
    });

    // Mock billing data for demonstration
    const mockInvoices: Invoice[] = [
        {
            id: 1,
            orderId: 1,
            invoiceNumber: "INV-202412-001",
            issueDate: "2024-12-30",
            dueDate: "2025-01-29",
            subtotal: "1399.00",
            taxAmount: "0.00",
            discountAmount: "0.00",
            totalAmount: "1399.00",
            status: "paid",
            paymentMethod: "easypaisa",
            paidAt: "2024-12-30",
            notes: "Payment completed successfully",
            createdAt: "2024-12-30",
            updatedAt: "2024-12-30"
        },
        {
            id: 2,
            orderId: 2,
            invoiceNumber: "INV-202412-002",
            issueDate: "2024-12-30",
            dueDate: "2025-01-29",
            subtotal: "799.00",
            taxAmount: "0.00",
            discountAmount: "0.00",
            totalAmount: "799.00",
            status: "pending",
            paymentMethod: undefined,
            paidAt: undefined,
            notes: undefined,
            createdAt: "2024-12-30",
            updatedAt: "2024-12-30"
        }
    ];

    const mockPayments: Payment[] = [
        {
            id: 1,
            invoiceId: 1,
            orderId: 1,
            paymentMethod: "easypaisa",
            transactionId: "EP123456789",
            amount: "1399.00",
            status: "completed",
            paymentDate: "2024-12-30",
            referenceNumber: "REF001",
            processingFee: "20.00",
            metadata: { gateway: "easypaisa" },
            createdAt: "2024-12-30"
        }
    ];

    const mockBillingRecords: BillingRecord[] = [
        {
            id: 1,
            customerId: 1,
            period: "2024-12",
            totalOrders: 15,
            totalAmount: "21850.00",
            totalPaid: "18450.00",
            totalPending: "3400.00",
            createdAt: "2024-12-01",
            updatedAt: "2024-12-30"
        },
        {
            id: 2,
            customerId: 2,
            period: "2024-11",
            totalOrders: 12,
            totalAmount: "18900.00",
            totalPaid: "18900.00",
            totalPending: "0.00",
            createdAt: "2024-11-01",
            updatedAt: "2024-11-30"
        }
    ];

    const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
        queryKey: ["/products"],
    });

    // const { data: messages = [], isLoading: messagesLoading } = useQuery({
    //     queryKey: ["/contact"],
    // });

    const recentOrders = orders.slice(0, 5);
    const pendingOrders = orders.filter(order => order.orderStatus === "processing").length;
    const completedOrders = orders.filter(order => order.orderStatus === "delivered").length;

    const handleExportData = () => {
        // Create CSV content
        const csvContent = [
            ["Order ID", "Customer", "Email", "Phone", "Box Type", "Amount", "Payment Method", "Status", "Date"].join(","),
            ...orders.map(order => [
                `FB-${order.id.toString().padStart(3, "0")}`,
                `${order.customer.firstName} ${order.customer.lastName}`,
                order.customer.email,
                order.customer.phone,
                order.bagType.name,
                `Rs. ${order.totalAmount}`,
                order.paymentMethod,
                order.orderStatus,
                new Date(order.createdAt).toLocaleDateString()
            ].join(","))
        ].join("\n");

        // Create and download file
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `freshbox-orders-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleChange = (field: string, value: string | boolean) => {
        // if (field.startsWith("nutrition.")) {
        //     const key = field.split(".")[1];
        //     setProductData(prev => ({
        //         ...prev,
        //         nutritionInfo: { ...prev.nutritionInfo, [key]: value }
        //     }));
        // } else {
        setProductData(prev => ({ ...prev, [field]: value }));
        setErrors({ ...errors, [field]: "" })
        // }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!productData.name || productData.name.trim().length < 1) {
            newErrors.name = "Name is required";
        }

        if (!productData.category) {
            newErrors.category = "Category is required";
        }

        if (!productData.price) {
            newErrors.price = "Price is required";
        }

        if (!productData.unit) {
            newErrors.unit = "Unit is required";
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const createProductMutation = useMutation({
        // mutationFn: async (productData: any) => {
        //     const response = await fetch(`${BASE_URL}/products`, {
        //         method: "POST",
        //         headers: {
        //             "Content-Type": "application/json",
        //         },
        //         body: JSON.stringify(productData),
        //     });

        //     if (!response.ok) {
        //         throw new Error("Failed to create PRODUCT");
        //     }

        //     return await response.json();
        // },
        mutationFn: async (productData: any) => {
            return apiRequest("POST", "/products", productData);
        },
        onSuccess: () => {
            // Invalidate stats cache to update counters on home page
            //queryClient.invalidateQueries({ queryKey: ["/products"] });
            queryClient.invalidateQueries({
                predicate: (query) =>
                    ["/products", "/stats"].includes(query.queryKey[0] as string),
            });

            toast({
                title: "Product Added!",
                description: "The new product has been successfully created and added to your store.",
            });

            // 👇 Close the dialog
            setIsDialogOpen(false);

            // Optional: Clear form data
            setProductData(initialProductData);
        },
        onError: () => {
            toast({
                title: "Failed to Add Product",
                description: "There was an error while creating the product. Please check your inputs and try again.",
                variant: "destructive",
            });
        },
    });

    const updateProductMutation = useMutation({
        mutationFn: async (updatedProduct: any) => {
            return apiRequest("PUT", `/products/${updatedProduct.id}`, updatedProduct);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/products"] });
            toast({
                title: "Product Updated!",
                description: "The product details have been successfully updated.",
            });
            setIsDialogOpen(false);
            setProductData(initialProductData);
            setEditingProduct(null);
        },
        onError: () => {
            toast({
                title: "Failed to Update Product",
                description: "There was an error while updating the product. Please try again.",
                variant: "destructive",
            });
        },
    });

    const deleteProductMutation = useMutation({
        mutationFn: async (id: number) => {
            return apiRequest("DELETE", `/products/${id}`);
        },
        onSuccess: () => {
            // Invalidate stats cache to update counters on home page
            queryClient.invalidateQueries({
                predicate: (query) =>
                    ["/products", "/stats"].includes(query.queryKey[0] as string),
            });

            toast({
                title: "Product Deleted!",
                description: "The selected product has been permanently removed from your store.",
            });
        },
        onError: () => {
            toast({
                title: "Failed to Delete Product",
                description: "Something went wrong while deleting the product. Please try again or contact support.",
                variant: "destructive",
            });
        },
    });

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        if (editingProduct) {
            // Edit product
            updateProductMutation.mutate({
                id: editingProduct.id,
                ...productData,
                imageUrl: productData.imageUrl?.trim() || null,
                description: productData.description?.trim() || null,
                price: parseFloat(productData.price),
            });
        } else {
            createProductMutation.mutate({
                ...productData,
                price: parseFloat(productData.price),
            });
        }
    };

    const handleEditProduct = (product: ProductForm) => {
        setEditingProduct(product);
        setProductData(product);
        setIsDialogOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            handleChange("imageUrl", base64String); // Store base64 string
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        handleChange("imageUrl", "");

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    useEffect(() => {
        if (!isDialogOpen) {
            setProductData(initialProductData);
            setEditingProduct(null)
            setErrors({})
        }
    }, [isDialogOpen]);

    if (statsLoading || ordersLoading || productsLoading || bagsLoading
        //|| messagesLoading
    ) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-fresh-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading admin dashboard...</p>
                </div>
            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-200">
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 gradient-green-yellow rounded-lg flex items-center justify-center">
                            <Package className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-dark-text">FreshBox Admin</h1>
                            <p className="text-gray-500">Dashboard Overview</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Button
                            onClick={handleExportData}
                            variant="outline"
                            className="border-fresh-green text-fresh-green hover:bg-fresh-green hover:text-white"
                        >
                            <Download className="mr-2 w-4 h-4" />
                            Export Data
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-fresh-green text-white hover:opacity-90">
                                    <Plus className="mr-2 w-4 h-4" />
                                    Add Product
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-h-[98vh] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                                <DialogHeader>
                                    <DialogTitle>
                                        {editingProduct ? "Edit Product" : "Add New Product"}
                                    </DialogTitle>
                                    <DialogDescription>
                                        {editingProduct ? "Enter product details to update." : "Enter product details to add it to your store."}
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleAddProduct} className="space-y-4">
                                    <div>
                                        <Input
                                            placeholder="Product Name"
                                            value={productData.name}
                                            onChange={(e) => handleChange("name", e.target.value)}
                                        />
                                        {errors.name && (
                                            <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Select
                                            value={productData.category}
                                            onValueChange={(value) => handleChange("category", value)}
                                        >
                                            <SelectTrigger>
                                                <div className="flex items-center space-x-2">
                                                    <SelectValue placeholder="Category (fruit or vegetable)" />
                                                </div>
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="fruit">Fruit</SelectItem>
                                                <SelectItem value="vegetable">Vegetable</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div>
                                        <Input
                                            placeholder="Price"
                                            type="number"
                                            value={productData.price}
                                            onChange={(e) => handleChange("price", e.target.value)}
                                        />
                                        {errors.price && (
                                            <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                        )}
                                    </div>
                                    <div>
                                        <Input
                                            placeholder="Unit (kg, dozen, bunch)"
                                            value={productData.unit}
                                            onChange={(e) => handleChange("unit", e.target.value)}
                                        />
                                        {errors.unit && (
                                            <p className="text-red-500 text-sm mt-1">{errors.unit}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Product Image</label>

                                        {productData.imageUrl && (
                                            <div className="relative w-32 h-32">
                                                <Image
                                                    src={productData.imageUrl}
                                                    alt="Product Preview"
                                                    fill
                                                    className="rounded border object-cover"
                                                //className="w-full h-full object-cover rounded border"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveImage()}
                                                    className="absolute top-[2px] right-[2px] bg-black bg-opacity-50 text-white rounded-full p-1 hover:bg-opacity-75"
                                                    aria-label="Remove image"
                                                >
                                                    <X className='w-4 h-4' />
                                                </button>
                                            </div>
                                        )}

                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90"
                                        />
                                        {/* <Input
                                            placeholder="Image URL"
                                            value={productData.imageUrl ?? ""}
                                            onChange={(e) => handleChange("imageUrl", e.target.value)}
                                        /> */}
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="Description"
                                            value={productData.description ?? ""}
                                            onChange={(e) => handleChange("description", e.target.value)}
                                        />
                                    </div>
                                    {/* <div className="grid grid-cols-3 gap-2">
                                        <Input
                                            placeholder="Calories"
                                            value={productData.nutritionInfo.calories}
                                            onChange={(e) => handleChange("nutrition.calories", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Carbs"
                                            value={productData.nutritionInfo.carbs}
                                            onChange={(e) => handleChange("nutrition.carbs", e.target.value)}
                                        />
                                        <Input
                                            placeholder="Fiber"
                                            value={productData.nutritionInfo.fiber}
                                            onChange={(e) => handleChange("nutrition.fiber", e.target.value)}
                                        />
                                    </div> */}
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button type="button" variant="secondary">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button type="submit" className="bg-fresh-green text-white">
                                            {editingProduct ? "Update Product" : "Save Product"}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Stats Cards */}
                {/* <div className="grid md:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-[hsla(103,38%,57%,0.1)] rounded-xl flex items-center justify-center">
                                    <ShoppingCart className="text-fresh-green w-6 h-6" />
                                </div>
                                <Badge variant="secondary" className="bg-[hsla(103,38%,57%,0.1)] text-fresh-green">
                                    +{Math.round((pendingOrders / Math.max(orders.length, 1)) * 100)}%
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-text">{stats?.totalOrders || 0}</h3>
                            <p className="text-gray-600">Total Orders</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-[hsla(46,84%,64%,0.1)] rounded-xl flex items-center justify-center">
                                    <Users className="text-sunny-yellow w-6 h-6" />
                                </div>
                                <Badge variant="secondary" className="bg-[hsla(46,84%,64%,0.1)] text-sunny-yellow">
                                    +8%
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-text">{stats?.totalCustomers || 0}</h3>
                            <p className="text-gray-600">Customers</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-[hsla(103,38%,57%,0.1)] rounded-xl flex items-center justify-center">
                                    <DollarSign className="text-fresh-green w-6 h-6" />
                                </div>
                                <Badge variant="secondary" className="bg-[hsla(103,38%,57%,0.1)] text-fresh-green">
                                    +15%
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-text">Rs. {parseFloat(stats?.totalRevenue || "0").toLocaleString()}</h3>
                            <p className="text-gray-600">Revenue</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 bg-[hsla(46,84%,64%,0.1)] rounded-xl flex items-center justify-center">
                                    <Package className="text-sunny-yellow w-6 h-6" />
                                </div>
                                <Badge variant="secondary" className="bg-[hsla(46,84%,64%,0.1)] text-sunny-yellow">
                                    +5%
                                </Badge>
                            </div>
                            <h3 className="text-2xl font-bold text-dark-text">{stats?.totalProducts || 0}</h3>
                            <p className="text-gray-600">Products</p>
                        </CardContent>
                    </Card>
                </div> */}

                {/* Main Content */}
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-5 mb-8">
                        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                        <TabsTrigger value="orders">Orders</TabsTrigger>
                        <TabsTrigger value="bags">Bags</TabsTrigger>
                        <TabsTrigger value="products">Products</TabsTrigger>
                        <TabsTrigger value="billing">Billing</TabsTrigger>
                        {/* <TabsTrigger value="messages">Messages</TabsTrigger> */}
                    </TabsList>

                    <TabsContent value="dashboard">
                        <AdminDashboard
                            stats={stats}
                            orders={orders}
                            recentOrders={recentOrders}
                            pendingOrders={pendingOrders}
                            completedOrders={completedOrders}
                        />
                    </TabsContent>

                    <TabsContent value="orders">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl font-bold text-dark-text">All Orders</CardTitle>
                                    <div className="flex space-x-2">
                                        <Badge variant="outline" className="border-fresh-green text-fresh-green">
                                            {pendingOrders} Pending
                                        </Badge>
                                        <Badge variant="outline" className="border-sunny-yellow text-sunny-yellow">
                                            {completedOrders} Completed
                                        </Badge>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <OrdersTable orders={orders} />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="bags">
                        <BagsManagement
                            bags={bags}
                            products={products}
                        />
                    </TabsContent>

                    <TabsContent value="products">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-dark-text">Product Management</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.map((product) => (
                                        <Card key={product.id} className="hover:shadow-lg transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <h4 className="font-semibold text-dark-text">{product.name}</h4>
                                                    <Badge
                                                        variant={product.isAvailable ? "default" : "secondary"}
                                                        className={product.isAvailable ? "bg-fresh-green" : "bg-gray-400"}
                                                    >
                                                        {product.isAvailable ? "Available" : "Out of Stock"}
                                                    </Badge>
                                                </div>
                                                <div className="space-y-2">
                                                    {product.description && <p className="text-sm text-gray-600">Description: {product.description}</p>}
                                                    <p className="text-sm text-gray-600">Category: {product.category}</p>
                                                    <p className="text-sm text-gray-600">Unit: {product.unit}</p>
                                                    <p className="text-lg font-bold text-fresh-green">Rs. {product.price}</p>
                                                </div>
                                                <div className="flex space-x-2 mt-4">
                                                    <Button size="sm" variant="outline" className="flex-1"
                                                        onClick={() => handleEditProduct(product)}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button size="sm" variant="outline" className="flex-1 text-red-600 border-red-200 hover:bg-red-50">
                                                                Delete
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Deleting &ldquo;<span className="font-semibold">{product.name}</span>&ldquo; will
                                                                    remove it permanently from your store.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                                <AlertDialogAction
                                                                    onClick={() => deleteProductMutation.mutate(product.id!)}
                                                                >
                                                                    Yes, Delete
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="billing">
                        <BillingDashboard
                            invoices={mockInvoices}
                            payments={mockPayments}
                            billingRecords={mockBillingRecords}
                            totalRevenue="40750.00"
                            pendingAmount="3400.00"
                            overdueAmount="0.00"
                        />
                    </TabsContent>

                    {/* <TabsContent value="messages">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-xl font-bold text-dark-text">Contact Messages</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {messages.map((message: any) => (
                                        <Card key={message.id} className="hover:shadow-sm transition-shadow">
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div>
                                                        <h4 className="font-semibold text-dark-text">
                                                            {message.firstName} {message.lastName}
                                                        </h4>
                                                        <p className="text-sm text-gray-600">{message.email}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant={message.isReplied ? "default" : "secondary"}>
                                                            {message.isReplied ? "Replied" : "Pending"}
                                                        </Badge>
                                                        <p className="text-xs text-gray-500 mt-1">
                                                            {new Date(message.createdAt).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <p className="font-medium text-gray-800">{message.subject}</p>
                                                    <p className="text-gray-600 text-sm">{message.message}</p>
                                                </div>
                                                {!message.isReplied && (
                                                    <div className="mt-4">
                                                        <Button size="sm" className="bg-fresh-green text-white hover:opacity-90">
                                                            Reply
                                                        </Button>
                                                    </div>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent> */}
                </Tabs>
            </div>
        </div>
    );
}

export default Admin