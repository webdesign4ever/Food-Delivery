//import { Link } from "wouter";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "How It Works", href: "/how-it-works" },
    { name: "Services", href: "/services" },
    { name: "Contact Us", href: "/contact" },
    { name: "About Us", href: "/about" },
    { name: "FAQ", href: "/faq" },
  ];

  const customerCare = [
    { name: "Order Tracking", href: "#" },
    { name: "Return Policy", href: "#" },
    { name: "Delivery Info", href: "#" },
    { name: "Payment Help", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Privacy Policy", href: "#" },
  ];

  return (
    <footer className="bg-dark-text text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8 mb-12">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              {/* <div className="w-10 h-10 gradient-green-yellow rounded-lg flex items-center justify-center">
                <Leaf className="text-white text-xl" />
              </div>
              <span className="text-2xl font-bold text-white">FreshBox</span> */}
              <Image
                className="lg:w-56 xl:w-64"
                src="/images/logo/logo.svg"
                width={260}
                height={66}
                alt="logo"
              />
            </div>
            <p className="text-gray-300 leading-relaxed">
              Delivering farm-fresh fruits and vegetables to your doorstep with premium quality guarantee and sustainable farming practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-fresh-green rounded-lg flex items-center justify-center hover:opacity-80 transition-all">
                <Facebook className="text-white w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-fresh-green rounded-lg flex items-center justify-center hover:opacity-80 transition-all">
                <Instagram className="text-white w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-fresh-green rounded-lg flex items-center justify-center hover:opacity-80 transition-all">
                <FaWhatsapp className="text-white text-xl" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {/* <a className="text-gray-300 hover:text-white transition-colors"> */}
                    {item.name}
                    {/* </a> */}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Customer Care</h4>
            <ul className="space-y-3">
              {customerCare.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-gray-300 hover:text-white transition-colors">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="text-fresh-green mt-1 w-5 h-5" />
                <div>
                  <p className="text-gray-300">+92 300 1234567</p>
                  <p className="text-gray-400 text-sm">9 AM - 9 PM</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="text-fresh-green mt-1 w-5 h-5" />
                <p className="text-gray-300">support@freshbox.pk</p>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="text-fresh-green mt-1 w-5 h-5" />
                <p className="text-gray-300">
                  Lahore, Karachi, Islamabad<br />
                  Rawalpindi & more cities
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-600 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center">
            <p className="text-gray-300 mb-4 lg:mb-0">
              © 2024 FreshBox. All rights reserved. Made with 🌱 for fresh living.
            </p>
            <div className="flex items-center space-x-6">
              <span className="text-gray-400">Secure payments with:</span>
              <div className="flex items-center space-x-3">
                <div className="bg-fresh-green px-3 py-1 rounded text-white text-sm font-medium">Easypaisa</div>
                <div className="bg-sunny-yellow px-3 py-1 rounded text-white text-sm font-medium">JazzCash</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
