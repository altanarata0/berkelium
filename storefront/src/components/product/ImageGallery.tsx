"use client"

import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: { url: string }[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-[4/5] bg-off-white flex items-center justify-center">
        <span className="text-8xl font-heading font-bold text-berkeley-blue/10">
          Bk
        </span>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-[4/5] bg-off-white overflow-hidden">
        <Image
          src={images[activeIndex].url}
          alt={`${title} - image ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-20 overflow-hidden border-2 transition-all duration-200 ${
                i === activeIndex
                  ? "border-berkeley-blue"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={img.url}
                alt={`${title} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
