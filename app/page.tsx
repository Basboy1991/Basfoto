import Link from "next/link";
import { siteConfig } from "@/config/site";

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
          {siteConfig.primaryKeyword} voor gezinnen & huisdieren
        </h1>
        <p className="max-w-2xl text-lg text-zinc-700">
          {siteConfig.tagline}. Geen stijve poses—wel echte momenten, op een plek waar jij je op je gemak voelt.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            href="/boek"
            className="rounded-xl bg-zinc-900 px-5 py-3 text-sm font-medium text-white hover:bg-zinc-800"
          >
            Boek een shoot
          </Link>
          <Link
            href="/portfolio"
            className="rounded-xl border border-zinc-300 px-5 py-3 text-sm font-medium hover:bg-zinc-50"
          >
            Bekijk portfolio
          </Link>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          { title: "Gezinnen", text: "Spontane foto’s waar jullie écht op staan zoals jullie zijn." },
          { title: "Huisdieren", text: "Geduldige shoots met aandacht voor karakter en plezier." },
          { title: "Westland", text: "Buitenlocaties in de buurt: duinen, strand, park of gewoon bij jullie thuis." },
        ].map((card) => (
          <div key={card.title} className="rounded-2xl border p-6 shadow-sm">
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-2 text-zinc-700">{card.text}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
