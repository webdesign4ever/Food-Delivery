import React from 'react'
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Truck, Award, Users, Package, Leaf, Apple, ShoppingCart, Play } from "lucide-react";
import type { BoxType, OrderStats } from "@/lib/types";

const Home = () => {
    // const { data: boxTypes = [] } = useQuery<BoxType[]>({
    //   queryKey: ["/api/box-types"],
    // });

    // const { data: stats } = useQuery<OrderStats>({
    //   queryKey: ["/api/stats"],
    // });

    const features = [
        {
            icon: <Truck className="w-6 h-6" />,
            title: "Free Delivery",
            description: "Orders above Rs. 1000"
        },
        {
            icon: <Award className="w-6 h-6" />,
            title: "100% Organic",
            description: "Quality guarantee"
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: "Happy Customers",
            //description: stats ? `${stats.totalCustomers}+` : "2,500+"
        },
        {
            icon: <Package className="w-6 h-6" />,
            title: "Fresh Deliveries",
            //description: stats ? `${stats.totalOrders}+` : "15,000+"
        }
    ];
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-screen bg-gradient-to-br from-light-green-tint to-light-yellow-tint">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')] bg-cover bg-center opacity-10"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-8">
                            <div className="space-y-6">
                                {/* <h1 className="text-5xl lg:text-6xl font-bold leading-tight"> */}
                                <h1 className="text-5xl leading-tight font-bold lg:text-6xl lg:leading-tight">
                                    <span className="text-fresh-green">Fresh</span>
                                    <span className="text-sunny-yellow"> & </span>
                                    <span className="text-fresh-green">Organic</span>
                                    <br />
                                    <span className="text-dark-text">Delivered Daily</span>
                                </h1>
                                <p className="text-xl text-gray-600 leading-relaxed">
                                    Premium quality fruits and vegetables delivered fresh to your doorstep.
                                    Customize your perfect box and pay seamlessly with Easypaisa or JazzCash.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link href="/products">
                                    <Button size="lg" className="bg-fresh-green text-white hover:opacity-90 text-lg px-8 py-4">
                                        <ShoppingCart className="mr-2 w-5 h-5" />
                                        Order Your Box
                                    </Button>
                                </Link>
                                <Link href="/how-it-works">
                                    <Button variant="outline" size="lg" className="border-2 border-fresh-green text-fresh-green hover:bg-fresh-green hover:text-white text-lg px-8 py-4">
                                        <Play className="mr-2 w-5 h-5" />
                                        How It Works
                                    </Button>
                                </Link>
                            </div>

                            <div className="grid grid-cols-2 gap-6 pt-8">
                                {features.map((feature, index) => (
                                    <div key={index} className="text-center">
                                        <div className="text-3xl font-bold text-fresh-green mb-1">{feature.description}</div>
                                        <div className="text-gray-600 text-sm">{feature.title}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <Image
                                src="https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                                width={800}
                                height={600}
                                alt="Fresh fruits and vegetables in basket"
                                className="rounded-3xl shadow-2xl w-full"
                            />

                            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                                <div className="flex items-center space-x-4">
                                    <div className="w-12 h-12 bg-fresh-green rounded-full flex items-center justify-center">
                                        <Truck className="text-white w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="font-semibold text-dark-text">Free Delivery</div>
                                        <div className="text-sm text-gray-600">Orders above Rs. 1000</div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-6 -right-6 bg-sunny-yellow p-4 rounded-2xl shadow-xl">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-white">100%</div>
                                    <div className="text-sm text-white font-medium">Organic</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Boxes Preview */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-dark-text mb-4">Choose Your Perfect Box</h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Select from our carefully curated boxes, customize with your favorite items.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8 mb-12">
                        {/* {boxTypes.map((box, index) => (
              <Card key={box.id} className={`relative overflow-hidden hover:shadow-xl transition-all group ${index === 1 ? 'border-2 border-sunny-yellow bg-light-yellow-tint' : 'bg-light-green-tint'
                }`}>
                {index === 1 && (
                  <div className="absolute top-4 right-4 bg-sunny-yellow text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <CardContent className="p-8">
                  <div className={`w-16 h-16 ${index === 1 ? 'bg-sunny-yellow' : 'bg-fresh-green'} rounded-2xl flex items-center justify-center mb-6`}>
                    {index === 0 && <Leaf className="text-white w-8 h-8" />}
                    {index === 1 && <Apple className="text-white w-8 h-8" />}
                    {index === 2 && <Package className="text-white w-8 h-8" />}
                  </div>

                  <h3 className="text-2xl font-bold text-dark-text mb-2">{box.name}</h3>
                  <p className="text-gray-600 mb-6">{box.description}</p>

                  <div className="flex items-baseline mb-6">
                    <span className={`text-4xl font-bold ${index === 1 ? 'text-sunny-yellow' : 'text-fresh-green'}`}>
                      Rs. {box.price}
                    </span>
                    <span className="text-gray-500 ml-2">/box</span>
                  </div>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center text-gray-700">
                      <div className={`w-2 h-2 ${index === 1 ? 'bg-sunny-yellow' : 'bg-fresh-green'} rounded-full mr-3`}></div>
                      <span>Fill with unlimited items</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className={`w-2 h-2 ${index === 1 ? 'bg-sunny-yellow' : 'bg-fresh-green'} rounded-full mr-3`}></div>
                      <span>Free delivery included</span>
                    </li>
                    <li className="flex items-center text-gray-700">
                      <div className={`w-2 h-2 ${index === 1 ? 'bg-sunny-yellow' : 'bg-fresh-green'} rounded-full mr-3`}></div>
                      <span>100% organic guarantee</span>
                    </li>
                  </ul>

                  <Link href={`/products?boxId=${box.id}`}>
                    <Button className={`w-full ${index === 1
                      ? 'bg-sunny-yellow hover:opacity-90'
                      : 'bg-fresh-green hover:opacity-90'
                      } text-white`}>
                      Customize Box
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))} */}
                    </div>

                    <div className="text-center">
                        <Link href="/products">
                            <Button size="lg" className="bg-fresh-green text-white hover:opacity-90"
                            // hover:bg-fresh-green/90  
                            >
                                View All Products
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Product Categories */}
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-fresh-green to-[hsla(103,38%,57%,0.8)] rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540420773420-3366772f4999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600')] bg-cover bg-center"
                            // opacity-20
                            ></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Leaf className="text-white w-8 h-8" />
                                </div>

                                <h3 className="text-3xl font-bold mb-4">Fresh Vegetables</h3>
                                <p className="text-white/90 mb-6">Farm-fresh vegetables picked at peak ripeness and delivered within 24 hours of harvest.</p>

                                <Link href="/products?category=vegetable">
                                    <Button className="bg-white text-fresh-green hover:shadow-lg">
                                        Explore Vegetables
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-sunny-yellow to-[hsla(46,84%,64%,0.8)] rounded-3xl p-8 text-white relative overflow-hidden">
                            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1619566636858-adf3ef46400b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600')] bg-cover bg-center"
                            // opacity-20
                            ></div>

                            <div className="relative z-10">
                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                                    <Apple className="text-white w-8 h-8" />
                                </div>

                                <h3 className="text-3xl font-bold mb-4">Premium Fruits</h3>
                                <p className="text-white/90 mb-6">Hand-selected seasonal fruits bursting with natural sweetness and essential nutrients.</p>

                                <Link href="/products?category=fruit">
                                    <Button className="bg-white text-sunny-yellow hover:shadow-lg">
                                        Explore Fruits
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Home