import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Heart, Truck, Shield, Users, Award } from "lucide-react";
import Image from 'next/image';

const About = () => {
    const values = [
        {
            icon: <Leaf className="text-white w-8 h-8" />,
            title: "100% Organic",
            description: "We source only the finest organic produce from certified farms, ensuring no harmful chemicals reach your table.",
            bgColor: "bg-fresh-green"
        },
        {
            icon: <Heart className="text-white w-8 h-8" />,
            title: "Health First",
            description: "Your family's health is our priority. Every item is carefully selected for maximum nutritional value.",
            bgColor: "bg-sunny-yellow"
        },
        {
            icon: <Truck className="text-white w-8 h-8" />,
            title: "Fresh Delivery",
            description: "From farm to your doorstep within 24 hours. Our cold-chain delivery ensures peak freshness.",
            bgColor: "bg-fresh-green"
        },
        {
            icon: <Shield className="text-white w-8 h-8" />,
            title: "Quality Assured",
            description: "Rigorous quality checks at every step. We guarantee satisfaction or your money back.",
            bgColor: "bg-sunny-yellow"
        }
    ];

    const stats = [
        { number: "2,500+", label: "Happy Customers" },
        { number: "15,000+", label: "Fresh Deliveries" },
        { number: "12", label: "Cities Covered" },
        { number: "100+", label: "Organic Products" }
    ];

    const team = [
        {
            name: "Ahmad Hassan",
            role: "Founder & CEO",
            description: "Passionate about bringing fresh, organic produce to Pakistani families.",
            emoji: "👨‍💼"
        },
        {
            name: "Fatima Khan",
            role: "Head of Operations",
            description: "Ensures smooth operations and quality control across all deliveries.",
            emoji: "👩‍💼"
        },
        {
            name: "Usman Ali",
            role: "Sourcing Manager",
            description: "Works directly with farmers to source the best organic produce.",
            emoji: "🧑‍🌾"
        }
    ];
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="py-20 bg-gradient-to-br from-light-green-tint to-light-yellow-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold text-dark-text mb-6">
                            About <span className="text-fresh-green">FreshBox</span>
                        </h1>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                            We&#39;re on a mission to make fresh, organic produce accessible to every Pakistani family.
                            Started in 2023, FreshBox connects you directly with local organic farmers, ensuring
                            the highest quality fruits and vegetables reach your table.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="text-3xl font-bold text-fresh-green mb-2">{stat.number}</div>
                                    <div className="text-gray-600">{stat.label}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-dark-text mb-6">Our Mission</h2>
                            <p className="text-gray-600 text-lg leading-relaxed mb-6">
                                To revolutionize how Pakistani families access fresh, organic produce by creating
                                a transparent, sustainable, and convenient supply chain that benefits both consumers
                                and local farmers.
                            </p>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                We believe everyone deserves access to nutritious, chemical-free food that supports
                                both personal health and environmental sustainability.
                            </p>
                        </div>
                        <div className="relative">
                            <Image
                                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                                alt="Organic farming"
                                width={800}
                                height={600}
                                className="rounded-2xl shadow-xl w-full"
                            />
                            <div className="absolute -bottom-6 -right-6 bg-fresh-green p-4 rounded-2xl text-white">
                                <div className="text-center">
                                    <Award className="w-8 h-8 mx-auto mb-2" />
                                    <div className="font-bold">Certified</div>
                                    <div className="text-sm">Organic</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-dark-text mb-4">Our Values</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            These core values guide everything we do, from sourcing to delivery.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className={`w-16 h-16 ${value.bgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                                        {value.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-dark-text mb-3">{value.title}</h3>
                                    <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-dark-text mb-4">Meet Our Team</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            The passionate people behind FreshBox, working to bring you the best organic produce.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {team.map((member, index) => (
                            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                                <CardContent className="p-8">
                                    <div className="text-6xl mb-4">{member.emoji}</div>
                                    <h3 className="text-xl font-bold text-dark-text mb-2">{member.name}</h3>
                                    <p className="text-fresh-green font-semibold mb-3">{member.role}</p>
                                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Delivery Areas */}
            <section className="py-20 bg-light-green-tint">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-dark-text mb-4">Service Areas</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Currently serving major cities across Pakistan, with plans to expand nationwide.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { city: "Lahore", status: "Active", emoji: "🏙️" },
                            { city: "Karachi", status: "Active", emoji: "🌊" },
                            { city: "Islamabad", status: "Active", emoji: "🏛️" },
                            { city: "Rawalpindi", status: "Active", emoji: "🏘️" },
                            { city: "Faisalabad", status: "Coming Soon", emoji: "🌾" },
                            { city: "Multan", status: "Coming Soon", emoji: "🕌" },
                            { city: "Peshawar", status: "Coming Soon", emoji: "🏔️" },
                            { city: "Quetta", status: "Coming Soon", emoji: "⛰️" }
                        ].map((area, index) => (
                            <Card key={index} className="text-center">
                                <CardContent className="p-6">
                                    <div className="text-3xl mb-3">{area.emoji}</div>
                                    <h3 className="font-bold text-dark-text mb-2">{area.city}</h3>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${area.status === "Active"
                                        ? "bg-[hsla(103,38%,57%,0.2)] text-fresh-green"
                                        : "bg-[hsla(46,84%,64%,0.2)] text-sunny-yellow"
                                        }`}>
                                        {area.status}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sustainability */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div className="relative">
                            <Image
                                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                                alt="Sustainable farming"
                                width={800}
                                height={600}
                                className="rounded-2xl shadow-xl w-full"
                            />
                            <div className="absolute -top-6 -left-6 bg-sunny-yellow p-4 rounded-2xl text-white">
                                <div className="text-center">
                                    <Users className="w-8 h-8 mx-auto mb-2" />
                                    <div className="font-bold">50+</div>
                                    <div className="text-sm">Partner Farms</div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-dark-text mb-6">Sustainability & Impact</h2>
                            <div className="space-y-4">
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-fresh-green rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        <strong>Supporting Local Farmers:</strong> We work directly with over 50 organic farms, ensuring fair prices and sustainable practices.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-fresh-green rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        <strong>Eco-Friendly Packaging:</strong> Biodegradable and recyclable packaging materials to minimize environmental impact.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-fresh-green rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        <strong>Reduced Food Waste:</strong> Our demand-based model helps reduce food waste at farm level.
                                    </p>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <div className="w-2 h-2 bg-fresh-green rounded-full mt-2"></div>
                                    <p className="text-gray-600">
                                        <strong>Community Impact:</strong> Creating employment opportunities in rural areas and promoting organic farming.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default About