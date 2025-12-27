"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "idle" | "sending" | "success" | "error";

export default function BookingForm({
  date,
  time,
  timezone,
  onSuccess,
}: {
  date: string | null;
  time: string | null;
  timezone: string;
  onSuccess?: (slot: { date: string; time: string }) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const canSend = Boolean(date && time);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    if (!date || !time) {
      setStatus("error");
      setError("Kies eerst een datum en tijd.");
      return;
    }

    setStatus("sending");
    setError(null);

    const form = new FormData(formEl);
    const consent = form.get("consent") === "on";
    const countRaw = String(form.get("count") ?? "").trim();

    const payload = {
      date,
      time,
      timezone,

      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),

      count: countRaw,

      shootType: String(form.get("shootType") ?? "").trim(),
      location: String(form.get("location") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),

      preferredContact: String(form.get("preferredContact") ?? "whatsapp"),
      consent,

      company: String(form.get("company") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("BOOKING RESPONSE", res.status, data);

      if (!res.ok) {
        const msg =
          data?.errors
            ? Object.values(data.errors).join(" ")
            : data?.error ?? "Er ging iets mis. Probeer opnieuw.";
        throw new Error(msg);
      }

      // ✅ liefst response (maar fallback kan)
      const bookedDate = String(data?.date ?? date);
      const bookedTime = String(data?.time ?? time);

      setStatus("success");
      formEl.reset();

      onSuccess?.({ date: bookedDate, time: bookedTime });

      // refresh mag blijven
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Er ging iets mis. Probeer opnieuw.");
    }
  }

  return (
    <section
      className="mx-auto mt-5 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h3 className="text-lg font-semibold text-[var(--text)]">Aanvraag versturen</h3>
        <p className="mt-1 text-sm italic text-[var(--text-soft)]">
          {canSend ? (
            <>
              Je kiest: <strong>{date}</strong> om <strong>{time}</strong>
            </>
          ) : (
            "Kies eerst een datum + tijd hierboven."
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-[var(--text)]">Naam *</label>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="Je naam"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">E-mail *</label>
            <input
              name="email"
              type="email"
              required
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="jij@mail.nl"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Telefoon</label>
            <input
              name="phone"
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="06…"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">
              Aantal personen / huisdieren
            </label>
            <input
              name="count"
              type="number"
              min={1}
              inputMode="numeric"
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="Bijv. 3"
            />
          </div>
        </div>

        <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>Ik geef toestemming om contact op te nemen. *</span>
        </label>

        <button
          type="submit"
          disabled={!canSend || status === "sending"}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ background: "var(--accent-strong)" }}
        >
          {status === "sending" ? "Versturen…" : "Verstuur aanvraag"}
        </button>

        {status === "success" ? (
          <div className="rounded-2xl bg-white/60 p-3 text-center text-sm" style={{ border: "1px solid var(--border)" }}>
            ✅ Verstuurd! Ik neem snel contact met je op.
          </div>
        ) : null}

        {status === "error" ? (
          <div className="rounded-2xl bg-white/60 p-3 text-center text-sm text-red-700" style={{ border: "1px solid var(--border)" }}>
            {error ?? "Er ging iets mis."}
          </div>
        ) : null}
      </form>
    </section>
  );
}