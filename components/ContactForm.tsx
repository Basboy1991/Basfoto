// components/ContactForm.tsx
"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    setStatus("sending");
    setError(null);

    const form = new FormData(formEl);

    const payload = {
      name: String(form.get("name") ?? "").trim(),
      email: String(form.get("email") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      preferredContact: String(form.get("preferredContact") ?? "whatsapp"),
      message: String(form.get("message") ?? "").trim(),
      consent: form.get("consent") === "on",

      // honeypot
      company: String(form.get("company") ?? "").trim(),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg =
          data?.errors
            ? Object.values(data.errors).join(" ")
            : data?.error ?? "Er ging iets mis. Probeer opnieuw.";
        throw new Error(msg);
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Er ging iets mis. Probeer opnieuw.");
    }
  }

  return (
    <section
      className="rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h2 className="text-lg font-semibold text-[var(--text)]">Stuur een bericht</h2>
        <p className="mt-1 text-sm italic text-[var(--text-soft)]">
          Ik reageer meestal dezelfde dag.
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-5 grid gap-3">
        {/* Honeypot */}
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-[var(--text)]">Naam *</label>
            <input
              name="name"
              required
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="Je naam"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
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

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-[var(--text)]">Telefoon</label>
            <input
              name="phone"
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              placeholder="06…"
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <label className="text-sm font-medium text-[var(--text)]">Voorkeur contact</label>
            <select
              name="preferredContact"
              defaultValue="whatsapp"
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="phone">Bellen</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-[var(--text)]">Bericht *</label>
          <textarea
            name="message"
            rows={4}
            required
            className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
            style={{ border: "1px solid var(--border)" }}
            placeholder="Waar kan ik je mee helpen?"
          />
        </div>

        <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
          <input type="checkbox" name="consent" required className="mt-1" />
          <span>Ik geef toestemming om contact op te nemen. *</span>
        </label>

        <button
          type="submit"
          disabled={status === "sending"}
          className="mt-1 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition disabled:opacity-60"
          style={{ background: "var(--accent-strong)" }}
        >
          {status === "sending" ? "Versturen…" : "Verstuur bericht"}
        </button>

        {status === "success" ? (
          <div
            className="rounded-2xl bg-white/60 p-3 text-center text-sm"
            style={{ border: "1px solid var(--border)" }}
          >
            ✅ Verstuurd! Ik neem snel contact met je op.
          </div>
        ) : null}

        {status === "error" ? (
          <div
            className="rounded-2xl bg-white/60 p-3 text-center text-sm text-red-700"
            style={{ border: "1px solid var(--border)" }}
          >
            {error ?? "Er ging iets mis."}
          </div>
        ) : null}
      </form>
    </section>
  );
}