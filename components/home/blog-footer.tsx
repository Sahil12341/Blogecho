import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Linkedin, Github, Twitter } from "lucide-react";
import Link from "next/link";

export function BlogFooter() {
  return (
   <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <span className="text-xl font-bold">Echo</span>
              </div>
              <p className="text-gray-400">
                A platform where ideas echo through words, connecting writers and readers in meaningful conversations.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <Link href="/" className="text-gray-400 hover:text-white block">
                  Home
                </Link>
                <Link href="/blog" className="text-gray-400 hover:text-white block">
                  Blog
                </Link>
                <Link href="/categories" className="text-gray-400 hover:text-white block">
                  Categories
                </Link>
                <Link href="/about" className="text-gray-400 hover:text-white block">
                  About
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <div className="space-y-2">
                <Link href="/category/technology" className="text-gray-400 hover:text-white block">
                  Technology
                </Link>
                <Link href="/category/design" className="text-gray-400 hover:text-white block">
                  Design
                </Link>
                <Link href="/category/programming" className="text-gray-400 hover:text-white block">
                  Programming
                </Link>
                <Link href="/category/react" className="text-gray-400 hover:text-white block">
                  React
                </Link>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <div className="space-y-2">
                <Link href="/contact" className="text-gray-400 hover:text-white block">
                  Contact
                </Link>
                <Link href="/privacy" className="text-gray-400 hover:text-white block">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="text-gray-400 hover:text-white block">
                  Terms of Service
                </Link>
                <Link href="/help" className="text-gray-400 hover:text-white block">
                  Help Center
                </Link>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Echo Blog. All rights reserved.</p>
          </div>
        </div>
      </footer>
  );
}
