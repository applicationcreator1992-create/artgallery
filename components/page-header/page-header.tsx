export default function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative h-[40vh] min-h-[300px] w-full overflow-hidden">
      {/* Page Header Background - Other Pages Background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url('/images/backgrounds/background2.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Page Header Content */}
      <div className="relative flex h-full items-center justify-center text-center text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h1
            className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl text-white"
            style={{
              textShadow:
                "2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)",
            }}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className="mt-4 text-lg sm:text-xl text-gray-200 max-w-3xl mx-auto"
              style={{
                textShadow:
                  "1px 1px 3px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)",
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
