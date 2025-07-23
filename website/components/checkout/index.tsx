'use client'
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
//import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { useForm } from "react-hook-form";
//import { zodResolver } from "@hookform/resolvers/zod";
//import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import type { BoxType, CartItem, Customer, OrderData } from "@/lib/types";
import { Download, FileText, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { BASE_URL, queryClient } from "@/lib/queryClient";

// const customerSchema = z.object({
//     firstName: z.string().min(1, "First name is required"),
//     lastName: z.string().min(1, "Last name is required"),
//     email: z.string().email("Valid email is required"),
//     phone: z.string().min(11, "Valid phone number is required"),
//     address: z.string().min(10, "Complete address is required"),
//     city: z.string().min(1, "City is required"),
//     paymentMethod: z.enum(["easypaisa", "jazzcash"]),
//     specialInstructions: z.string().optional(),
// });

// type CustomerFormData = z.infer<typeof customerSchema>;

export type PaymentMethod = "easypaisa" | "jazzcash";

export interface CustomerFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    paymentMethod: PaymentMethod;
    specialInstructions?: string;
}

interface Receipt {
    id: number;
    orderNumber: string;
    customer: Customer;
    boxType: BoxType;
    items: CartItem[];
    subtotal: string;
    boxPrice: string;
    total: string;
    paymentMethod: string;
    orderDate: string;
    // deliveryDate: string;
}

const Checkout = () => {

    const router = useRouter();
    //const [, setLocation] = useLocation();
    const { toast } = useToast();
    const [receipt, setReceipt] = useState<Receipt | null>(null);
    const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

    let boxId: string | null = null;
    let cartItems: CartItem[] = [];

    // Get cart data from URL params or localStorage
    if (typeof window !== "undefined") {
        const urlParams = new URLSearchParams(window.location.search);
        boxId = urlParams.get('boxId');
        const cartData = localStorage.getItem('cartItems');
        cartItems = cartData ? JSON.parse(cartData) : [];
    }

    const { data: boxTypes = [] } = useQuery<BoxType[]>({
        queryKey: ["/bag-types"],
    });

    const selectedBox = boxTypes.find(box => box.id === parseInt(boxId || '0'));

    // const form = useForm<CustomerFormData>({
    //     resolver: zodResolver(customerSchema),
    //     defaultValues: {
    //         firstName: "",
    //         lastName: "",
    //         email: "",
    //         phone: "",
    //         address: "",
    //         city: "",
    //         paymentMethod: "easypaisa",
    //         specialInstructions: "",
    //     },
    // });

    const [formData, setFormData] = useState<CustomerFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        paymentMethod: "easypaisa",
        specialInstructions: "",
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value })
        setErrors({ ...errors, [field]: "" }) // Clear error on change
    }

    const validate = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.firstName || formData.firstName.trim().length < 1) {
            newErrors.firstName = "First name is required";
        }

        if (!formData.lastName || formData.lastName.trim().length < 1) {
            newErrors.lastName = "Last name is required";
        }

        if (!formData.email || !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email.trim())) {
            newErrors.email = "Valid email is required";
        }

        if (!formData.phone || formData.phone.trim().length < 11) {
            newErrors.phone = "Valid phone number is required";
        }

        if (!formData.address || formData.address.trim().length < 10) {
            newErrors.address = "Complete address is required";
        }

        if (!formData.city || formData.city.trim().length < 1) {
            newErrors.city = "City is required";
        }

        if (!formData.paymentMethod || !["easypaisa", "jazzcash"].includes(formData.paymentMethod)) {
            newErrors.paymentMethod = "Payment method must be Easypaisa or JazzCash";
        }

        setErrors(newErrors)

        return Object.keys(newErrors).length === 0
    }

    const calculateTotal = () => {
        // Only calculate the cost of added items, no box price
        return cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }, 0).toFixed(2);
    };

    const calculateSubtotal = () => {
        return cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }, 0).toFixed(2);
    };

    const createOrderMutation = useMutation({
        mutationFn: async (orderData: OrderData) => {
            const response = await fetch(`${BASE_URL}/orders`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error("Failed to create order");
            }

            return await response.json();
        },
        onSuccess: (data) => {
            const newReceipt: Receipt = {
                id: data.id,
                orderNumber: `FB${String(data.id).padStart(3, '0')}`,
                customer: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                },
                boxType: selectedBox!,
                items: cartItems,
                subtotal: calculateSubtotal(),
                boxPrice: "0.00",
                total: calculateTotal(),
                //paymentMethod: form.getValues('paymentMethod'),
                paymentMethod: formData.paymentMethod,
                orderDate: new Date().toLocaleDateString(),
                //deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString(),
            };

            setReceipt(newReceipt);
            localStorage.removeItem('cartItems');

            // Invalidate stats cache to update counters on home page
            queryClient.invalidateQueries({ queryKey: ["/stats"] });

            toast({
                title: "Order Placed Successfully!",
                description: "Your fresh box order has been confirmed.",
            });
        },
        onError: () => {
            toast({
                title: "Order Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
            });
        },
    });

    //const onSubmit = (data: CustomerFormData) => {
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedBox || cartItems.length === 0) {
            toast({
                title: "Invalid Order",
                description: "Please add items to your cart first.",
                variant: "destructive",
            });
            return;
        }

        if (!validate()) return;

        const orderData: OrderData = {
            customer: {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                phone: formData.phone,
                address: formData.address,
                city: formData.city,
            },
            bagTypeId: selectedBox.id,
            totalAmount: calculateTotal(),
            paymentMethod: formData.paymentMethod,
            specialInstructions: formData.specialInstructions,
            // paymentMethod: data.paymentMethod,
            // specialInstructions: data.specialInstructions,
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity.toString(),
                unitPrice: item.product.price,
            })),
        };

        createOrderMutation.mutate(orderData);
    };

    const generatePDF = async () => {
        if (!receipt) return;

        setIsGeneratingPDF(true);

        try {
            // Create a print window for PDF generation
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                throw new Error('Could not open print window');
            }

            const receiptHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>FreshBox Receipt - ${receipt.orderNumber}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #22c55e; padding-bottom: 20px; margin-bottom: 20px; }
            .logo { color: #22c55e; font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .order-info { background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .customer-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items-table th, .items-table td { border: 1px solid #e2e8f0; padding: 10px; text-align: left; }
            .items-table th { background: #f1f5f9; }
            .total-section { border-top: 2px solid #22c55e; padding-top: 15px; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .final-total { font-size: 18px; font-weight: bold; color: #22c55e; }
            .footer { text-align: center; margin-top: 30px; color: #64748b; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="logo">🥬 FreshBox</div>
            <h2>Order Receipt</h2>
            <p>Thank you for choosing fresh, organic produce!</p>
          </div>
          
          <div class="order-info">
            <h3>Order Information</h3>
            <p><strong>Order Number:</strong> ${receipt.orderNumber}</p>
            <p><strong>Order Date:</strong> ${receipt.orderDate}</p>
            <p><strong>Payment Method:</strong> ${receipt.paymentMethod.toUpperCase()}</p>
          </div>
          
          <div class="customer-info">
            <h3>Delivery Information</h3>
            <p><strong>Name:</strong> ${receipt.customer.firstName} ${receipt.customer.lastName}</p>
            <p><strong>Email:</strong> ${receipt.customer.email}</p>
            <p><strong>Phone:</strong> ${receipt.customer.phone}</p>
            <p><strong>Address:</strong> ${receipt.customer.address}, ${receipt.customer.city}</p>
          </div>
          
          <h3>Order Details</h3>
          <table class="items-table">
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${receipt.items.map(item => `
                <tr>
                  <td>${item.sourceBoxType?.name || 'Mixed Selection'} - ${item.product.name}</td>
                  <td>${item.quantity} ${item.product.unit}</td>
                  <td>Rs. ${item.product.price}</td>
                  <td>Rs. ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="total-section">
            <div class="total-row">
              <span>Items Subtotal:</span>
              <span>Rs. ${receipt.subtotal}</span>
            </div>
            <div class="total-row final-total">
              <span>Total Amount:</span>
              <span>Rs. ${receipt.total}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>🌱 Fresh • Organic • Delivered to Your Door</p>
            <p>Contact us: info@freshbox.pk | +92-300-FRESHBOX</p>
          </div>
        </body>
        </html>
      `;

            printWindow.document.write(receiptHTML);
            printWindow.document.close();
            printWindow.focus();
            printWindow.print();

        } catch (error) {
            console.error("PDF Generation Error:", error);
            toast({
                title: "PDF Generation Failed",
                description: "Please try again or contact support.",
                variant: "destructive",
            });
        } finally {
            setIsGeneratingPDF(false);
        }
    };

    if (receipt) {
        return (
            <div className="min-h-screen bg-light-green-tint py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader className="text-center">
                            <CardTitle className="text-3xl font-bold text-fresh-green">🥬 FreshBox</CardTitle>
                            <p className="text-xl font-semibold text-dark-text">Order Receipt</p>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Order Info */}
                            <div className="bg-light-green-tint p-4 rounded-lg">
                                <h3 className="font-semibold text-dark-text mb-2">Order Information</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Order Number:</span> {receipt.orderNumber}</p>
                                    <p><span className="font-medium">Order Date:</span> {receipt.orderDate}</p>
                                    {/* <p><span className="font-medium">Estimated Delivery:</span> {receipt.deliveryDate}</p> */}
                                    <p><span className="font-medium">Payment Method:</span> {receipt.paymentMethod.toUpperCase()}</p>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div>
                                <h3 className="font-semibold text-dark-text mb-2">Delivery Information</h3>
                                <div className="space-y-1 text-sm">
                                    <p><span className="font-medium">Name:</span> {receipt.customer.firstName} {receipt.customer.lastName}</p>
                                    <p><span className="font-medium">Email:</span> {receipt.customer.email}</p>
                                    <p><span className="font-medium">Phone:</span> {receipt.customer.phone}</p>
                                    <p><span className="font-medium">Address:</span> {receipt.customer.address}, {receipt.customer.city}</p>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div>
                                <h3 className="font-semibold text-dark-text mb-2">Order Details</h3>
                                <div className="space-y-3">
                                    {/* Group items by source box type */}
                                    {(() => {
                                        const itemsByBoxType = receipt.items.reduce((acc, item) => {
                                            const boxName = item.sourceBoxType?.name || 'Mixed Selection';
                                            if (!acc[boxName]) {
                                                acc[boxName] = [];
                                            }
                                            acc[boxName].push(item);
                                            return acc;
                                        }, {} as Record<string, typeof receipt.items>);

                                        return Object.entries(itemsByBoxType).map(([boxName, items]) => {
                                            const boxTotal = items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0);
                                            return (
                                                <div key={boxName} className="space-y-2">
                                                    <div className="flex justify-between items-center p-3 bg-light-green-tint rounded">
                                                        <div>
                                                            <span className="font-medium">{boxName}</span>
                                                            <p className="text-sm text-gray-600">{items.length} item{items.length > 1 ? 's' : ''} selected</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium">Rs. {boxTotal.toFixed(2)}</p>
                                                        </div>
                                                    </div>

                                                    {items.map((item) => (
                                                        <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded ml-4">
                                                            <div>
                                                                <span className="font-medium">{item.product.name}</span>
                                                                <p className="text-sm text-gray-600">{item.product.category}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                <p className="font-medium">Rs. {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</p>
                                                                <p className="text-sm text-gray-600">Qty: {item.quantity} {item.product.unit}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            );
                                        });
                                    })()}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="border-t pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Items Subtotal:</span>
                                        <span>Rs. {receipt.subtotal}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-fresh-green">
                                        <span>Total Amount:</span>
                                        <span>Rs. {receipt.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-4 pt-6">
                                <Button
                                    onClick={generatePDF}
                                    disabled={isGeneratingPDF}
                                    className="flex-1 bg-fresh-green text-white hover:bg-[hsla(103,38%,57%,0.9)]"
                                >
                                    {isGeneratingPDF ? (
                                        "Generating..."
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4 mr-2" />
                                            Download Receipt
                                        </>
                                    )}
                                </Button>
                                <Button
                                    //onClick={() => setLocation('/products')}
                                    onClick={() => router.push("/products")}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <FileText className="w-4 h-4 mr-2" />
                                    New Order
                                </Button>
                            </div>

                            <div className="text-center pt-6 border-t">
                                <p className="text-gray-600">🌱 Thank you for choosing FreshBox!</p>
                                <p className="text-sm text-gray-500 mt-1">Fresh • Organic • Delivered to Your Door</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    // Show empty cart message only if no receipt and no items
    if (!selectedBox || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-light-green-tint py-8">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card>
                        <CardContent className="p-8 text-center">
                            <h2 className="text-2xl font-bold text-dark-text mb-4">No Items in Cart</h2>
                            <p className="text-gray-600 mb-6">Please add items to your cart before proceeding to checkout.</p>
                            <Button onClick={() => router.push("/products")} className="bg-fresh-green text-white hover:bg-[hsla(103,38%,57%,0.9)]">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Products
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-light-green-tint py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-dark-text mb-2">Checkout</h1>
                    <p className="text-gray-600">Complete your fresh box order</p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Order Form */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Delivery Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={onSubmit}
                                //onSubmit={form.handleSubmit(onSubmit)} 
                                className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="firstName">First Name</Label>
                                        <Input
                                            id="firstName"
                                            value={formData.firstName}
                                            onChange={(e) => handleChange("firstName", e.target.value)}
                                            className="mt-1"
                                        // {...form.register("firstName")}
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                                        )}
                                        {/* {form.formState.errors.firstName && (
                                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.firstName.message}</p>
                                        )} */}
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName">Last Name</Label>
                                        <Input
                                            id="lastName"
                                            value={formData.lastName}
                                            onChange={(e) => handleChange("lastName", e.target.value)}
                                            className="mt-1"
                                        // {...form.register("lastName")}

                                        />
                                        {errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                                        )}
                                        {/* {form.formState.errors.lastName && (
                                            <p className="text-red-500 text-sm mt-1">{form.formState.errors.lastName.message}</p>
                                        )} */}
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleChange("email", e.target.value)}
                                        className="mt-1"
                                    // {...form.register("email")}

                                    />
                                    {errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                                    )}
                                    {/* {form.formState.errors.email && (
                                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.email.message}</p>
                                    )} */}
                                </div>

                                <div>
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={formData.phone}
                                        onChange={(e) => handleChange("phone", e.target.value)}
                                        placeholder="03XX-XXXXXXX"
                                        className="mt-1"
                                    // {...form.register("phone")}
                                    />
                                    {errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                                    )}
                                    {/* {form.formState.errors.phone && (
                                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.phone.message}</p>
                                    )} */}
                                </div>

                                <div>
                                    <Label htmlFor="address">Complete Address</Label>
                                    <Textarea
                                        id="address"
                                        value={formData.address}
                                        onChange={(e) => handleChange("address", e.target.value)}
                                        placeholder="House/Flat number, Street, Area"
                                        className="mt-1"
                                    // {...form.register("address")}
                                    />
                                    {errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                                    )}
                                    {/* {form.formState.errors.address && (
                                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.address.message}</p>
                                    )} */}
                                </div>

                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={(e) => handleChange("city", e.target.value)}
                                        className="mt-1"
                                    // {...form.register("city")}
                                    />
                                    {errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{errors.city}</p>
                                    )}
                                    {/* {form.formState.errors.city && (
                                        <p className="text-red-500 text-sm mt-1">{form.formState.errors.city.message}</p>
                                    )} */}
                                </div>

                                <div>
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Select
                                        value={formData.paymentMethod}
                                        onValueChange={(value) => handleChange("paymentMethod", value as "easypaisa" | "jazzcash")}
                                    // value={form.watch("paymentMethod")}
                                    // onValueChange={(value) => form.setValue("paymentMethod", value as "easypaisa" | "jazzcash")}
                                    >
                                        <SelectTrigger className="mt-1">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="easypaisa">Easypaisa</SelectItem>
                                            <SelectItem value="jazzcash">JazzCash</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {/* {errors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
                                    )} */}
                                </div>

                                <div>
                                    <Label htmlFor="specialInstructions">Special Instructions (Optional)</Label>
                                    <Textarea
                                        id="specialInstructions"
                                        value={formData.specialInstructions}
                                        onChange={(e) => handleChange("specialInstructions", e.target.value)}
                                        placeholder="Any special delivery instructions"
                                        className="mt-1"
                                    //{...form.register("specialInstructions")}
                                    />
                                    {/* {errors.specialInstructions && (
                                        <p className="text-red-500 text-sm mt-1">{errors.specialInstructions}</p>
                                    )} */}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={createOrderMutation.isPending}
                                    className="w-full bg-fresh-green text-white hover:bg-[hsla(103,38%,57%,0.9)]"
                                >
                                    {createOrderMutation.isPending ? "Processing..." : "Place Order"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>

                    {/* Order Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Order Summary</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-3">
                                {/* Group items by source box type */}
                                {(() => {
                                    const itemsByBoxType = cartItems.reduce((acc, item) => {
                                        const boxName = item.sourceBoxType?.name || 'Mixed Selection';
                                        if (!acc[boxName]) {
                                            acc[boxName] = [];
                                        }
                                        acc[boxName].push(item);
                                        return acc;
                                    }, {} as Record<string, typeof cartItems>);

                                    return Object.entries(itemsByBoxType).map(([boxName, items]) => (
                                        <div key={boxName} className="space-y-2">
                                            <div className="flex justify-between items-center p-3 bg-light-green-tint rounded">
                                                <div>
                                                    <span className="font-medium">{boxName}</span>
                                                    <p className="text-sm text-gray-600">{items.length} item{items.length > 1 ? 's' : ''} selected</p>
                                                </div>
                                                <span className="font-semibold text-gray-500">
                                                    Rs. {items.reduce((sum, item) => sum + (parseFloat(item.product.price) * item.quantity), 0).toFixed(2)}
                                                </span>
                                            </div>

                                            {items.map((item) => (
                                                <div key={item.product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded ml-4">
                                                    <div>
                                                        <span className="font-medium">{item.product.name}</span>
                                                        <p className="text-sm text-gray-600">{item.quantity} {item.product.unit}</p>
                                                    </div>
                                                    <span className="font-semibold">Rs. {(parseFloat(item.product.price) * item.quantity).toFixed(2)}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ));
                                })()}
                            </div>

                            <div className="border-t pt-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Items Subtotal:</span>
                                        <span>Rs. {calculateSubtotal()}</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold text-fresh-green">
                                        <span>Total:</span>
                                        <span>Rs. {calculateTotal()}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                //onClick={() => setLocation('/products')}
                                onClick={() => router.push("/products")}
                                variant="outline"
                                className="w-full"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Products
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );

}

export default Checkout