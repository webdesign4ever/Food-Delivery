"use client";

import React from "react";
import { Toaster } from "../ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export default function ClientProvider({ children, }: { children: React.ReactNode; }) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                {children}
                <Toaster />
            </QueryClientProvider>
        </>
    );
}
