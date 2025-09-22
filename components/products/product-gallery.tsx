"use client"

import React, { useState, useCallback } from "react"
import { cn } from "@/lib/utils/utils"
import useEmblaCarousel from 'embla-carousel-react'
import { ChevronLeft, ChevronRight } from "lucide-react"

export function ProductGallery({ images, alt }: { images: string[]; alt: string }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  // Listen for slide change
  React.useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
    }
  }, [emblaApi, onSelect])

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])

  return (
    <div className="w-full">
      <div className="relative rounded-lg border border-border overflow-hidden">
        <div className="embla" ref={emblaRef}>
          <div className="flex">
            {images.map((src, idx) => (
              <div className="min-w-0 flex-[0_0_100%]" key={src + idx}>
                <img
                  src={(src && typeof src === 'string' && src.trim() !== '') ? src : "/placeholder.svg"}
                  alt={alt}
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
            ))}
          </div>
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1 shadow hover:bg-background"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 p-1 shadow hover:bg-background"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {images.map((src, idx) => (
            <button
              key={src + idx}
              type="button"
              onClick={() => emblaApi && emblaApi.scrollTo(idx)}
              className={cn(
                "h-3 w-3 rounded-full border border-border transition-all",
                idx === selectedIndex ? "bg-ring" : "bg-muted"
              )}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
