import { BlogFooter } from "@/components/home/blog-footer";
import Categories from "@/components/home/categories";
import Navbar from "@/components/home/header/Navbar";
import HeroSection from "@/components/home/hero-section";
import Newsletter from "@/components/home/newsletter";
import TopArticles from "@/components/home/top-articles";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div />}>
        <Navbar />
      </Suspense>
      <HeroSection />
      <section className="relative py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* <TopArticles /> */}
        </div>
      </section>
      <Categories />
      <Newsletter />
      <BlogFooter />
    </div>
  );
}
