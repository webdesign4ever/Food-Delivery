//import type { Metadata } from "next";
//import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
//import Navbar from "@/components/layout/navbar";
//import Footer from "@/components/layout/footer";
import ClientProvider from "@/components/shared/ClientProvider";

// const geistSans = Geist({
//     variable: "--font-geist-sans",
//     subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//     variable: "--font-geist-mono",
//     subsets: ["latin"],
// });

// export const metadata: Metadata = {
//     title: "FreshBox - Premium Fresh Fruits & Vegetables Delivery Pakistan",
//     description: "Order fresh organic fruits and vegetables online in Pakistan. Customizable boxes with same-day delivery. Payment via Easypaisa & JazzCash. Serving Lahore, Karachi, Islamabad & Rawalpindi",
// };

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
            <body className={`min-h-screen flex flex-col`
                // ${geistSans.variable} ${geistMono.variable} antialiased
            }>
                <ClientProvider>
                    {/* <Navbar /> */}
                    <main className="flex-1">
                        {children}
                    </main>
                    {/* <Footer /> */}
                </ClientProvider>
            </body>
        </html>
    );
}
