import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { BagForm, BoxType, Product } from '@/lib/types';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { MultiSelect } from '../ui/multi-select';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BagsManagementProps {
    bags: BagForm[]
    products: Product[]
    //   stats?: OrderStats;
    //   recentOrders: (Order & { customer: Customer; bagType: BoxType; orderItems: any[] })[];
    //   pendingOrders: number;
    //   completedOrders: number;
    //   orders?: Order[]
}

const BagsManagement = ({ bags, products }: BagsManagementProps) => {

    const { toast } = useToast();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [bagData, setBagData] = useState<BagForm>({
        name: "",
        category: "fruit",
        fixedItems: [],
        customizableItems: [],
        price: "",
        description: null,
        isActive: true,
        itemsLimit: 0
    });

    const [editingBag, setEditingBag] = useState<null | BagForm>(null);
    const [errors, setErrors] = useState<Record<string, string>>({})

    const filteredProducts = products.filter(
        (product) => product.category === bagData.category
    );

    const handleChange = (key: keyof BagForm, value: any) => {
        setBagData(prev => ({ ...prev, [key]: value }));
        setErrors({ ...errors, [key]: "" })
    };

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!bagData.name || bagData.name.trim().length < 1) {
            newErrors.name = "Bag Name is required";
        }

        if (!bagData.category) {
            newErrors.category = "Category is required";
        }

        if (!bagData.price) {
            newErrors.price = "Price is required";
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const createBagMutation = useMutation({
        mutationFn: async (bagData: any) => {
            return apiRequest("POST", "/bag-types", bagData);
        },
        onSuccess: () => {
            // Invalidate stats cache to update counters on home page
            queryClient.invalidateQueries({ queryKey: ["/bag-types"] });

            toast({
                title: "Bag Added!",
                description: "The new bag has been successfully created and added to your store.",
            });

            // 👇 Close the dialog
            setIsDialogOpen(false);

            // Optional: Clear form data
            setBagData({
                name: "",
                category: "fruit",
                fixedItems: [],
                customizableItems: [],
                price: "",
                description: null,
                isActive: true,
                itemsLimit: 0
            })
        },
        onError: () => {
            toast({
                title: "Failed to Add Bag",
                description: "There was an error while creating the bag. Please check your inputs and try again.",
                variant: "destructive",
            });
        },
    });

    const updateBagMutation = useMutation({
        mutationFn: async (updatedBag: any) => {
            return apiRequest("PUT", `/bag-types/${updatedBag.id}`, updatedBag);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["/bag-types"] });
            toast({
                title: "Bag Updated!",
                description: "The bag details have been successfully updated.",
            });
            setIsDialogOpen(false);
            setBagData({
                name: "",
                category: "fruit",
                fixedItems: [],
                customizableItems: [],
                price: "",
                description: null,
                isActive: true,
                itemsLimit: 0
            })
            setEditingBag(null);
        },
        onError: () => {
            toast({
                title: "Failed to Update Bag",
                description: "There was an error while updating the bag. Please try again.",
                variant: "destructive",
            });
        },
    });

    const handleAddBag = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        const totalItems = bagData.fixedItems.length + bagData.customizableItems.length;

        const payload = {
            ...bagData,
            price: parseFloat(bagData.price),
            description: bagData.description?.trim() || null,
            itemsLimit: totalItems, // ✅ override with correct value
        };

        if (editingBag) {
            updateBagMutation.mutate({
                id: editingBag.id,
                ...payload,
            });
        } else {
            createBagMutation.mutate(payload);
        }

        // if (editingBag) {
        //     // Edit product
        //     updateBagMutation.mutate({
        //         id: editingBag.id,
        //         ...bagData,
        //         description: bagData.description?.trim() || null,
        //         price: parseFloat(bagData.price),
        //     });
        // } else {
        //     createBagMutation.mutate({
        //         ...bagData,
        //         price: parseFloat(bagData.price),
        //     });
        // }
    };

    const handleEditBag = (bag: BagForm) => {
        setEditingBag(bag);
        //setBagData(bag);
        setBagData({
            ...bag,
            fixedItems: bag.fixedItems.map(String),
            customizableItems: bag.customizableItems.map(String),
        });
        setIsDialogOpen(true);
    };

    useEffect(() => {
        const categoryProducts = products.filter(p => p.category === bagData.category);

        // Optional: remove any selected items not in new category
        setBagData((prev) => ({
            ...prev,
            fixedItems: prev.fixedItems.filter((id) =>
                categoryProducts.some((p) => p.id.toString() === id)
            ),
            customizableItems: prev.customizableItems.filter((id) =>
                categoryProducts.some((p) => p.id.toString() === id)
            ),
        }));
    }, [bagData.category, products]);

    useEffect(() => {
        if (!isDialogOpen) {
            setBagData({
                name: "",
                category: "fruit",
                fixedItems: [],
                customizableItems: [],
                price: "",
                description: null,
                isActive: true,
                itemsLimit: 0
            })
            setEditingBag(null)
            setErrors({})
        }
    }, [isDialogOpen]);

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-dark-text">Bag Management</CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-fresh-green text-white hover:opacity-90">
                                <Plus className="mr-2 w-4 h-4" />
                                Add Bag
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-h-[98vh] overflow-y-auto" onCloseAutoFocus={(e) => e.preventDefault()}>
                            <DialogHeader>
                                <DialogTitle>
                                    {editingBag ? "Edit Bag" : "Add New Bag"}
                                </DialogTitle>
                                <DialogDescription>
                                    {editingBag ? "Enter bag details to update." : "Enter bag details to add it to your store."}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddBag} className="space-y-4">
                                <div>
                                    <Input
                                        placeholder="Bag Name"
                                        value={bagData.name}
                                        onChange={(e) => handleChange("name", e.target.value)}
                                    />
                                    {errors.name && (
                                        <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Select
                                        value={bagData.category}
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
                                <div className="flex items-center space-x-2">
                                    <MultiSelect
                                        options={filteredProducts.map(p => ({ value: p.id.toString(), label: p.name }))}
                                        selected={bagData.fixedItems}
                                        onChange={(val) => handleChange("fixedItems", val)}
                                        placeholder="Fixed items"
                                        disabledOptions={bagData.customizableItems} // ✅ disable those already in customizable
                                    />
                                </div>
                                <div className="flex items-center space-x-2">
                                    <MultiSelect
                                        options={filteredProducts.map(p => ({ value: p.id.toString(), label: p.name }))}
                                        selected={bagData.customizableItems}
                                        onChange={(val) => handleChange("customizableItems", val)}
                                        placeholder="Customizable items"
                                        disabledOptions={bagData.fixedItems} // ✅ disable those already in fixed
                                    />
                                </div>
                                <div>
                                    <Input
                                        placeholder="Price"
                                        type="number"
                                        value={bagData.price}
                                        onChange={(e) => handleChange("price", e.target.value)}
                                    />
                                    {errors.price && (
                                        <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                                    )}
                                </div>
                                <div>
                                    <Textarea
                                        placeholder="Description"
                                        value={bagData.description ?? ""}
                                        onChange={(e) => handleChange("description", e.target.value)}
                                    />
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="secondary">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" className="bg-fresh-green text-white">
                                        {editingBag ? "Update Bag" : "Save Bag"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bags.map((bag) => (
                        <Card key={bag.id} className="hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-semibold text-dark-text">{bag.name}</h4>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-600">Description: {bag.description}</p>
                                    <p className="text-sm text-gray-600">Items Limit: {bag.itemsLimit}</p>
                                    <p className="text-lg font-bold text-fresh-green">Rs. {bag.price}</p>
                                </div>
                                <div className="flex space-x-2 mt-4">
                                    <Button size="sm" variant="outline" className="flex-1"
                                        onClick={() => handleEditBag(bag)}
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
                                                    Deleting &ldquo;<span className="font-semibold">{bag.name}</span>&ldquo; will
                                                    remove it permanently from your store.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction
                                                // onClick={() => deleteProductMutation.mutate(product.id!)}
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
    )
}

export default BagsManagement