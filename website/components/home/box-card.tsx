import React from 'react'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Package, Leaf, Apple, } from "lucide-react";
import Link from 'next/link';
import { BagForm } from '@/lib/types';

interface BoxCardProps {
    box: BagForm
    index: number
}

export const BoxCard = ({ box, index }: BoxCardProps) => {
    return (
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
                    <span className="text-gray-500 ml-2">/bag</span>
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
    )
}
