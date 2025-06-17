// ECHO - Privacy Policy

import Image from "next/image";

export default function PrivacyPolicyPage() {
  return (
    <div className="relative h-screen">
      <Image
      loading="lazy"
        src="https://images.unsplash.com/photo-1556155092-8707de31f9c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="legal papers background"
        className="absolute inset-0 w-full h-full object-cover opacity-5"
        fill
      />
    <main className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Privacy Policy</h1>
      <p className="mb-4 text-gray-200">
        At <strong>ECHO</strong>, your privacy is sacred — like that one unread WhatsApp message you never opened. Here’s how we treat your data:
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">1. What We Collect</h2>
      <p className="mb-4 text-gray-200">
        We may collect your name, email, and message if you use our contact form. That’s it. No creepy tracking.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">2. What We Do With It</h2>
      <p className="mb-4 text-gray-200">
        Just reply to your messages. No spam, no selling to data goblins.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">3. Cookies</h2>
      <p className="mb-4 text-gray-200">
        We may use minimal cookies to keep things functional (like keeping you logged in if that’s ever added). You’re still sweet enough without them.
      </p>

      <h2 className="text-2xl font-semibold mt-8 mb-2">4. Third Parties</h2>
      <p className="mb-4 text-gray-200">
        We don’t share your data with third parties, unless legally required (or if Gandalf requests it personally).
      </p>

      <p className="text-gray-500 mt-12">Last updated: June 2025</p>
    </main>
    </div>
  );
}
