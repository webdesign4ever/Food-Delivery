import React from 'react'
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { MessageCircle, Phone, Mail } from "lucide-react";
import Link from 'next/link';
import SearchBar from './SearchBar';

const FAQ = ({ q }: { q?: string }) => {

    const searchTerm = q || '';

    const faqCategories = [
        {
            title: "Ordering & Products",
            icon: "🛒",
            faqs: [
                {
                    question: "How do I place an order?",
                    answer: "Simply choose your preferred box size (Small, Medium, or Large), customize it with your favorite fruits and vegetables, and proceed to checkout. You can pay securely using Easypaisa or JazzCash."
                },
                {
                    question: "What's included in each box size?",
                    answer: "Small Box: 2-3 items for Rs. 799, Medium Box: 4-6 items for Rs. 1,399, Large Box: 7-10 items for Rs. 1,999. All boxes include only the freshest organic produce."
                },
                {
                    question: "Can I customize my box contents?",
                    answer: "Yes! After selecting your box size, you can choose exactly which fruits and vegetables you want from our available inventory. You can see live preview and pricing as you customize."
                },
                {
                    question: "Are all products organic?",
                    answer: "Yes, we guarantee 100% organic produce. All our partner farms are certified organic and we maintain strict quality standards throughout our supply chain."
                },
                {
                    question: "What if an item is out of stock?",
                    answer: "If an item you selected becomes unavailable, we'll contact you immediately to suggest suitable alternatives or adjust your order accordingly."
                }
            ]
        },
        {
            title: "Delivery & Shipping",
            icon: "🚚",
            faqs: [
                {
                    question: "Which cities do you deliver to?",
                    answer: "We currently deliver to Lahore, Karachi, Islamabad, and Rawalpindi. We're expanding to more cities soon including Faisalabad, Multan, and Peshawar."
                },
                {
                    question: "What are your delivery timings?",
                    answer: "We deliver from 9 AM to 9 PM, 7 days a week. Same-day delivery is available for orders placed before 3 PM."
                },
                {
                    question: "Is delivery free?",
                    answer: "Yes! Free delivery is included with all our box orders. For individual items, free delivery applies to orders above Rs. 1,000."
                },
                {
                    question: "How do you ensure freshness during delivery?",
                    answer: "We use cold-chain delivery vehicles and insulated packaging to maintain optimal temperature. All produce is delivered within 24 hours of harvest."
                },
                {
                    question: "Can I schedule delivery for a specific time?",
                    answer: "Yes, you can choose your preferred delivery time slot during checkout. We offer 2-hour delivery windows for your convenience."
                }
            ]
        },
        {
            title: "Payment & Pricing",
            icon: "💳",
            faqs: [
                {
                    question: "What payment methods do you accept?",
                    answer: "We accept Easypaisa and JazzCash for secure digital payments. Cash on Delivery (COD) is not available as we focus on contactless transactions."
                },
                {
                    question: "Are there any hidden charges?",
                    answer: "No hidden charges! The price you see during checkout is the final price, including delivery. No extra fees or surcharges."
                },
                {
                    question: "How do I get a receipt for my payment?",
                    answer: "You'll receive a payment confirmation immediately after successful transaction via SMS and email, along with your order details and tracking information."
                },
                {
                    question: "Is my payment information secure?",
                    answer: "Absolutely! We use bank-grade encryption and work directly with Easypaisa and JazzCash's secure payment gateways. We never store your payment information."
                },
                {
                    question: "Can I get a refund if I'm not satisfied?",
                    answer: "Yes, we offer a 100% satisfaction guarantee. If you're not happy with your order, contact us within 24 hours for a full refund or replacement."
                }
            ]
        },
        {
            title: "Account & Support",
            icon: "👤",
            faqs: [
                {
                    question: "Do I need to create an account to order?",
                    answer: "No account creation required! Simply provide your delivery details during checkout. However, creating an account helps track your orders and preferences."
                },
                {
                    question: "How can I track my order?",
                    answer: "You'll receive SMS and email updates with order status. You can also call our support team at +92 300 1234567 for real-time tracking information."
                },
                {
                    question: "What if I need to change or cancel my order?",
                    answer: "You can modify or cancel your order within 1 hour of placing it by calling our support team. After that, orders enter preparation and cannot be changed."
                },
                {
                    question: "How do I contact customer support?",
                    answer: "Multiple ways: WhatsApp +92 300 1234567, Email support@freshbox.pk, Phone +92 300 1234567 (9 AM - 9 PM), or use our live chat feature."
                },
                {
                    question: "Do you have a mobile app?",
                    answer: "Currently, we operate through our responsive website that works perfectly on mobile devices. A dedicated mobile app is planned for 2024."
                }
            ]
        }
    ];

    const filteredFaqs = faqCategories.map(category => ({
        ...category,
        faqs: category.faqs.filter(faq =>
            faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
        )
    })).filter(category => category.faqs.length > 0);

    return (
        <div className="min-h-screen py-8 bg-light-green-tint">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-dark-text mb-4">Frequently Asked Questions</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Find answers to common questions about ordering, delivery, payments, and more.
                    </p>
                </div>

                {/* Search */}
                <Card className="mb-8">
                    <CardContent className="p-6">
                        <SearchBar />
                        {/* <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <Input
                                type="text"
                                placeholder="Search frequently asked questions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 rounded-xl border-gray-200 focus:border-fresh-green focus:ring-2 focus:ring-[hsla(103,38%,57%,0.2)]"
                            />
                        </div> */}
                    </CardContent>
                </Card>

                {/* FAQ Categories */}
                <div className="space-y-8">
                    {(searchTerm ? filteredFaqs : faqCategories).map((category, categoryIndex) => (
                        <Card key={categoryIndex} className="overflow-hidden">
                            <CardContent className="p-0">
                                <div className="bg-gradient-to-r from-fresh-green to-sunny-yellow p-6 text-white">
                                    <div className="flex items-center space-x-3">
                                        <span className="text-2xl">{category.icon}</span>
                                        <h2 className="text-2xl font-bold">{category.title}</h2>
                                    </div>
                                </div>

                                <div className="p-6">
                                    <Accordion type="multiple" defaultValue={category.faqs.map((_, i) => i.toString())}>
                                        {category.faqs.map((faq, faqIndex) => (
                                            <AccordionItem key={faqIndex} value={faqIndex.toString()}>
                                                <AccordionTrigger className="text-left hover:text-fresh-green">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div>
                                {/* <div className="p-6">
                                    <Accordion type="single" collapsible className="w-full">
                                        {category.faqs.map((faq, faqIndex) => (
                                            <AccordionItem key={faqIndex} value={`${categoryIndex}-${faqIndex}`}>
                                                <AccordionTrigger className="text-left hover:text-fresh-green">
                                                    {faq.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-gray-600 leading-relaxed">
                                                    {faq.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </div> */}
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* No Results */}
                {searchTerm && filteredFaqs.length === 0 && (
                    <Card className="text-center">
                        <CardContent className="p-12">
                            <div className="text-6xl mb-4">🤔</div>
                            <h3 className="text-xl font-semibold text-dark-text mb-2">No results found</h3>
                            <p className="text-gray-600 mb-6">
                                We couldn&#39;t find any FAQs matching your search. Try different keywords or contact our support team.
                            </p>

                            {/* <Link href="?" scroll={false} className="bg-fresh-green text-white hover:bg-[hsla(103,38%,57%,0.9)]">
                                <Button className="bg-fresh-green text-white hover:bg-[hsla(103,38%,57%,0.9)]">
                                    Clear Search
                                </Button>
                            </Link> */}
                        </CardContent>
                    </Card>
                )}

                {/* Contact Support */}
                <Card className="mt-12 bg-gradient-to-br from-fresh-green to-[hsla(103,38%,57%,0.8)] text-white">
                    <CardContent className="p-8 text-center">
                        <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                        <p className="text-white/90 mb-6">
                            Our friendly customer support team is here to help you with any questions or concerns.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <Link href="/contact">
                                <Button className="w-full bg-white text-fresh-green hover:bg-gray-100">
                                    <MessageCircle className="mr-2 w-5 h-5" />
                                    Live Chat
                                </Button>
                            </Link>

                            <a href="tel:+923001234567">
                                <Button className="w-full bg-white text-fresh-green hover:bg-gray-100">
                                    <Phone className="mr-2 w-5 h-5" />
                                    Call Support
                                </Button>
                            </a>

                            <a href="mailto:support@freshbox.pk">
                                <Button className="w-full bg-white text-fresh-green hover:bg-gray-100">
                                    <Mail className="mr-2 w-5 h-5" />
                                    Email Us
                                </Button>
                            </a>
                        </div>

                        <p className="text-white/80 text-sm mt-4">
                            Available 9 AM - 9 PM, 7 days a week • Response within 2 hours
                        </p>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="text-center mt-8">
                    <p className="text-gray-600 mb-4">Ready to place your order?</p>
                    <Link href="/products">
                        <Button size="lg" className="bg-fresh-green text-white hover:opacity-90">
                            Start Shopping
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default FAQ