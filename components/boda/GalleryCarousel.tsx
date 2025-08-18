'use client'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { Button } from '@heroui/button'
import { Card } from '@heroui/card'
import { Modal, ModalBody, ModalContent } from '@heroui/modal'
import { ChevronLeft, ChevronRight, Maximize2, X, Dot } from 'lucide-react'
import { GalleryImage } from './types'

export default function GalleryCarousel({ images }: { images: GalleryImage[] }) {
  const viewportRef = useRef<HTMLDivElement>(null)
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return
    const slides = Array.from(
      viewport.querySelectorAll('[data-slide]')
    ) as HTMLElement[]
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) {
          const idx = Number((visible.target as HTMLElement).dataset.index || 0)
          setIndex(idx)
        }
      },
      { root: viewport, threshold: [0.5, 0.75, 0.9] }
    )
    slides.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])

  const scrollTo = (i: number) => {
    const viewport = viewportRef.current
    if (!viewport) return
    const el = viewport.querySelector<HTMLElement>(
      `[data-slide][data-index="${i}"]`
    )
    el?.scrollIntoView({ behavior: 'smooth', inline: 'start' })
  }

  const prev = () => scrollTo(Math.max(0, index - 1))
  const next = () => scrollTo(Math.min(images.length - 1, index + 1))

  if (!images?.length) return null

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Galería del hotel</h2>
        <div className="flex items-center gap-2">
          <Button isIconOnly variant="flat" onPress={prev} aria-label="Anterior">
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button isIconOnly variant="flat" onPress={next} aria-label="Siguiente">
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden border border-neutral-200">
        <div
          ref={viewportRef}
          className="relative flex overflow-x-auto snap-x snap-mandatory no-scrollbar"
          style={{ scrollBehavior: 'smooth' }}
        >
          {images.map((img, i) => (
            <figure
              key={i}
              data-slide
              data-index={i}
              className="relative shrink-0 w-full snap-start"
              onClick={() => setOpen(true)}
            >
              {/* Aspect ratio 16:9 */}
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <Image
                  src={img.src}
                  alt={img.alt || `Imagen ${i + 1}`}
                  fill
                  className="object-cover cursor-zoom-in"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority={i === 0}
                />

                <div className="absolute right-3 bottom-3 flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="flat"
                    startContent={<Maximize2 className="w-4 h-4" />}
                    onPress={() => setOpen(true)} // <- sin stopPropagation
                  >
                    Ver grande
                  </Button>
                </div>
              </div>

              {img.caption && (
                <figcaption className="absolute left-0 right-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent text-white px-4 py-3 text-sm">
                  {img.caption}
                </figcaption>
              )}
            </figure>
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1 py-3">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Ir a la imagen ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`transition-opacity ${i === index ? 'opacity-100' : 'opacity-40'} hover:opacity-100`}
            >
              <Dot className="w-6 h-6" />
            </button>
          ))}
        </div>
      </Card>

      {/* Lightbox */}
      <Modal isOpen={open} onOpenChange={setOpen} size="5xl">
        <ModalContent>
          {() => (
            <>
              <div className="flex justify-end p-2">
                <Button isIconOnly variant="flat" onPress={() => setOpen(false)} aria-label="Cerrar">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <ModalBody>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <Image
                    src={images[index]?.src}
                    alt={images[index]?.alt || `Imagen ${index + 1}`}
                    fill
                    className="object-contain bg-black"
                    sizes="100vw"
                  />
                </div>
                {images[index]?.caption && (
                  <p className="text-center text-sm text-neutral-600">
                    {images[index].caption}
                  </p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </section>
  )
}
