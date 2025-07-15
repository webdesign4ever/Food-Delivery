import React from 'react'
import { Card, CardContent } from '../ui/card'
import { Leaf, Apple, Box, Truck, Clock, Headset, Star, DollarSign, TrendingUp, } from "lucide-react";
import Link from 'next/link';
import { Button } from '../ui/button';

const Services = () => {
    const deliver = [
        {
            icon: <Leaf className="text-white w-8 h-8" />,
            description: "Fresh vegetables — handpicked, washed, and ready.",
            bgColor: "bg-fresh-green"
        },
        {
            icon: <Apple className="text-white w-8 h-8" />,
            description: "Seasonal fruits — sourced daily for peak flavor.",
            bgColor: "bg-sunny-yellow"
        },
        {
            icon: <Box className="text-white w-8 h-8" />,
            description: "Custom produce boxes — tailored to your menu needs.",
            bgColor: "bg-fresh-green"
        }
    ];

    const service = [
        {
            icon: <Truck className="text-white w-8 h-8" />,
            description: "Bulk order fulfillment with flexible delivery schedules.",
            bgColor: "bg-fresh-green"
        },
        {
            icon: <Clock className="text-white w-8 h-8" />,
            description: "Reliable, on-time delivery — every single day.",
            bgColor: "bg-sunny-yellow"
        },
        {
            icon: <Headset className="text-white w-8 h-8" />,
            description: "Dedicated account support for smooth coordination.",
            bgColor: "bg-fresh-green"
        }
    ];

    const chooseUs = [
        {
            icon: <Star className="text-white w-8 h-8" />,
            description: "Trusted by top kitchens and culinary professionals.",
            bgColor: "bg-fresh-green"
        },
        {
            icon: <DollarSign className="text-white w-8 h-8" />,
            description: "Competitive pricing with no compromise on quality.",
            bgColor: "bg-sunny-yellow"
        },
        {
            icon: <TrendingUp className="text-white w-8 h-8" />,
            description: "Scalable solutions tailored to your kitchen's growth.",
            bgColor: "bg-fresh-green"
        }
    ]

    return (
        <div className="min-h-screen pb-8">
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-dark-text mb-4">Restaurant Supply & Delivery Service</h1>
                        <h2 className="text-2xl sm:text-3xl font-medium text-fresh-green mb-6">
                            Fueling Kitchens. Feeding Excellence.
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            At FreshBox, we understand what it takes to keep a restaurant running smoothly, and it starts with consistent, high-quality ingredients. That&#39;s why we offer a dedicated delivery service tailored exclusively for restaurants, hotels, and commercial kitchens.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">What We Deliver</h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            We specialize in bulk delivery of:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {deliver.map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        {value.icon}
                                    </div>
                                    <p className="text-gray-700 text-base leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">Built for Restaurants</h2>
                        <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
                            Our service is designed with chefs and kitchen managers in mind:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {service.map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        {value.icon}
                                    </div>
                                    <p className="text-gray-700 text-base leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-dark-text mb-4">Why Restaurants Choose Us</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {chooseUs.map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        {value.icon}
                                    </div>
                                    <p className="text-gray-700 text-base leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <div className="text-center mt-8">
                <p className="text-gray-600 mb-4">Let&#39;s talk supply</p>
                <Link href="/products">
                    <Button size="lg" className="bg-fresh-green text-white hover:opacity-90">
                        Order Now
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default Services