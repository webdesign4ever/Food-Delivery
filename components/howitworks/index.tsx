import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
//import { Link } from "wouter";
import { ShoppingBasket, Settings, CreditCard, Smartphone, Wallet, CheckCircle } from "lucide-react";
import Link from 'next/link';

const HowItWorks = () => {
    const steps = [
        {
            number: 1,
            icon: <ShoppingBasket className="text-white text-3xl" />,
            title: "Choose Your Box",
            description: "Select from Small, Medium, or Large boxes based on your family size and preferences. Each box is designed to meet different needs.",
            bgColor: "bg-fresh-green",
            accentColor: "bg-sunny-yellow"
        },
        {
            number: 2,
            icon: <Settings className="text-white text-3xl" />,
            title: "Customize Items",
            description: "Personalize your box by selecting your favorite fruits and vegetables from our fresh daily inventory. See live preview and pricing.",
            bgColor: "bg-sunny-yellow",
            accentColor: "bg-fresh-green"
        },
        {
            number: 3,
            icon: <CreditCard className="text-white text-3xl" />,
            title: "Pay & Enjoy",
            description: "Complete your payment securely using Easypaisa or JazzCash. Track your order and enjoy fresh produce delivered to your door.",
            bgColor: "bg-fresh-green",
            accentColor: "bg-sunny-yellow"
        }
    ];

    const paymentMethods = [
        {
            name: "Easypaisa",
            icon: <Smartphone className="text-white text-xl" />,
            bgColor: "bg-fresh-green",
            borderColor: "border-[hsla(103,38%,57%,0.2)]",
            hoverBorder: "hover:border-[hsla(103,38%,57%,0.4)]",
            checkColor: "text-fresh-green",
            features: ["Instant confirmation", "No extra charges"]
        },
        {
            name: "JazzCash",
            icon: <Wallet className="text-white text-xl" />,
            bgColor: "bg-sunny-yellow",
            borderColor: "border-[hsla(46,84%,64%,0.2)]",
            hoverBorder: "hover:border-[hsla(46,84%,64%,0.4)]",
            checkColor: "text-sunny-yellow",
            features: ["Fast processing", "Bank-grade security"]
        }
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-4xl font-bold text-dark-text mb-4">How It Works</h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Getting fresh, organic produce delivered to your door is as easy as 1-2-3. Here`&#39;`s how our simple process works.
                        </p>
                    </div>

                    {/* Steps */}
                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {steps.map((step, index) => (
                            <div key={step.number} className="text-center">
                                <div className="relative mb-8">
                                    <div className={`w-24 h-24 ${step.bgColor} rounded-full flex items-center justify-center mx-auto relative z-10`}>
                                        {step.icon}
                                    </div>
                                    <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 w-16 h-16 ${step.bgColor}/20 rounded-full`}></div>
                                    <div className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-8 ${step.accentColor} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                                        {step.number}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-bold text-dark-text mb-4">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="text-center">
                        <Link href="/products">
                            <Button size="lg" className="bg-fresh-green text-white hover:opacity-90 text-lg px-8 py-4">
                                Start Your Order
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Payment Methods */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Card className="shadow-lg">
                        <CardContent className="p-8">
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-dark-text mb-4">Secure Payment Options</h2>
                                <p className="text-gray-600">We support Pakistan`&#39;`s most trusted digital payment methods for your convenience.</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {paymentMethods.map((method) => (
                                    <div
                                        key={method.name}
                                        className={`border-2 ${method.borderColor} rounded-2xl p-6 ${method.hoverBorder} transition-all`}
                                    >
                                        <div className="flex items-center space-x-4 mb-4">
                                            <div className={`w-12 h-12 ${method.bgColor} rounded-xl flex items-center justify-center`}>
                                                {method.icon}
                                            </div>
                                            <div>
                                                <h4 className="text-xl font-semibold text-dark-text">{method.name}</h4>
                                                <p className="text-gray-600">
                                                    {method.name === "Easypaisa" ? "Quick & secure mobile payments" : "Trusted digital wallet payments"}
                                                </p>
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {method.features.map((feature, index) => (
                                                <li key={index} className="flex items-center text-gray-700">
                                                    <CheckCircle className={`${method.checkColor} mr-2 w-4 h-4`} />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Process Benefits */}
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-dark-text mb-4">Why Choose Our Process?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our streamlined ordering system ensures you get the freshest produce with maximum convenience.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Quality Guaranteed",
                                description: "100% organic, farm-fresh produce",
                                emoji: "🌱"
                            },
                            {
                                title: "Same Day Delivery",
                                description: "Order before 3 PM for same-day delivery",
                                emoji: "🚚"
                            },
                            {
                                title: "Flexible Customization",
                                description: "Choose exactly what you want",
                                emoji: "🎯"
                            },
                            {
                                title: "Secure Payments",
                                description: "Safe and encrypted transactions",
                                emoji: "🔒"
                            }
                        ].map((benefit, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="text-4xl mb-4">{benefit.emoji}</div>
                                    <h3 className="text-lg font-semibold text-dark-text mb-2">{benefit.title}</h3>
                                    <p className="text-gray-600 text-sm">{benefit.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default HowItWorks