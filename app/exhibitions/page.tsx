import { Metadata } from "next";

import PageHeader from "components/page-header/page-header";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Exhibitions - LilyaArt",
  description:
    "Discover current and upcoming art exhibitions at LilyaArt - Featuring talented artists from around the world",
};

export default function ExhibitionsPage() {
  const exhibitions = [
    {
      title: "Urban Landscapes: Modern City Perspectives",
      artist: "Maria Rodriguez",
      date: "March 15 - April 30, 2025",
      description:
        "A stunning collection of urban landscapes that capture the essence of modern city life through bold colors and dynamic compositions.",
      image: "/exhibition1.jpg",
      status: "current",
    },
    {
      title: "Abstract Emotions: Color & Form",
      artist: "James Chen",
      date: "May 1 - May 25, 2025",
      description:
        "An exploration of human emotions through abstract expression, featuring vibrant colors and powerful brushwork.",
      image: "/exhibition2.jpg",
      status: "upcoming",
    },
    {
      title: "Nature's Symphony: Organic Beauty",
      artist: "Sofia Andersson",
      date: "June 10 - July 5, 2025",
      description:
        "Celebrating the harmony of nature through delicate watercolors and mixed media interpretations.",
      image: "/exhibition3.jpg",
      status: "upcoming",
    },
  ];

  return (
    <>
      <PageHeader
        title="Current & Upcoming Exhibitions"
        subtitle="Discover extraordinary art from talented artists around the world"
      />
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Current & Upcoming Exhibitions
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover extraordinary art from talented artists around the world
            </p>
          </div>

          {/* Current Exhibition */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Current Exhibition
            </h2>
            <div className="bg-black text-white rounded-lg overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="relative h-96 bg-gray-200">
                  <img
                    src="https://images.unsplash.com/photo-1541961017774-22349e4a612e?w=800&h=600&fit=crop&crop=entropy"
                    alt="Current Exhibition"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    NOW SHOWING
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">
                    {exhibitions[0]?.title || "Exhibition"}
                  </h3>
                  <p className="text-gray-300 mb-4">
                    by{" "}
                    <span className="font-semibold">
                      {exhibitions[0]?.artist || "Unknown Artist"}
                    </span>
                  </p>
                  <p className="text-gray-300 mb-4">
                    {exhibitions[0]?.description || "No description available"}
                  </p>
                  <div className="mb-6">
                    <p className="text-gray-400 mb-2">
                      <strong>Exhibition Dates:</strong>
                    </p>
                    <p className="text-xl font-semibold text-white">
                      {exhibitions[0]?.date || "Coming Soon"}
                    </p>
                  </div>
                  <div className="space-y-4">
                    <Link
                      href="/search"
                      className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors w-full"
                    >
                      View Artwork
                    </Link>
                    <Link
                      href="/contact"
                      className="inline-block border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition-colors w-full"
                    >
                      Schedule Visit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Exhibitions */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Upcoming Exhibitions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exhibitions.slice(1).map((exhibition, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-48 bg-gray-200">
                    <img
                      src={`https://images.unsplash.com/photo-${1541961017774 + index}-22349e4a612e?w=600&h=400&fit=crop&crop=entropy`}
                      alt={exhibition.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-semibold">
                      UPCOMING
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {exhibition.title}
                    </h3>
                    <p className="text-gray-600 mb-2">
                      by{" "}
                      <span className="font-semibold">{exhibition.artist}</span>
                    </p>
                    <p className="text-gray-600 text-sm mb-4">
                      {exhibition.description}
                    </p>
                    <p className="text-sm font-semibold text-gray-900">
                      {exhibition.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Artist Submissions */}
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Are You an Artist?
            </h2>
            <p className="text-gray-600 mb-6">
              We're always looking for talented artists to feature in our
              exhibitions and gallery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors"
              >
                Submit Your Work
              </Link>
              <Link
                href="/search"
                className="inline-block border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse Artist Gallery
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
