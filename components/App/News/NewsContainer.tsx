"use client";

import { NewsContainerProps } from "@/types/news";
import { useNewsQuery } from "@/useQuery/queries/conce-ai.queries";
import Image from "next/image";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function NewsContainer({ ssrNews }: NewsContainerProps) {
  const newsQuery = useNewsQuery(ssrNews);

  if (
    newsQuery.isLoading ||
    (ssrNews.length === 0 && newsQuery.data.length === 0)
  ) {
    return (
      <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
        <h2 className="text-3xl font-bold text-primary mb-6 border-b border-muted pb-2">
          Últimas noticias de ConceAI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-card rounded-xl shadow-md p-5 space-y-4">
              <Skeleton height={180} />
              <Skeleton height={24} width="80%" />
              <Skeleton count={2} />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (newsQuery.isError) {
    return (
      <div className="text-center text-destructive py-16">
        <h2 className="text-2xl font-semibold mb-4">¡Algo salió mal! 😥</h2>
        <p className="text-muted-foreground">
          No se pudieron cargar las noticias. Intenta nuevamente más tarde.
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-primary mb-6 border-b border-muted pb-2">
        Últimas noticias de ConceAI
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsQuery.data?.map((n) => (
          <article
            key={n.id}
            className="bg-card text-card-foreground rounded-xl shadow-md overflow-hidden transition hover:shadow-lg hover:ring-2 hover:ring-ring"
          >
            {n.image !== "no-image" && (
              <div className="h-48 w-full relative">
                <Image
                  src={n.image}
                  alt={n.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-5 space-y-3">
              <h3 className="text-xl font-semibold text-primary">{n.title}</h3>
              <p className="text-muted-foreground line-clamp-3">
                {n.description}
              </p>
              <p className="text-xs text-muted-foreground italic">
                Publicado el{" "}
                {new Date(n.publishedAt).toLocaleDateString("es-CL", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
              <a
                href={n.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block mt-2 text-sm font-medium text-secondary hover:underline"
              >
                Leer más →
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
