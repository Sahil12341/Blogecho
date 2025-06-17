"use client";

import { handleContactSubmit } from "@/actions/contact-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import React, { useState, useTransition } from "react";

export default function ContactPage() {
  const [success, setSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="relative min-h-screen bg-gray-900 text-white">
      {/* Background Image */}
      <Image
      loading="lazy"
      src='https://images.unsplash.com/photo-1542744173-8e7e53415bb0'
      alt="contact page background"
      fill
      className="absolute inset-0 bg-cover w-full h-full object-cover bg-center opacity-30"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black opacity-60"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 py-24">
        {/* Intro Text */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Let’s build something together</h1>a
          <p className="text-lg text-gray-300 max-w-xl">
            Whether you have a question or just want to say hi, I’ll try my best to get back to you!
          </p>
        </div>

        {/* Success message */}
        {success && (
          <p className="text-green-400 font-medium text-center mb-4">Message sent successfully! </p>
        )}

        {/* Contact Form */}
        <form
          action={(formData) =>
            startTransition(async () => {
              const res = await handleContactSubmit(formData);
              if (res.success) setSuccess(true);
            })
          }
          className="w-full max-w-lg bg-opacity-10 p-8 rounded-lg shadow-lg space-y-6"
        >
          <Input
            name="name"
            required
            placeholder="Your Name"
            className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Input
            type="email"
            name="email"
            required
            placeholder="Your Email"
            className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <Textarea
            name="message"
            required
            rows={5}
            placeholder="Your Message"
            className="w-full p-3 rounded bg-white bg-opacity-20 text-white placeholder-gray-300 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="text-center">
            <Button
              type="submit"
              disabled={isPending}
              className="bg-indigo-600 hover:bg-indigo-700 transition text-white px-6 py-2 rounded font-semibold"
            >
              {isPending ? "Sending..." : "Send Message"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
