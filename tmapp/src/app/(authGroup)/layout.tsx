import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/components/auth-context";
import { QueryProvider } from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import { Inter, Barlow_Semi_Condensed } from "next/font/google";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
    title: "Task Manager App",
    description: "A task manager app built with Next.js and MongoDB.",
};

const fontInter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const fontBarlowCondensed = Barlow_Semi_Condensed({
    subsets: ["latin"],
    variable: "--font-barlow-condensed",
    weight: "600",
});

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={cn(fontInter.variable, fontBarlowCondensed.variable)}>
                <AuthProvider>
                    <QueryProvider>
                        {children}
                        <Toaster richColors />
                        {children}
                        <Toaster richColors />
                    </QueryProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
