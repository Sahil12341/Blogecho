"use client";

import { sendContactEmail } from "./actions";
import { AuthProvider } from "@/hooks/use-auth";
import { AuthButton } from "@/components/auth/auth-button";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, Users, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/contact/contact-form";

export default function ContactPage() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
                      Echo
                    </span>
                  </Link>
                </div>
              </div>
              <AuthButton />
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Have a question, suggestion, or want to collaborate? We'd love to
              hear from you. Send us a message and we'll respond as quickly as
              possible.
            </p>

            {/* Quick Contact Options */}
            <div className="grid md:grid-cols-4 gap-4 mt-12">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Mail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">General Inquiries</h3>
                  <p className="text-sm text-gray-600">
                    Questions about our platform or services
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Technical Support</h3>
                  <p className="text-sm text-gray-600">
                    Need help with technical issues
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Partnerships</h3>
                  <p className="text-sm text-gray-600">
                    Business collaboration opportunities
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Lightbulb className="h-8 w-8 text-orange-600 mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Guest Posts</h3>
                  <p className="text-sm text-gray-600">
                    Share your expertise with our community
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ContactForm onSubmit={sendContactEmail} />
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Link href="/" className="flex items-center space-x-2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent text-3xl font-semibold">
                      Echo
                    </span>
                  </Link>
                </div>
                <p className="text-gray-400">
                  A platform where ideas echo through words, connecting writers
                  and readers in meaningful conversations.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href="/"
                    className="text-gray-400 hover:text-white block"
                  >
                    Home
                  </Link>
                  <Link
                    href="/blog"
                    className="text-gray-400 hover:text-white block"
                  >
                    Blog
                  </Link>
                  <Link
                    href="/categories"
                    className="text-gray-400 hover:text-white block"
                  >
                    Categories
                  </Link>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white block"
                  >
                    About
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="space-y-2">
                  <Link
                    href="/category/technology"
                    className="text-gray-400 hover:text-white block"
                  >
                    Technology
                  </Link>
                  <Link
                    href="/category/design"
                    className="text-gray-400 hover:text-white block"
                  >
                    Design
                  </Link>
                  <Link
                    href="/category/programming"
                    className="text-gray-400 hover:text-white block"
                  >
                    Programming
                  </Link>
                  <Link
                    href="/category/react"
                    className="text-gray-400 hover:text-white block"
                  >
                    React
                  </Link>
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Support</h3>
                <div className="space-y-2">
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white block"
                  >
                    Contact
                  </Link>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white block"
                  >
                    Privacy Policy
                  </Link>
                  <Link
                    href="/terms"
                    className="text-gray-400 hover:text-white block"
                  >
                    Terms of Service
                  </Link>
                  <Link
                    href="/help"
                    className="text-gray-400 hover:text-white block"
                  >
                    Help Center
                  </Link>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
              <p>
                &copy; {new Date().getFullYear()} Echo Blog. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
