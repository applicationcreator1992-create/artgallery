export default function Hero() {
  return (
    <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
      {/* Hero Background - Home Page Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/backgrounds/background1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Hero Content */}
      <div className="relative flex h-full items-center justify-center text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          {/* Main Headline */}
          <h1
            className="mb-4 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl text-white"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)",
            }}
          >
            Welcome to LilyaArt
          </h1>
          <p
            className="mb-8 text-lg sm:text-xl lg:text-2xl text-gray-200 max-w-3xl mx-auto"
            style={{
              textShadow:
                "1px 1px 3px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)",
            }}
          >
            Beautiful Art for Your Home
          </p>
          <p
            className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto"
            style={{
              textShadow:
                "1px 1px 2px rgba(0,0,0,0.8), -1px -1px 1px rgba(0,0,0,0.8)",
            }}
          >
            Discover our curated collection of exceptional artwork from talented
            artists around the world. Each piece is carefully selected to bring
            beauty and inspiration to your space.
          </p>
        </div>
      </div>
    </section>
  );
}
