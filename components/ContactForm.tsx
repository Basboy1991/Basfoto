"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = Partial<
  Record<
    "name" | "email" | "phone" | "subject" | "message" | "consent" | "preferredContact",
    string
  >
>;

export default function ContactForm({
  successTitle,
  successText,
}: {
  successTitle?: string;
  successText?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const hasErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors]);

  function inputClass(hasFieldError?: boolean) {
    return [
      "mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none transition",
      hasFieldError ? "ring-2 ring-red-500/60" : "focus-visible:ring-2 focus-visible:ring-black/20",
    ].join(" ");
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    setStatus("sending");
    setFormError(null);
    setFieldErrors({});

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
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        // 400: veldfouten
        if (res.status === 400 && data?.errors) {
          setFieldErrors(data.errors as FieldErrors);
          setStatus("error");
          setFormError("Controleer de gemarkeerde velden.");
          return;
        }

        // fallback
        throw new Error(data?.error ?? "Er ging iets mis. Probeer het later opnieuw.");
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  return (
    <section
      className="rounded-3xl bg-[var(--surface-2)] p-5 md:p-6"
      style={{ border: "1px solid var(--border)" }}
    >
      {status === "success" ? (
        <div
          className="rounded-2xl bg-white/60 p-6 text-center"
          style={{ border: "1px solid var(--border)" }}
          role="status"
          aria-live="polite"
        >
          <p className="text-lg font-semibold text-[var(--text)]">
            {successTitle ?? "Bericht verzonden 🎉"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {successText ?? "Dankjewel! Ik neem zo snel mogelijk contact met je op."}
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              setFormError(null);
              setFieldErrors({});
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

          {/* form error banner */}
          {status === "error" && formError ? (
            <div
              className="rounded-2xl bg-white/60 p-3 text-sm"
              style={{ border: "1px solid var(--border)", color: "rgb(185 28 28)" }}
              role="alert"
            >
              {formError}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[var(--text)]">Naam *</label>
              <input
                name="name"
                required
                className={inputClass(!!fieldErrors.name)}
                style={{ border: "1px solid var(--border)" }}
                placeholder="Je naam"
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "err-name" : undefined}
              />
              {fieldErrors.name ? (
                <p id="err-name" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">E-mail *</label>
              <input
                name="email"
                type="email"
                required
                className={inputClass(!!fieldErrors.email)}
                style={{ border: "1px solid var(--border)" }}
                placeholder="jij@mail.nl"
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "err-email" : undefined}
              />
              {fieldErrors.email ? (
                <p id="err-email" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Telefoon</label>
              <input
                name="phone"
                className={inputClass(!!fieldErrors.phone)}
                style={{ border: "1px solid var(--border)" }}
                placeholder="06…"
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
              />
              {fieldErrors.phone ? (
                <p id="err-phone" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                  {fieldErrors.phone}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Onderwerp</label>
              <input
                name="subject"
                className={inputClass(!!fieldErrors.subject)}
                style={{ border: "1px solid var(--border)" }}
                placeholder="Bijv. gezinsshoot"
                aria-invalid={!!fieldErrors.subject}
                aria-describedby={fieldErrors.subject ? "err-subject" : undefined}
              />
              {fieldErrors.subject ? (
                <p id="err-subject" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                  {fieldErrors.subject}
                </p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Bericht *</label>
            <textarea
              name="message"
              required
              rows={5}
              className={inputClass(!!fieldErrors.message)}
              style={{ border: "1px solid var(--border)" }}
              placeholder="Vertel kort wat je zoekt (datum/locatie/wensen)…"
              aria-invalid={!!fieldErrors.message}
              aria-describedby={fieldErrors.message ? "err-message" : "hint-faq"}
            />
            {fieldErrors.message ? (
              <p id="err-message" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                {fieldErrors.message}
              </p>
            ) : (
              <p id="hint-faq" className="mt-2 text-xs text-[var(--text-soft)]">
                Tip: kijk ook even bij de{" "}
                <a href="/faq" className="underline underline-offset-4">
                  veelgestelde vragen
                </a>
                .
              </p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Voorkeur</label>
            <select
              name="preferredContact"
              defaultValue="whatsapp"
              className={inputClass(!!fieldErrors.preferredContact)}
              style={{ border: "1px solid var(--border)" }}
              aria-invalid={!!fieldErrors.preferredContact}
              aria-describedby={fieldErrors.preferredContact ? "err-preferred" : undefined}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefoon</option>
            </select>
            {fieldErrors.preferredContact ? (
              <p id="err-preferred" className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                {fieldErrors.preferredContact}
              </p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
            <input
              type="checkbox"
              name="consent"
              required
              className={fieldErrors.consent ? "mt-1 ring-2 ring-red-500/60" : "mt-1"}
              aria-invalid={!!fieldErrors.consent}
              aria-describedby={fieldErrors.consent ? "err-consent" : undefined}
            />
            <span>Ik geef toestemming om contact op te nemen. *</span>
          </label>
          {fieldErrors.consent ? (
            <p id="err-consent" className="-mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
              {fieldErrors.consent}
            </p>
          ) : null}

          {/* fallback microcopy */}
          {hasErrors && status !== "sending" && status !== "success" && !formError ? (
            <p className="text-center text-xs text-[var(--text-soft)]">
              Controleer de velden met een rode rand.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--accent-strong)" }}
          >
            {status === "sending" ? "Versturen…" : "Verstuur bericht"}
          </button>
        </form>
      )}
    </section>
  );
}