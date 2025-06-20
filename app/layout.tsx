import type { Metadata } from "next";
import "./globals.css";
import { createBrowserClient } from "@supabase/ssr";
import SupabaseProvider from "@/components/providers/supabase-provider";


export const metadata: Metadata = {
  title: "ECHO",
  description: "A Content-Publishing Platform",
};
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
  return (
      <html lang="en" suppressHydrationWarning>
        <body
          className="font-sans antialiased text-neutral-900 dark:text-white dark:bg-black"
        style={{
          fontFamily: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`,
        }}
        >
          <SupabaseProvider>
            {children}
          </SupabaseProvider>
        </body>
      </html>
  );
}
