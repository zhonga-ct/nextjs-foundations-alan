import Image from "next/image";

const images = [
  { src: "https://picsum.photos/800/600?random=1", alt: "Mountain landscape" },
  { src: "https://picsum.photos/800/600?random=2", alt: "Ocean sunset" },
  { src: "https://picsum.photos/800/600?random=3", alt: "Forest path" },
  { src: "https://picsum.photos/800/600?random=4", alt: "City skyline" },
];

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 font-bold text-3xl">Photo Gallery</h1>

      {/* Preload the hero image because it is the page's LCP candidate */}
      <div className="relative mb-8 aspect-video w-full">
        <Image
          alt="Featured landscape"
          className="rounded-lg object-cover"
          fill
          preload
          quality={85}
          sizes="(max-width: 896px) 100vw, 896px"
          src="https://picsum.photos/1200/600?random=hero"
        />
      </div>

      {/* Gallery grid with responsive images */}
      <div className="grid grid-cols-2 gap-4">
        {images.map((image) => (
          <div className="relative aspect-[4/3]" key={image.src}>
            {/* fill + aspect-ratio container reserves space (no CLS); lazy loads by default */}
            <Image
              alt={image.alt}
              className="rounded-lg object-cover"
              fill
              quality={80}
              sizes="(max-width: 768px) 50vw, 400px"
              src={image.src}
            />
          </div>
        ))}
      </div>

      <section className="mt-8 rounded bg-green-100 p-4">
        <h2 className="mb-2 font-semibold text-green-800">
          Performance Optimizations Applied
        </h2>
        <ul className="list-inside list-disc text-green-700 text-sm">
          <li>Images served as WebP/AVIF from /_next/image</li>
          <li>Hero preloaded with the preload prop</li>
          <li>Responsive sizes prevent over-fetching</li>
          <li>Space reserved with fill + aspect ratio (no CLS)</li>
          <li>Below-fold images lazy load automatically</li>
        </ul>
      </section>
    </main>
  );
}
