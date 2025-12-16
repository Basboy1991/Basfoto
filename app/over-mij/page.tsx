import { siteConfig } from "@/config/site";

export const metadata = {
  title: `Over mij | ${siteConfig.name}`,
  description:
    "Lees meer over Bas, fotograaf in het Westland. Persoonlijke fotografie voor gezinnen en huisdieren, met rust en aandacht.",
};

export default function OverMijPage() {
  return (
    <article className="prose prose-zinc max-w-none">
      <h1>Over mij – fotograaf in het Westland</h1>

      <p>
        Hoi, ik ben Bas. Fotografie is voor mij meer dan een mooie foto maken.
        Ik vind het belangrijk dat jij je op je gemak voelt, zodat we samen
        echte momenten vastleggen.
      </p>

      <p>
        Als <strong>fotograaf in het Westland</strong> werk ik veel met gezinnen
        en huisdieren. Geen stijve poses, maar ontspannen shoots waarin ruimte
        is voor spontaniteit en plezier.
      </p>

      <h2>Mijn manier van werken</h2>

      <ul>
        <li>Rustige begeleiding tijdens de shoot</li>
        <li>Geduld, vooral met kinderen en dieren</li>
        <li>Fotograferen op locatie in het Westland</li>
      </ul>

      <h2>Waarom kiezen voor Bas-fotografie?</h2>

      <p>
        Ik neem de tijd om jullie te leren kennen. Of het nu gaat om een
        gezinsreportage of een fotoshoot van je huisdier: het draait om een
        fijne ervaring én foto’s waar je met een goed gevoel op terugkijkt.
      </p>
    </article>
  );
}
