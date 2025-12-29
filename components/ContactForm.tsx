"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({
  successTitle,
  successText,
}: {
  successTitle?: string;
  successText?: string;
}) {
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
      subject: String(form.get("subject") ?? "").trim(),
      message: String(form.get("message") ?? "").trim(),
      preferredContact: String(form.get("preferredContact") ?? "whatsapp"),
      consent: form.get("consent") === "on",
      company: String(form.get("company") ?? "").trim(), // honeypot
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.error ?? "Er ging iets mis. Probeer het later opnieuw."
        );
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setError(err.message);
    }
  }

  return (
    <section
      className="rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
      style={{ border: "1px solid var(--border)" }}
    >
      {status === "success" ? (
        <div
          className="rounded-2xl bg-white/60 p-5 text-center"
          style={{ border: "1px solid var(--border)" }}
        >
          <p className="text-lg font-semibold text-[var(--text)]">
            {successTitle ?? "Bericht verzonden 🎉"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {successText ??
              "Dankjewel voor je bericht. Ik neem zo snel mogelijk contact met je op."}
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setError(null);
            }}
            className="mt-5 inline-flex rounded-full px-6 py-3 text-sm font-semibold"
            style={{ border: "1px solid var(--border)", color: "var(--text)" }}
          >
            Nieuw bericht sturen
          </button>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="grid gap-3">
          {/* honeypot */}
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {status === "error" && error ? (
            <div
              className="rounded-2xl bg-white/60 p-3 text-sm text-red-700"
              style={{ border: "1px solid var(--border)" }}
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[var(--text)]">
                Naam *
              </label>
              <input
                name="name"
                required
                className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">
                E-mail *
              </label>
              <input
                name="email"
                type="email"
                required
                className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">
                Telefoon
              </label>
              <input
                name="phone"
                className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">
                Onderwerp
              </label>
              <input
                name="subject"
                className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
                style={{ border: "1px solid var(--border)" }}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">
              Bericht *
            </label>
            <textarea
              name="message"
              required
              rows={5}
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
            />
            <p className="mt-2 text-xs text-[var(--text-soft)]">
              Tip: bekijk ook de{" "}
              <a href="/faq" className="underline underline-offset-4">
                veelgestelde vragen
              </a>
              .
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">
              Voorkeur
            </label>
            <select
              name="preferredContact"
              defaultValue="whatsapp"
              className="mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefoon</option>
            </select>
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
            <input type="checkbox" name="consent" required className="mt-1" />
            <span>Ik geef toestemming om contact op te nemen. *</span>
          </label>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full px-7 py-4