"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Photo grid with a full-screen viewer built on the native <dialog>
 * (focus trapping and Escape handling come from the browser).
 */
export function HospitalGallery({ images, hospitalName }: { images: GalleryImage[]; hospitalName: string }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState(0);
  const count = images.length;
  const current = images[index];

  const open = (i: number) => {
    setIndex(i);
    dialogRef.current?.showModal();
  };
  const step = useCallback((delta: number) => setIndex((i) => (i + delta + count) % count), [count]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    dialog.addEventListener("keydown", onKey);
    return () => dialog.removeEventListener("keydown", onKey);
  }, [step]);

  const visible = images.slice(0, 5);
  const hidden = count - visible.length;

  return (
    <>
      {/* A mosaic from three photos up; one or two sit side by side. */}
      <ul
        className={cn(
          "m-0 grid list-none gap-3 p-0",
          visible.length >= 3 ? "grid-cols-2 md:grid-cols-4 md:grid-rows-2" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {visible.map((img, i) => (
          <li key={img.src} className={cn(visible.length >= 3 && i === 0 && "col-span-2 md:row-span-2")}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group relative block aspect-[4/3] size-full overflow-hidden rounded-[18px] border border-line bg-[#e8e4dc]"
              aria-label={`Open photo ${i + 1} of ${count}: ${img.alt}`}
            >
              <Image
                src={img.src}
                alt=""
                fill
                sizes={visible.length < 3 || i === 0 ? "(min-width: 768px) 600px, 100vw" : "(min-width: 768px) 300px, 50vw"}
                className="object-cover transition-transform duration-500 ease-out-soft group-hover:scale-[1.04]"
              />
              {i === visible.length - 1 && hidden > 0 ? (
                <span className="absolute inset-0 flex items-center justify-center bg-ink/55 text-[15px] font-medium text-white">
                  +{hidden} more
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label={`${hospitalName} photos`}
        className="m-auto size-full max-h-none max-w-none bg-brand-deep/95 p-0 backdrop:bg-black/60"
        onClick={(e) => {
          if (e.target === e.currentTarget) dialogRef.current?.close();
        }}
      >
        {current ? (
          <div className="flex h-full flex-col items-center justify-center gap-4 px-4 py-6 text-white">
            <div className="flex w-full max-w-[1100px] items-center justify-between gap-4">
              <p className="m-0 text-sm text-white/80" aria-live="polite">
                {index + 1} / {count}
              </p>
              <button
                type="button"
                onClick={() => dialogRef.current?.close()}
                className="flex size-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
                aria-label="Close photos"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            <figure className="m-0 flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center gap-3">
              <div className="relative h-full max-h-[75vh] w-full">
                <Image src={current.src} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </div>
              <figcaption className="text-center text-sm text-white/85">
                {current.alt}
                {current.credit ? <span className="block text-xs text-white/60">{current.credit}</span> : null}
              </figcaption>
            </figure>
            {count > 1 ? (
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Previous photo"
                >
                  <ChevronLeft aria-hidden="true" className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="flex size-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
                  aria-label="Next photo"
                >
                  <ChevronRight aria-hidden="true" className="size-6" />
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </dialog>
    </>
  );
}
