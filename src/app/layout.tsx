"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ModalProvider } from "@/app/components/modal/modal";
import { ToastProvider } from "@/app/components/toastbar/toastbar";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <ModalProvider>{children}</ModalProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
