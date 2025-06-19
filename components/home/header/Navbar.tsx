"use client";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "../../ui/button";
import SearchInput from "./SearchInput";
import ToggleMode from "./ToggleMode";
import { Menu, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2">
      <div className=" container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/*LEft Section*/}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center space-x-2">
              <span className="flex flex-col font-bold text-2xl leading-5 text-center">
                <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  EC
                </span>
                <span className="block pl-2 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                  HO
                </span>
              </span>
            </Link>
          </div>
          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4">
            {["Home", "Articles", "Contact", "Dashboard"].map((label, i) => (
              <Link
                key={i}
                href={`/${
                  label.toLowerCase() === "home" ? "" : label.toLowerCase()
                }`}
                className="inline-block px-4 py-2 text-md font-semibold text-foreground transition-all duration-200 ease-in-out 
                 hover:bg-gradient-to-r from-purple-600 to-indigo-600 hover:text-white rounded-md group"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* RIght Section */}
          <div className="flex items-center gap-4">
            <SearchInput />

            <ToggleMode />

            {/* User Action */}
            <SignedIn>
              <UserButton />
            </SignedIn>

            <SignedOut>
              <div className="hidden md:flex items-center gap-2">
                <SignInButton>
                  <Button variant={"outline"}>Login</Button>
                </SignInButton>
                <SignUpButton>
                  <Button>Signup</Button>
                </SignUpButton>
              </div>
            </SignedOut>
          </div>
          {/* Mobile Menu button */}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden py-4 space-y-4 border-t">
          {/* Search Bar (Mobile) */}
          <div className="px-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search articles..."
                className="pl-10 w-full focus-visible:ring-1"
              />
            </div>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-2 px-4">
            <Link
              href="/articles"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Articles
            </Link>
            <Link
              href="/tutorials"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Tutorials
            </Link>
            <Link
              href="/about"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/dashboard"
              className="block px-3 py-2 text-base font-medium text-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <SignedOut>
            <div className="px-4 flex flex-col gap-2">
              <SignInButton>
                <Button variant="outline" className="w-full">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="w-full">Sign up</Button>
              </SignUpButton>
            </div>
          </SignedOut>
        </div>
      )}
    </div>
  );
};

export default Navbar;
