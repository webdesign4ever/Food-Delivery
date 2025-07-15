'use client';
import { useState, useEffect } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { useLocation } from "wouter";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BoxSelector from "@/components/product/box-selector";
import ItemCustomizer from "@/components/product/item-customizer";
import type { BoxType, Product, CartItem } from "@/lib/types";
import { usePathname } from "next/navigation";

export default function Products() {
    const [selectedBox, setSelectedBox] = useState<BoxType | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const pathname = usePathname();

    //const [location] = useLocation();
    const boxTypes: BoxType[] = []
    // const { data: boxTypes = [] } = useQuery<BoxType[]>({
    //     queryKey: ["/api/box-types"],
    // });

    // const { data: products = [] } = useQuery<Product[]>({
    //     queryKey: ["/api/products"],
    //     queryFn: async () => {
    //         const res = await fetch("/api/products?available=true");
    //         if (!res.ok) throw new Error("Failed to fetch products");
    //         return res.json();
    //     },
    // });

    // const fruits = products.filter(p => p.category === "fruit");
    // const vegetables = products.filter(p => p.category === "vegetable");

    // Auto-select box if boxId is provided in URL
    // useEffect(() => {
    //     const urlParams = new URLSearchParams(window.location.search);
    //     const boxId = urlParams.get('boxId');

    //     if (boxId && boxTypes.length > 0 && !selectedBox) {
    //         const box = boxTypes.find(b => b.id === parseInt(boxId));
    //         if (box) {
    //             setSelectedBox(box);
    //         }
    //     }
    // }, [boxTypes, selectedBox]);

    const calculateTotal = () => {
        // Only calculate the cost of added items, no box price
        return cartItems.reduce((sum, item) => {
            return sum + (parseFloat(item.product.price) * item.quantity);
        }, 0).toFixed(2);
    };

    const addToCart = (product: Product, quantity: number) => {
        if (!selectedBox) return;

        setCartItems(prev => {
            const existing = prev.find(item => item.product.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { product, quantity, sourceBoxType: selectedBox }];
        });
    };

    const removeFromCart = (productId: number) => {
        setCartItems(prev => prev.filter(item => item.product.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.product.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    return (
        <div className="min-h-screen bg-light-green-tint py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-dark-text mb-4">Customize Your Fresh Box</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Choose your box size, then select your favorite fresh fruits and vegetables.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Box Selection */}
                    <div className={`${!selectedBox ? "lg:col-span-3" : "lg:col-span-2"}`}>
                        {!selectedBox ? (
                            <BoxSelector
                                boxTypes={boxTypes}
                                onSelectBox={setSelectedBox}
                            />
                        ) : (
                            <div className="space-y-6">
                                <div className="bg-white rounded-2xl p-6 shadow-lg">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-2xl font-bold text-dark-text">{selectedBox.name}</h3>
                                            <p className="text-gray-600">{selectedBox.description}</p>
                                        </div>
                                        <button
                                            onClick={() => setSelectedBox(null)}
                                            className="text-fresh-green hover:opacity-80 font-medium"
                                        >
                                            Change Box
                                        </button>
                                    </div>
                                </div>

                                <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="all">All Products</TabsTrigger>
                                        <TabsTrigger value="fruits">Fruits</TabsTrigger>
                                        <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="mt-6">
                                        <ItemCustomizer
                                            //products={products}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>

                                    <TabsContent value="fruits" className="mt-6">
                                        <ItemCustomizer
                                            //products={fruits}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>

                                    <TabsContent value="vegetables" className="mt-6">
                                        <ItemCustomizer
                                            //products={vegetables}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                    </div>

                    {/* Cart Summary */}
                    {selectedBox && (
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                                <h3 className="text-xl font-bold text-dark-text mb-4">Your Box</h3>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Current Box:</span>
                                        <span className="text-fresh-green font-semibold">{selectedBox.name}</span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="font-medium">Total Items:</span>
                                        <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
                                    </div>

                                    {cartItems.length > 0 && (
                                        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                            <strong>Note:</strong> Items from all box types will be combined in your order
                                        </div>
                                    )}
                                </div>

                                {cartItems.length > 0 && (
                                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                <span className="flex-1">{item.product.name}</span>
                                                <div className="flex items-center space-x-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                                        <span>Total:</span>
                                        <span className="text-fresh-green">Rs. {calculateTotal()}</span>
                                    </div>

                                    <button
                                        disabled={cartItems.length === 0}
                                        onClick={() => {
                                            if (cartItems.length > 0) {
                                                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                                                // Use the first available box type for checkout since this is now a mixed order
                                                const boxId = boxTypes.length > 0 ? boxTypes[0].id : 1;
                                                window.location.href = `/checkout?boxId=${boxId}`;
                                            }
                                        }}
                                        className="w-full bg-fresh-green text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                    >
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
