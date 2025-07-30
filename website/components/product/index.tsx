'use client';
import { useState, useEffect, useMemo, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import BoxSelector from "@/components/product/box-selector";
import ItemCustomizer from "@/components/product/item-customizer";
import type { Product, CartItem, BagForm } from "@/lib/types";
import { BASE_URL } from "@/lib/queryClient";
import Link from "next/link";
import { Badge } from "../ui/badge";

export default function Products() {
    const [selectedBox, setSelectedBox] = useState<BagForm | null>(null);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [autoSelected, setAutoSelected] = useState(false);

    const { data: boxTypes = [] } = useQuery<BagForm[]>({
        queryKey: ["/bag-types"],
    });

    const { data: products = [], isLoading: isProductsLoading } = useQuery<Product[]>({
        queryKey: ["/products"],
        queryFn: async () => {
            const res = await fetch(`${BASE_URL}/products?available=true`);
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });

    // const fruits = products.filter(p => p.category === "fruit");
    // const vegetables = products.filter(p => p.category === "vegetable");

    // Auto-select box if boxId is provided in URL
    useEffect(() => {
        if (autoSelected) return;
        const urlParams = new URLSearchParams(window.location.search);
        const boxId = urlParams.get('boxId');

        if (boxId && boxTypes.length > 0) {
            const box = boxTypes.find(b => b.id === parseInt(boxId));
            if (box) {
                setSelectedBox(box);
                setAutoSelected(true);
            }
        }
    }, [boxTypes, autoSelected]);

    // Initialize cart with both fixed and customizable items
    useEffect(() => {
        if (!selectedBox || !products.length) return;

        // Get fixed products
        const fixedProducts = products.filter(p =>
            selectedBox.fixedItems.includes(p.id))
            .map(product => ({
                product,
                quantity: 1,
                sourceBoxType: selectedBox,
                isFixed: true
            }));

        // Get customizable products (initialize with first item if needed)
        const customizableProducts = products.filter(p =>
            selectedBox.customizableItems.includes(p.id))
            .map(product => ({
                product,
                quantity: 1,
                sourceBoxType: selectedBox,
                isFixed: false
            }));

        setCartItems([...fixedProducts, ...customizableProducts]);
    }, [selectedBox, products,]);

    // Calculate total items count (including fixed items)
    const calculateTotalItems = useMemo(() =>
        cartItems.reduce((sum, item) => sum + item.quantity, 0),
        [cartItems]
    );
    // const calculateTotalItems = () => {
    //     return cartItems.reduce((sum, item) => sum + item.quantity, 0);
    // };

    // Calculate total price (using box price instead of item prices)
    const calculateTotal = useMemo(() =>
        selectedBox ? selectedBox.price : "0.00",
        [selectedBox]
    );
    // const calculateTotal = () => {
    //     if (!selectedBox) return "0.00";
    //     return selectedBox.price;
    // };

    // const calculateTotal = () => {
    //     // Only calculate the cost of added items, no box price
    //     return cartItems.reduce((sum, item) => {
    //         return sum + (parseFloat(item.product.price) * item.quantity);
    //     }, 0).toFixed(2);
    // };

    // Check if cart meets the items limit requirement
    const isCartValid = useMemo(() =>
        selectedBox ? calculateTotalItems === selectedBox.itemsLimit : false,
        [selectedBox, calculateTotalItems]
    );
    // const isCartValid = () => {
    //     if (!selectedBox) return false;
    //     return calculateTotalItems() == selectedBox.itemsLimit;
    // };

    const addToCart = useCallback((product: Product, quantity: number) => {
        if (!selectedBox) return;

        // Check if product is fixed (shouldn't be added manually)
        if (selectedBox.fixedItems.includes(product.id)) return;

        setCartItems(prev => {
            const existing = prev.find(item =>
                item.product.id === product.id && !item.isFixed
            );

            if (existing) {
                return prev.map(item =>
                    item.product.id === product.id && !item.isFixed
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, {
                product,
                quantity,
                sourceBoxType: selectedBox,
                isFixed: false
            }];
        });
    }, [selectedBox]);
    // const addToCart = (product: Product, quantity: number) => {
    //     if (!selectedBox) return;

    //     // Check if product is fixed (shouldn't be added manually)
    //     if (selectedBox.fixedItems.includes(product.id)) return;

    //     setCartItems(prev => {
    //         const existing = prev.find(item =>
    //             item.product.id === product.id && !item.isFixed
    //         );

    //         if (existing) {
    //             return prev.map(item =>
    //                 item.product.id === product.id && !item.isFixed
    //                     ? { ...item, quantity: item.quantity + quantity }
    //                     : item
    //             );
    //         }
    //         return [...prev, {
    //             product,
    //             quantity,
    //             sourceBoxType: selectedBox,
    //             isFixed: false
    //         }];
    //     });
    // };

    // const addToCart = (product: Product, quantity: number) => {
    //     if (!selectedBox) return;

    //     setCartItems(prev => {
    //         const existing = prev.find(item => item.product.id === product.id);
    //         if (existing) {
    //             return prev.map(item =>
    //                 item.product.id === product.id
    //                     ? { ...item, quantity: item.quantity + quantity }
    //                     : item
    //             );
    //         }
    //         return [...prev, { product, quantity, sourceBoxType: selectedBox }];
    //     });
    // };

    const removeFromCart = useCallback((productId: number) => {
        setCartItems(prev =>
            prev.filter(item =>
                item.product.id !== productId || item.isFixed
            )
        );
    }, []);
    // const removeFromCart = (productId: number) => {
    //     setCartItems(prev =>
    //         prev.filter(item =>
    //             item.product.id !== productId || item.isFixed
    //         )
    //     );
    // };

    // const removeFromCart = (productId: number) => {
    //     setCartItems(prev => prev.filter(item => item.product.id !== productId));
    // };

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        // Prevent modifying fixed items
        const isFixed = cartItems.some(item =>
            item.product.id === productId && item.isFixed
        );
        if (isFixed) return;

        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }

        setCartItems(prev =>
            prev.map(item =>
                item.product.id === productId && !item.isFixed
                    ? { ...item, quantity }
                    : item
            )
        );
    }, [cartItems, removeFromCart]);
    // const updateQuantity = (productId: number, quantity: number) => {
    //     // Prevent modifying fixed items
    //     const isFixed = cartItems.some(item =>
    //         item.product.id === productId && item.isFixed
    //     );
    //     if (isFixed) return;

    //     if (quantity <= 0) {
    //         removeFromCart(productId);
    //         return;
    //     }

    //     setCartItems(prev =>
    //         prev.map(item =>
    //             item.product.id === productId && !item.isFixed
    //                 ? { ...item, quantity }
    //                 : item
    //         )
    //     );
    // };


    // const updateQuantity = (productId: number, quantity: number) => {
    //     if (quantity <= 0) {
    //         removeFromCart(productId);
    //         return;
    //     }

    //     setCartItems(prev =>
    //         prev.map(item =>
    //             item.product.id === productId
    //                 ? { ...item, quantity }
    //                 : item
    //         )
    //     );
    // };


    // Add loading state to your UI
    if (isProductsLoading) {
        return (
            <div className="min-h-screen bg-light-green-tint py-8 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fresh-green mx-auto"></div>
                    <p className="mt-4 text-dark-text">Loading your box...</p>
                </div>
            </div>
        );
    }

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
                                        <Link href={'/products'}
                                            onClick={() => {
                                                setSelectedBox(null)
                                                setCartItems([]);
                                            }}
                                            className="text-fresh-green hover:opacity-80 font-medium"
                                        >
                                            Change Box

                                        </Link>
                                        {/* <button
                                            onClick={() => {
                                                setSelectedBox(null)
                                                setCartItems([]);
                                            }}
                                            className="text-fresh-green hover:opacity-80 font-medium"
                                        >
                                            Change Box
                                        </button> */}
                                    </div>
                                </div>

                                <ItemCustomizer
                                    products={
                                        selectedBox.category === 'mixed'
                                            ? products // show all for 'mixed'
                                            : products.filter((p) => p.category === selectedBox.category)
                                    }
                                    onAddToCart={addToCart}
                                    selectedBox={selectedBox}
                                    cartItems={cartItems}
                                />

                                {/* <Tabs defaultValue="all" className="w-full">
                                    <TabsList className="grid w-full grid-cols-3">
                                        <TabsTrigger value="all">All Products</TabsTrigger>
                                        <TabsTrigger value="fruits">Fruits</TabsTrigger>
                                        <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="all" className="mt-6">
                                        <ItemCustomizer
                                            products={products}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>

                                    <TabsContent value="fruits" className="mt-6">
                                        <ItemCustomizer
                                            products={fruits}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>

                                    <TabsContent value="vegetables" className="mt-6">
                                        <ItemCustomizer
                                            products={vegetables}
                                            onAddToCart={addToCart}
                                            cartItems={cartItems}
                                        />
                                    </TabsContent>
                                </Tabs> */}
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
                                        <span>
                                            {calculateTotalItems}/{selectedBox.itemsLimit}
                                        </span>
                                        {/* <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span> */}
                                    </div>

                                    {!isCartValid && (
                                        <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                                            Please select at least {selectedBox.itemsLimit} items to proceed
                                        </div>
                                    )}
                                    {/* {cartItems.length > 0 && (
                                        <div className="text-sm text-gray-600 bg-yellow-50 p-2 rounded">
                                            <strong>Note:</strong> Items from all box types will be combined in your order
                                        </div>
                                    )} */}
                                </div>

                                {cartItems.length > 0 && (
                                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                                        {cartItems.map((item) => (
                                            <div key={item.product.id} className="flex justify-between items-center text-sm">
                                                <span className="flex-1">
                                                    {item.product.name}
                                                    {item.isFixed && (
                                                        <Badge variant="outline" className="text-xs bg-gray-100 text-gray-700 ml-1">
                                                            fixed
                                                        </Badge>
                                                        // <span className="text-xs text-gray-500 ml-1">(fixed)</span>
                                                    )}
                                                </span>
                                                <div className="flex items-center space-x-2">
                                                    {!item.isFixed && (
                                                        <>
                                                            <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                                                            >
                                                                -
                                                            </button>
                                                            {/* <span className="w-8 text-center">{item.quantity}</span> */}
                                                            <span className="w-full text-center">{item.quantity} {item.product.unit}</span>
                                                            {/* <button
                                                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                                className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded text-gray-600 hover:bg-gray-200"
                                                            >
                                                                +
                                                            </button> */}
                                                        </>
                                                    )}
                                                    {item.isFixed && (
                                                        <span className="w-full text-center">{item.quantity} {item.product.unit}</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <div className="flex justify-between items-center text-lg font-bold mb-4">
                                        <span>Total:</span>
                                        <span className="text-fresh-green">Rs. {calculateTotal}</span>
                                    </div>

                                    <Link href={isCartValid ? `/checkout?boxId=${selectedBox.id}` : "#"}
                                        //href={`/checkout?boxId=${selectedBox.id}`}
                                        onClick={(e) => {
                                            if (!isCartValid) {
                                                e.preventDefault(); // Prevent navigation when cart is invalid
                                                return;
                                            }

                                            if (typeof window !== "undefined") {
                                                localStorage.setItem('cartItems', JSON.stringify(cartItems));
                                                //localStorage.setItem('selectedBox', JSON.stringify(selectedBox));
                                            }
                                        }}
                                        aria-disabled={!isCartValid}
                                        tabIndex={!isCartValid ? -1 : undefined}
                                        className={`w-full bg-fresh-green text-white py-3 rounded-xl font-semibold hover:opacity-90 block text-center  transition-colors  ${!isCartValid ? "bg-gray-300 cursor-not-allowed" : ""}`}
                                    >
                                        Proceed to Checkout
                                    </Link>

                                    {/* <Link href={`/checkout?boxId=${boxTypes.length > 0 ? boxTypes[0].id : 1}`}>
                                        <button
                                            disabled={cartItems.length === 0}
                                            onClick={() => {
                                                if (cartItems.length > 0) {
                                                    if (typeof window !== "undefined") {
                                                        localStorage.setItem('cartItems', JSON.stringify(cartItems));
                                                    }
                                                    // Use the first available box type for checkout since this is now a mixed order
                                                    //const boxId = boxTypes.length > 0 ? boxTypes[0].id : 1;
                                                    //window.location.href = `/checkout?boxId=${boxId}`;
                                                }
                                            }
                                            }
                                            className="w-full bg-fresh-green text-white py-3 rounded-xl font-semibold hover:opacity-90 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </Link> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
