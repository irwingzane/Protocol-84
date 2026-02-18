import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/auth-context";
import { ProgressProvider } from "@/lib/context/progress-context";
import { Header } from "@/components/layout/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Protocol84 | Employee Performance Platform",
  description: "Corporate employee performance and resilience platform.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            <Header />
            {children}
          </ProgressProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
