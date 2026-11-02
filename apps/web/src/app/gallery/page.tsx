import Image, { getImageProps } from "next/image";

// Simple gray blur placeholder (base64-encoded 1x1 SVG) for remote images,
// which don't get an auto-generated blurDataURL like static imports do
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IGZpbGw9IiM5Y2EzYWYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4=";

const images = [
  { src: "https://picsum.photos/800/600?random=1", alt: "Mountain landscape" },
  { src: "https://picsum.photos/800/600?random=2", alt: "Ocean sunset" },
  { src: "https://picsum.photos/800/600?random=3", alt: "Forest path" },
  { src: "https://picsum.photos/800/600?random=4", alt: "City skyline" },
];

// Art direction: a wide crop on desktop, a taller crop on smaller screens
function HeroWithArtDirection() {
  const common = {
    alt: "Featured landscape",
    sizes: "(max-width: 896px) 100vw, 896px",
    // getImageProps defaults to lazy; the hero is above the fold
    loading: "eager" as const,
  };

  // Desktop (>= 1024px): wide landscape
  const {
    props: { srcSet: desktop, width: desktopWidth, height: desktopHeight },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 600,
    quality: 85,
    src: "https://picsum.photos/1440/600?random=hero-desktop",
  });

  // Mobile/tablet (< 1024px): taller crop, lower quality
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 750,
    height: 900,
    quality: 75,
    src: "https://picsum.photos/750/900?random=hero-mobile",
  });

  return (
    <picture>
      {/* width/height on <source> reserve the desktop aspect ratio (no CLS) */}
      <source
        height={desktopHeight}
        media="(min-width: 1024px)"
        sizes={common.sizes} // <source> needs its own sizes, or it defaults to 100vw
        srcSet={desktop}
        width={desktopWidth}
      />
      {/* Either crop can be the LCP element, so use fetchPriority instead of preload */}
      <img
        {...rest}
        alt={common.alt}
        className="rounded-lg"
        fetchPriority="high"
        srcSet={mobile}
        style={{ width: "100%", height: "auto" }}
      />
    </picture>
  );
}

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 font-bold text-3xl">Photo Gallery</h1>

      {/* Hero with art direction */}
      <section className="mb-8">
        <HeroWithArtDirection />
      </section>

      {/* Gallery grid with blur placeholders */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div className="relative aspect-[4/3]" key={image.src}>
            {/* fill + aspect-ratio container reserves space (no CLS); lazy loads by default */}
            <Image
              alt={image.alt}
              blurDataURL={blurDataURL}
              className="rounded-lg object-cover"
              fill
              placeholder="blur"
              quality={75}
              sizes="(max-width: 768px) 50vw, 400px"
              src={image.src}
            />
          </div>
        ))}
      </div>

      <section className="mt-8 rounded bg-blue-50 p-4">
        <h2 className="mb-2 font-semibold text-blue-800">
          Advanced Optimizations Applied
        </h2>
        <ul className="list-inside list-disc text-blue-700 text-sm">
          <li>Blur placeholders for perceived performance</li>
          <li>Art direction: different hero images for mobile/desktop</li>
          <li>Custom deviceSizes matching Tailwind breakpoints</li>
          <li>Quality values restricted to 75, 85</li>
          <li>AVIF/WebP format optimization</li>
        </ul>
      </section>
    </main>
  );
}
