"use client";
import { useState, useEffect } from "react";
//import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    //const [location] = useLocation();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const navigation = [
        { name: "Home", href: "/" },
        { name: "Products", href: "/products" },
        { name: "How It Works", href: "/how-it-works" },
        { name: "Services", href: "/services" },
        { name: "Contact", href: "/contact" },
        { name: "About", href: "/about" },
        { name: "FAQ", href: "/faq" },
    ];

    const NavLink = ({ href, children, mobile = false }: { href: string; children: React.ReactNode; mobile?: boolean }) => {
        const isActive = pathname === href;
        const baseClasses = mobile
            ? "block px-3 py-2 text-base font-medium hover:text-fresh-green transition-colors"
            : "hover:text-fresh-green transition-colors";
        const activeClasses = isActive ? "text-fresh-green" : "text-dark-text";

        return (
            <Link href={href} className={`${baseClasses} ${activeClasses}`} onClick={() => mobile && setIsOpen(false)}>
                {/* <a className={`${baseClasses} ${activeClasses}`} onClick={() => mobile && setIsOpen(false)}> */}
                {children}
                {/* </a> */}
            </Link>
        );
    };

    useEffect(() => {
        const media = window.matchMedia("(min-width: 1024px)");
        const handler = () => {
            if (media.matches) setIsOpen(false);
        };
        media.addEventListener("change", handler);
        return () => media.removeEventListener("change", handler);
    }, []);

    return (
        <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        {/* <a className="flex items-center space-x-2"> */}
                        <div className="w-10 h-10 gradient-green-yellow rounded-lg flex items-center justify-center">
                            <Leaf className="text-white text-xl" />
                        </div>
                        <span className="text-2xl font-bold text-fresh-green">FreshBox</span>
                        {/* </a> */}
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden lg:flex items-center space-x-8">
                        {navigation.map((item) => (
                            <NavLink key={item.name} href={item.href}>
                                {item.name}
                            </NavLink>
                        ))}
                        <Link href="/products">
                            <Button className="bg-fresh-green text-white hover:opacity-90">
                                Order Now
                            </Button>
                        </Link>
                    </div>

                    {/* Mobile menu button */}
                    <div className="lg:hidden">
                        <Sheet open={isOpen} onOpenChange={setIsOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon">
                                    <Menu className="h-6 w-6" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <SheetHeader className="hidden">
                                    <SheetTitle className=" flex items-center space-x-2">
                                        <div className="w-10 h-10 gradient-green-yellow rounded-lg flex items-center justify-center">
                                            <Leaf className="text-white text-xl" />
                                        </div>
                                        <span className="text-2xl font-bold text-fresh-green">FreshBox</span>
                                    </SheetTitle>
                                    <SheetDescription>
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="flex flex-col space-y-4 mt-6">
                                    {navigation.map((item) => (
                                        <NavLink key={item.name} href={item.href} mobile>
                                            {item.name}
                                        </NavLink>
                                    ))}
                                    <Link href="/products">
                                        <Button className="w-full bg-fresh-green text-white hover:opacity-90" onClick={() => setIsOpen(false)}>
                                            Order Now
                                        </Button>
                                    </Link>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav >
    );
}
