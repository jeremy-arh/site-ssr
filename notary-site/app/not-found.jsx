import Link from 'next/link'

// Server Component - pas de 'use client' pour permettre le prerendering statique
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-[600px] mx-auto px-[30px] text-center py-20">
        <div className="mb-8">
          <h1 className="text-[120px] sm:text-[160px] lg:text-[200px] font-bold text-gray-900 leading-none">
            404
          </h1>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/"
            className="bg-black text-white font-semibold px-8 py-4 rounded-lg hover:bg-gray-800 transition-colors inline-flex items-center gap-3"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
            <span>Back to Home</span>
          </Link>

          <Link
            href="/#services"
            className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:underline text-lg"
          >
            <span>View Our Services</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Looking for something specific?</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/#services" className="text-sm text-gray-600 hover:text-black transition-colors">
              Our Services
            </Link>
            <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-black transition-colors">
              How It Works
            </Link>
            <Link href="/#faq" className="text-sm text-gray-600 hover:text-black transition-colors">
              FAQ
            </Link>
            <Link href="/blog" className="text-sm text-gray-600 hover:text-black transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
