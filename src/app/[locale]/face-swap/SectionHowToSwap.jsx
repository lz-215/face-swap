import Image from "next/image";

export default function SectionHowToSwap() {
  return (
    <section className="w-full flex flex-col items-center mt-24 mb-16 px-4">
      <h2 className="text-4xl md:text-5xl font-extrabold text-lime-400 mb-3 text-center drop-shadow-[0_4px_24px_rgba(212,255,0,0.4)]">
        How to Swap Faces Online with VidMage
      </h2>
      <p className="text-lg md:text-xl text-neutral-200 mb-12 max-w-3xl text-center font-light">
        Quickly swap faces in photos using VidMage's advanced AI tool. Follow these simple steps to create unique and entertaining face swaps in just minutes.
      </p>
      <div className="flex flex-col md:flex-row justify-center items-center gap-12 w-full max-w-6xl">
        {/* Left: Steps */}
        <div className="flex-1 min-w-[320px] max-w-xl">
          <div className="mb-12">
            <h3 className="text-lime-400 text-2xl font-extrabold mb-2">Step 1: Upload Original Image</h3>
            <p className="text-neutral-100 text-base leading-relaxed">
              Start by uploading the photo you want to swap faces with. This will be your base image. Our tool will ensure that areas outside the face remain untouched for a seamless result.
            </p>
          </div>
          <div className="mb-12">
            <h3 className="text-lime-400 text-2xl font-extrabold mb-2">Step 2: Add Face Image</h3>
            <p className="text-neutral-100 text-base leading-relaxed">
              Upload the face image you want to use for the swap. This could be a photo of yourself, a friend, or even a favorite character. Make sure the image is clear for the best outcome.
            </p>
          </div>
          <div className="mb-4">
            <h3 className="text-lime-400 text-2xl font-extrabold mb-2">Step 3: Swap Faces</h3>
            <p className="text-neutral-100 text-base leading-relaxed">
              Click the Face Swap button and let VidMage's AI work its magic. Within seconds, your swapped image will be ready with natural and realistic results.
            </p>
          </div>
        </div>
        {/* Right: Single Image */}
        <div className="flex-1 flex items-center justify-center min-w-[320px]">
          <div className="relative w-[485px] h-[298px] rounded-3xl overflow-hidden shadow-2xl border-4 border-lime-300">
            <Image src="/images/origin1.png" alt="Face Swap Result" fill className="object-cover rounded-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
} 