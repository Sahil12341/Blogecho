import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { Linkedin, Github, Twitter } from "lucide-react";
import Link from "next/link";

export function BlogFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 lg:grid-cols-4">
          {/* Branding Section */}
          <div className="md:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="flex flex-col font-bold text-3xl leading-none text-center">
                <span className="block justify-start bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  EC
                </span>
                <span className="block pl-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  HO
                </span>
              </span>
            </Link>
          </div>
            <p className="mt-4 text-muted-foreground">
              Where ideas meet innovation. Dive into a world of insightful
              articles written by passionate thinkers and industry experts.
            </p>

            <div className="mt-6 flex gap-2">
              <Button variant="ghost" size="icon">
                <Twitter className="h-5 w-5 " />
              </Button>
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5 " />
              </Button>
              <Button variant="ghost" size="icon">
                <Linkedin className="h-5 w-5 " />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Explore</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Articles
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Topics
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Authors
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Podcasts
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Legal</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacy-policy"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cookie Policy
                </a>
              </li>
              <li>
                <a
                  href="/licenses"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Licenses
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-2 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-semibold text-foreground">
              Stay Updated
            </h3>
            <form className="flex flex-col gap-4">
              <div className="relative flex items-center space-x-2">
                <div className="relative w-full">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="pl-10 pr-4 py-6 w-full"
                  />
                  <Mail className="h-5 w-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                </div>
                <Button type="submit" className="py-6 px-6">
                  Subscribe
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Copyright */}
      </div>
        <div className="border-t p-4 text-center w-full">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Echo. All rights reserved.
          </p>
        </div>
    </footer>
  );
}
