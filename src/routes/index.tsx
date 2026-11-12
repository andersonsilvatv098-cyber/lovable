import { createRoute } from '@tanstack/react-router';
import { ButtonLink } from '@/components/ui/button';
import { Route as rootRoute } from '@/routes/__root';

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: KitConscienciaNegra,
});

function KitConscienciaNegra() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6 py-16 text-foreground sm:px-10">
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
    </main>
  );
}
