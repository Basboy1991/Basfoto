import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-16">
      <section
        className="mx-auto max-w-2xl rounded-3xl bg-[var(--surface-2)] p-10 text-center shadow-[var(--shadow-sm)]"
        style={{ border: "1px solid var(--border)" }}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--text-soft)]">
          Pagina niet gevonden
        </p>

        <h1
          className="mt-3 text-3xl font-semibold text-[var(--text)] md:text-4xl"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Oeps… hier is niets (meer).
        </h1>

        <p className="mx-auto mt-4 max-w-prose text-[var(--text-soft)]">
          De pagina die je zoekt bestaat niet of is verplaatst. Geen stress —
          hieronder vind je snel weer de juiste route.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[var(--accent)] px-7 py-3 text-sm font-medium text-white transition hover:bg-[var(--accent-strong)]"
          >
            Naar homepage
          </Link>

          <Link
            href="/portfolio"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/60 px-7 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
          >
            Bekijk portfolio
          </Link>

          <Link
            href="/over-mij"
            className="inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-white/60 px-7 py-3 text-sm font-medium text-[var(--text)] transition hover:bg-white"
          >
            Over mij
          </Link>
        </div>

        <p className="mt-8 text-xs text-[var(--text-soft)]">
          Tip: check je link, of ga via het menu naar de juiste pagina.
        </p>
      </section>
    </main>
  );
}