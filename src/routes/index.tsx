import { createRoute } from '@tanstack/react-router';
import { ButtonLink } from '@/components/ui/button';
import { TestimonialsCarousel } from '@/components/testimonials-carousel';
import { Route as rootRoute } from '@/routes/__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: KitConscienciaNegra,
});

const testimonials = [
  { name: 'Maria Souza', x: 136 },
  { name: 'Camila', x: 520 },
  { name: 'Ana Paula Lima', x: 904 },
];

function KitConscienciaNegra() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-16 text-foreground sm:px-10">
      <section aria-labelledby="page-title" className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <h1 id="page-title" className="text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
          Kit Consciência Negra
        </h1>
        <ButtonLink
          href="https://app.fusionads.com.br/p/kitconsciencianegra"
          className="mt-10 w-full sm:w-auto"
        >
          Ver página original
        </ButtonLink>
      </section>
      <TestimonialsCarousel title="O que dizem quem já usou">
        {testimonials.map(({ name, x }) => (
          <svg
            key={name}
            viewBox={`${x} 181 300 610`}
            role="img"
            aria-label={`Depoimento de ${name}, com a conversa e as imagens originais enviadas na referência`}
            className="mx-auto block h-auto w-full max-w-[300px] overflow-hidden rounded-[36px] bg-background text-foreground shadow-lg"
          >
            <image
              href="/uploads/colado-20261112-201852.png"
              width="1466"
              height="833"
              preserveAspectRatio="none"
            />
          </svg>
        ))}
      </TestimonialsCarousel>
    </main>
  );
}
