
import Image from "next/image";

const photos = [
  { src: "IMG_8880.webp", alt: "Azure Bliss villa exterior" },
  { src: "IMG_8881.webp", alt: "Azure Bliss property view" },
  { src: "IMG_8886.webp", alt: "Azure Bliss outdoor space" },
  { src: "IMG_8887.webp", alt: "Azure Bliss private villa and surroundings" },
  { src: "IMG_8888.webp", alt: "Azure Bliss villa interiors" },
  { src: "IMG_8902.webp", alt: "Azure Bliss swimming pool" },
  { src: "IMG_8910.webp", alt: "Azure Bliss garden and lawn" },
  { src: "IMG_8912.webp", alt: "Azure Bliss gazebo" },
  { src: "IMG_8913.webp", alt: "Azure Bliss mountain views" },
  { src: "IMG_8918.webp", alt: "Azure Bliss outdoor relaxation area" },
];

const base = "/assets/villas/azure-bliss/";

export default function AzureBlissPreview() {
  return (
    <main className="min-h-screen bg-[#f8f7f3] text-[#26352f]">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <div>
          <p className="text-xl font-semibold tracking-[0.18em]">
            STAY WILLAS
          </p>
          <p className="mt-1 text-xs tracking-[0.25em] text-gray-500">
            EXCLUSIVE VILLA COLLECTION
          </p>
        </div>
        <span className="text-xs tracking-widest text-gray-500">
          IGATPURI · MAHARASHTRA
        </span>
      </header>

      <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6">
        <div className="mb-7">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-[#9a7954]">
            A Private Mountain Retreat
          </p>
          <h1 className="text-4xl font-light tracking-wide sm:text-6xl">
            Azure Bliss
          </h1>
          <p className="mt-3 text-sm text-gray-600">
            Igatpuri, Maharashtra · Private 3 BHK Villa
          </p>
        </div>

        <div className="relative aspect-[16/9] overflow-hidden rounded-sm">
          <Image
            src={`${base}IMG_8887.webp`}
            alt="Azure Bliss private villa in Igatpuri"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute bottom-5 left-5 bg-black/50 px-5 py-3 text-white">
            <p className="text-xs uppercase tracking-[0.25em]">
              Your Private Escape
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 border-b border-gray-200 py-8 text-center sm:grid-cols-4">
          {[
            ["03", "Bedrooms"],
            ["15", "Maximum Guests"],
            ["01", "Private Pool"],
            ["∞", "Mountain Views"],
          ].map(([value, label]) => (
            <div key={label}>
              <p className="text-2xl font-light">{value}</p>
              <p className="mt-1 text-xs uppercase tracking-widest text-gray-500">
                {label}
              </p>
            </div>
          ))}
        </div>

        <section className="grid gap-8 py-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.25em] text-[#9a7954]">
              Discover Azure Bliss
            </p>
            <h2 className="text-3xl font-light leading-snug">
              Space to unwind.
              <br />
              Views to remember.
            </h2>
          </div>
          <div className="leading-8 text-gray-600">
            <p>
              Escape to Azure Bliss, a private 3 BHK villa in the beautiful
              surroundings of Igatpuri. Designed for memorable getaways,
              the property accommodates up to 15 guests.
            </p>
            <p className="mt-4">
              Enjoy your private swimming pool, mountain views, spacious lawn,
              gazebo and relaxing outdoor spaces.
            </p>
          </div>
        </section>

        <section className="pb-14">
          <div className="mb-7">
            <p className="text-xs uppercase tracking-[0.25em] text-[#9a7954]">
              The Property
            </p>
            <h2 className="mt-2 text-3xl font-light">Explore Azure Bliss</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {photos.filter((photo) => photo.src !== "IMG_8887.webp").map((photo) => (
              <div
                key={photo.src}
                className="relative aspect-[4/3] overflow-hidden bg-gray-200"
              >
                <Image
                  src={`${base}${photo.src}`}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="bg-[#e9e9df] px-6 py-12 text-center sm:px-12">
          <p className="text-xs uppercase tracking-[0.3em] text-[#9a7954]">
            The Azure Bliss Experience
          </p>
          <h2 className="mt-3 text-3xl font-light">
            Your next getaway awaits.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-600">
            Private swimming pool · Mountain views · Gazebo · Spacious lawn ·
            Pool loungers · Bonfire
          </p>
          <p className="mt-7 text-xs uppercase tracking-[0.2em] text-gray-500">
            Stay Willas · Villa Preview
          </p>
        </section>

        <footer className="py-8 text-center text-xs tracking-widest text-gray-500">
          © Stay Willas · Azure Bliss · Igatpuri
        </footer>
      </section>
    </main>
  );
}
