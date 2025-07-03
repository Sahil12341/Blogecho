// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import SupabaseProvider from "@/components/providers/supabase-provider";
import { AuthProvider } from "@/hooks/use-auth";

export const metadata: Metadata = {
  title: "ECHO",
  description: "A Content-Publishing Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className="font-sans antialiased text-neutral-900 dark:text-white dark:bg-black"
        style={{
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        }}
      >
        <SupabaseProvider>
          <AuthProvider>
          {children}
          </AuthProvider>
        </SupabaseProvider>
      </body>
    </html>
  );
}
