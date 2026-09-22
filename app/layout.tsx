import { Toaster } from "react-hot-toast";
import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";

import { WorkspaceProvider } from "@/context/WorkspaceContext";

import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Flowdesk — Role-Based Project Management",
  description:
    "Lightweight, role-based project management platform with feature-based architecture and mobile-first responsive design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jakartaSans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const stored = localStorage.getItem('flowdesk-theme');
                if (stored === 'dark' || (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen w-full bg-slate-50 text-slate-900 dark:bg-[#090d16] dark:text-slate-100 selection:bg-indigo-500/20 selection:text-indigo-600 font-sans">
        <WorkspaceProvider>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#1e293b",
                color: "#f8fafc",
                fontSize: "13px",
                borderRadius: "12px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
              },
              success: {
                iconTheme: {
                  primary: "#10b981",
                  secondary: "#ffffff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#f43f5e",
                  secondary: "#ffffff",
                },
              },
            }}
          />
          {children}
        </WorkspaceProvider>
      </body>
    </html>
  );
}
