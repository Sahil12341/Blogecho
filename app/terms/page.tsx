export default function TermsOfServicePage() {
  return (
    <div className="relative h-screen">
      <img
      loading="lazy"
        src="https://images.unsplash.com/photo-1556740749-887f6717d7e4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
        alt="legal papers background"
        className="absolute w-full h-full object-cover opacity-5"
      />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Terms of Service</h1>
        <p className="mb-4 text-gray-200">
          Welcome to <strong>ECHO</strong>. By accessing or using our website,
          you agree to be bound by these Terms of Service. If you disagree with
          any part, feel free to click away like it's 2006.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">1. Use of Content</h2>
        <p className="mb-4 text-gray-200">
          All content on ECHO is for informational and entertainment purposes.
          Feel free to share it — just don't pretend it's yours. Attribution is
          cool, plagiarism is not.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">2. User Conduct</h2>
        <p className="mb-4 text-gray-200">
          Don’t hack, spam, or abuse our platform. Comments are welcome;
          toxicity is not.
        </p>

        <h2 className="text-2xl font-semibold mt-8 mb-2">3. Disclaimer</h2>
        <p className="mb-4 text-gray-200">
          We do our best to ensure accurate info, but we're not liable for
          decisions made based on ECHO’s content. You click, you risk — standard
          web disclaimer vibes.
        </p>

        <p className="text-gray-500 mt-12">Last updated: June 2025</p>
      </main>
    </div>
  );
}
