export default function LicensesPage() {
  return (
    <div className="relative">
      <img
      loading="lazy"
        src="https://source.unsplash.com/5QgIuuBxKwM/1920x1080"
        alt="legal papers background"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <main className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold mb-6">Licenses</h1>
        <p className="mb-4 text-gray-700">
          ECHO uses open-source tools and assets with appreciation. Here’s what
          powers the echo chamber:
        </p>

        <ul className="list-disc ml-6 text-gray-700 space-y-2">
          <li>
            <strong>Next.js</strong> — MIT License —{" "}
            <a
              href="https://github.com/vercel/next.js/blob/canary/license.md"
              className="text-blue-600 hover:underline"
            >
              View License
            </a>
          </li>
          <li>
            <strong>Tailwind CSS</strong> — MIT License —{" "}
            <a
              href="https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE"
              className="text-blue-600 hover:underline"
            >
              View License
            </a>
          </li>
          <li>
            <strong>React</strong> — MIT License —{" "}
            <a
              href="https://github.com/facebook/react/blob/main/LICENSE"
              className="text-blue-600 hover:underline"
            >
              View License
            </a>
          </li>
        </ul>

        <p className="mt-6 text-gray-700">
          Any blog images, icons, or fonts used will be credited where
          appropriate. If we missed something, let us know — we believe in
          open-source karma.
        </p>

        <p className="text-gray-500 mt-12">Last updated: June 2025</p>
      </main>
    </div>
  );
}
