import type { ReactNode } from "react";

/**
 * Default shell for marketing / info routes under `app/(info)`.
 * Add copy as JSX inside `children` (paragraphs, lists, links).
 */
export function InfoArticle({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <main className="mx-auto min-h-screen max-w-[70%] px-4 pb-24 pt-28">
      <header className="border-b border-zinc-100 pb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-lg text-zinc-600">{description}</p>
        ) : null}
      </header>
      <div
        className={[
          "mt-10 space-y-4 text-base leading-relaxed text-zinc-700",
          "[&_a]:font-medium [&_a]:text-blue-600 [&_a]:underline-offset-2 hover:[&_a]:underline",
          "[&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-zinc-900 [&_h2]:first:mt-0",
          "[&_ul]:mt-4 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-6",
          "[&_ol]:mt-4 [&_ol]:list-decimal [&_ol]:space-y-2 [&_ol]:pl-6",
          "[&_strong]:font-semibold [&_strong]:text-zinc-900",
        ].join(" ")}
      >
        {children}
      </div>
    </main>
  );
}
