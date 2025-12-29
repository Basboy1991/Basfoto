"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = Partial<
  Record<
    "name" | "email" | "message" | "consent" | "phone" | "subject" | "preferredContact",
    string
  >
>;

type ApiErrorResponse = {
  ok: false;
  error?: string;
  errors?: Record<string, string>;
};

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

  const formRef = useRef<HTMLFormElement | null>(null);

  const hasErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors]);

  function clearErrors() {
    setFormError(null);
    setFieldErrors({});
  }

  function focusFirstError(errors: FieldErrors) {
    if (!formRef.current) return;
    const order: (keyof FieldErrors)[] = ["name", "email", "message", "consent"];
    const firstKey = order.find((k) => errors[k]);
    if (!firstKey) return;

    const el = formRef.current.querySelector<HTMLElement>(`[name="${firstKey}"]`);
    el?.focus?.();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    setStatus("sending");
    clearErrors();

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

    // ✅ client-side basics (sneller feedback)
    const clientErrors: FieldErrors = {};
    if (!payload.name) clientErrors.name = "Naam is verplicht.";
    if (!payload.email) clientErrors.email = "E-mail is verplicht.";
    if (!payload.message) clientErrors.message = "Bericht is verplicht.";
    if (!payload.consent) clientErrors.consent = "Toestemming is verplicht.";

    if (Object.keys(clientErrors).length) {
      setStatus("error");
      setFieldErrors(clientErrors);
      setFormError("Controleer de velden hieronder.");
      focusFirstError(clientErrors);
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as ApiErrorResponse | any;

      if (!res.ok) {
        // ✅ server-side field errors (jouw API geeft dit terug)
        const serverFieldErrors: FieldErrors = data?.errors ?? {};
        if (serverFieldErrors && Object.keys(serverFieldErrors).length) {
          setFieldErrors(serverFieldErrors);
          setFormError("Controleer de velden hieronder.");
          setStatus("error");
          focusFirstError(serverFieldErrors);
          return;
        }

        const msg = data?.error ?? "Er ging iets mis. Probeer opnieuw.";
        throw new Error(msg);
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Er ging iets mis. Probeer opnieuw.");
    }
  }

  const inputBase =
    "mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-black/10";

  function inputStyle(hasFieldError?: boolean) {
    return {
      border: hasFieldError ? "1px solid rgba(220,38,38,.55)" : "1px solid var(--border)",
    } as React.CSSProperties;
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
          role="status"
          aria-live="polite"
        >
          <p className="text-lg font-semibold text-[var(--text)]">
            {successTitle ?? "Gelukt! 🎉"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {successText ?? "Dankjewel voor je bericht. Ik neem snel contact met je op."}
          </p>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => {
                setStatus("idle");
                clearErrors();
              }}
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
              style={{ border: "1px solid var(--border)", color: "var(--text)" }}
            >
              Nieuw bericht sturen
            </button>

            <Link
              href="/faq"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white"
              style={{ background: "var(--accent-strong)" }}
            >
              Bekijk veelgestelde vragen
            </Link>
          </div>
        </div>
      ) : (
        <>
          <form ref={formRef} onSubmit={onSubmit} className="grid gap-3" noValidate>
            {/* honeypot */}
            <input
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {/* Top error */}
            {status === "error" && formError ? (
              <div
                className="rounded-2xl bg-white/60 p-3 text-sm"
                style={{ border: "1px solid rgba(220,38,38,.25)" }}
                role="alert"
                aria-live="polite"
              >
                <p className="font-semibold text-red-700">Oeps…</p>
                <p className="mt-1 text-red-700">{formError}</p>
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium text-[var(--text)]" htmlFor="name">
                  Naam <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  disabled={status === "sending"}
                  className={inputBase}
                  style={inputStyle(!!fieldErrors.name)}
                  placeholder="Je naam"
                  aria-invalid={!!fieldErrors.name}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name ? (
                  <p id="name-error" className="mt-2 text-xs text-red-700">
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)]" htmlFor="email">
                  E-mail <span className="text-red-600">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={status === "sending"}
                  className={inputBase}
                  style={inputStyle(!!fieldErrors.email)}
                  placeholder="jij@mail.nl"
                  aria-invalid={!!fieldErrors.email}
                  aria-describedby={fieldErrors.email ? "email-error" : undefined}
                />
                {fieldErrors.email ? (
                  <p id="email-error" className="mt-2 text-xs text-red-700">
                    {fieldErrors.email}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)]" htmlFor="phone">
                  Telefoon
                </label>
                <input
                  id="phone"
                  name="phone"
                  disabled={status === "sending"}
                  className={inputBase}
                  style={inputStyle(!!fieldErrors.phone)}
                  placeholder="06…"
                  aria-invalid={!!fieldErrors.phone}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)]" htmlFor="subject">
                  Onderwerp
                </label>
                <input
                  id="subject"
                  name="subject"
                  disabled={status === "sending"}
                  className={inputBase}
                  style={inputStyle(!!fieldErrors.subject)}
                  placeholder="Bijv. gezinsshoot"
                  aria-invalid={!!fieldErrors.subject}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]" htmlFor="message">
                Bericht <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                disabled={status === "sending"}
                className={inputBase}
                style={inputStyle(!!fieldErrors.message)}
                placeholder="Vertel kort wat je zoekt (datum/locatie/wensen)…"
                aria-invalid={!!fieldErrors.message}
                aria-describedby={fieldErrors.message ? "message-error" : "message-hint"}
              />
              {fieldErrors.message ? (
                <p id="message-error" className="mt-2 text-xs text-red-700">
                  {fieldErrors.message}
                </p>
              ) : (
                <p id="message-hint" className="mt-2 text-xs text-[var(--text-soft)]">
                  Tip: kijk ook even bij de{" "}
                  <Link href="/faq" className="underline underline-offset-4">
                    veelgestelde vragen
                  </Link>{" "}
                  — daar staan al veel antwoorden.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]" htmlFor="preferredContact">
                Voorkeur
              </label>
              <select
                id="preferredContact"
                name="preferredContact"
                defaultValue="whatsapp"
                disabled={status === "sending"}
                className={inputBase}
                style={{ border: "1px solid var(--border)" }}
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="email">E-mail</option>
                <option value="phone">Telefoon</option>
              </select>
            </div>

            <label
              className="flex items-start gap-3 rounded-2xl bg-white/50 p-4 text-sm text-[var(--text-soft)]"
              style={inputStyle(!!fieldErrors.consent)}
            >
              <input
                type="checkbox"
                name="consent"
                required
                disabled={status === "sending"}
                className="mt-1"
                aria-invalid={!!fieldErrors.consent}
              />
              <span>
                Ik geef toestemming om contact op te nemen.{" "}
                <span className="text-red-600">*</span>
                {fieldErrors.consent ? (
                  <span className="mt-2 block text-xs text-red-700">
                    {fieldErrors.consent}
                  </span>
                ) : null}
              </span>
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-1 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition disabled:opacity-60"
              style={{ background: "var(--accent-strong)" }}
            >
              {status === "sending" ? "Versturen…" : "Verstuur bericht"}
            </button>

            {/* kleine “sending” hint */}
            {status === "sending" ? (
              <p className="text-center text-xs text-[var(--text-soft)]" aria-live="polite">
                Even geduld… je bericht wordt verstuurd.
              </p>
            ) : null}

            {/* fallback: als er errors zijn maar geen banner */}
            {hasErrors && status !== "sending" && status !== "success" && !formError ? (
              <p className="text-center text-xs text-[var(--text-soft)]">
                Controleer de velden met een rode rand.
              </p>
            ) : null}
          </form>
        </>
      )}
    </section>
  );
}