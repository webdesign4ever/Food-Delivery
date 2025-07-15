"use client";

import React from "react";
import { Toaster } from "../ui/toaster";

export default function ClientProvider({ children, }: { children: React.ReactNode; }) {
    return (
        <>
            {children}
            <Toaster />
        </>
    );
}
