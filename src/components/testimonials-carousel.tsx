import { Children, useId, useRef, useState, type PointerEvent, type ReactNode } from 'react';

interface TestimonialsCarouselProps {
  children: ReactNode;
  title?: string;
}

export function TestimonialsCarousel({
  children,
  title = 'Depoimentos',
}: TestimonialsCarouselProps) {
  const slides = Children.toArray(children);
  const id = useId();
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ pointerId: number; startX: number; scrollLeft: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const currentIndex = Math.min(activeIndex, Math.max(0, slides.length - 1));
  const controlClass = 'inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-primary-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-background disabled:hover:text-foreground';

  function goTo(index: number) {
    const element = viewport.current;
    if (!element) return;
    const nextIndex = Math.max(0, Math.min(index, slides.length - 1));
    element.scrollTo({ left: nextIndex * element.clientWidth, behavior: 'auto' });
    setActiveIndex(nextIndex);
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    suppressClick.current = false;
    if (event.pointerType !== 'mouse' || event.button !== 0 || slides.length < 2) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: event.currentTarget.scrollLeft,
      moved: false,
    };
  }

  function moveDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    const distance = event.clientX - gesture.startX;
    if (!gesture.moved && Math.abs(distance) < 5) return;
    if (!gesture.moved) {
      gesture.moved = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.style.scrollSnapType = 'none';
      setIsDragging(true);
    }
    event.preventDefault();
    event.currentTarget.scrollLeft = gesture.scrollLeft - distance;
  }

  function endDrag(event: PointerEvent<HTMLDivElement>) {
    const gesture = drag.current;
    if (!gesture || gesture.pointerId !== event.pointerId) return;
    drag.current = null;
    const element = event.currentTarget;
    if (element.hasPointerCapture(event.pointerId)) {
      element.releasePointerCapture(event.pointerId);
    }
    element.style.scrollSnapType = '';
    setIsDragging(false);
    if (gesture.moved && element.clientWidth > 0) {
      const distance = element.scrollLeft - gesture.scrollLeft;
      const startIndex = Math.round(gesture.scrollLeft / element.clientWidth);
      const nextIndex = Math.abs(distance) > Math.min(60, element.clientWidth * 0.15)
        ? startIndex + Math.sign(distance) * Math.max(1, Math.round(Math.abs(distance) / element.clientWidth))
        : startIndex;
      goTo(nextIndex);
    }
  }

  if (slides.length === 0) return null;

  return (
    <section
      aria-labelledby={`${id}-title`}
      aria-roledescription="carrossel"
      className="mx-auto w-full max-w-3xl bg-background py-10 text-foreground sm:py-16"
    >
      <h2 id={`${id}-title`} className="text-center text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h2>
      <p id={`${id}-help`} className="mt-3 text-center text-sm text-foreground/70">
        Arraste para os lados ou deslize no celular. Também é possível navegar pelas setas do teclado.
      </p>
      <div
        id={`${id}-slides`}
        ref={viewport}
        tabIndex={slides.length > 1 ? 0 : undefined}
        aria-label={title}
        aria-describedby={`${id}-help`}
        className={`mt-8 flex w-full select-none snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4 focus-visible:ring-offset-background ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onLostPointerCapture={endDrag}
        onPointerLeave={(event) => {
          if (drag.current && !drag.current.moved) endDrag(event);
        }}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          if (suppressClick.current) {
            event.preventDefault();
            event.stopPropagation();
            suppressClick.current = false;
          }
        }}
        onScroll={() => {
          const element = viewport.current;
          if (element && element.clientWidth > 0) {
            setActiveIndex(Math.max(0, Math.min(slides.length - 1, Math.round(element.scrollLeft / element.clientWidth))));
          }
        }}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(currentIndex + 1);
          } else if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(currentIndex - 1);
          } else if (event.key === 'Home') {
            event.preventDefault();
            goTo(0);
          } else if (event.key === 'End') {
            event.preventDefault();
            goTo(slides.length - 1);
          }
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={index}
            role="group"
            aria-roledescription="slide"
            aria-label={`Depoimento ${index + 1} de ${slides.length}`}
            className="w-full min-w-0 shrink-0 snap-start snap-always p-5 sm:p-8 [&_img]:h-auto [&_img]:max-w-full"
          >
            {slide}
          </div>
        ))}
      </div>
      {slides.length > 1 && (
        <div className="mt-5 flex flex-col items-center gap-3">
          <div className="flex w-full items-center justify-between gap-3 sm:justify-center sm:gap-6">
            <button
              type="button"
              aria-label="Depoimento anterior"
              aria-controls={`${id}-slides`}
              disabled={currentIndex === 0}
              onClick={() => goTo(currentIndex - 1)}
              className={controlClass}
            >
              Anterior
            </button>
            <p role="status" aria-live="polite" aria-atomic="true" className="text-sm tabular-nums">
              {currentIndex + 1} de {slides.length}
            </p>
            <button
              type="button"
              aria-label="Próximo depoimento"
              aria-controls={`${id}-slides`}
              disabled={currentIndex === slides.length - 1}
              onClick={() => goTo(currentIndex + 1)}
              className={controlClass}
            >
              Próximo
            </button>
          </div>
          <div role="group" aria-label="Escolher depoimento" className="flex max-w-full flex-wrap justify-center">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Ir para depoimento ${index + 1}`}
                aria-current={index === currentIndex ? 'true' : undefined}
                aria-controls={`${id}-slides`}
                onClick={() => goTo(index)}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
              >
                <span aria-hidden="true" className={`h-2.5 w-2.5 rounded-full bg-primary ${index === currentIndex ? 'opacity-100' : 'opacity-30'}`} />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
