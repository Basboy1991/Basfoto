"use client";

import React, { useMemo, useRef, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = Partial<
  Record<"name" | "email" | "message" | "consent" | "form", string>
>;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

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

  // refs for focusing on errors
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const messageRef = useRef<HTMLTextAreaElement | null>(null);
  const consentRef = useRef<HTMLInputElement | null>(null);

  const hasErrors = useMemo(
    () => Boolean(Object.keys(fieldErrors).length) || Boolean(formError),
    [fieldErrors, formError]
  );

  function focusFirstError(errors: FieldErrors) {
    if (errors.name) return nameRef.current?.focus();
    if (errors.email) return emailRef.current?.focus();
    if (errors.message) return messageRef.current?.focus();
    if (errors.consent) return consentRef.current?.focus();
  }

  function validateClient(payload: {
    name: string;
    email: string;
    message: string;
    consent: boolean;
  }) {
    const errors: FieldErrors = {};
    if (!payload.name) errors.name = "Naam is verplicht.";
    if (!payload.email || !isValidEmail(payload.email))
      errors.email = "Vul een geldig e-mailadres in.";
    if (!payload.message || payload.message.trim().length < 5)
      errors.message = "Bericht is te kort (minimaal 5 tekens).";
    if (!payload.consent) errors.consent = "Toestemming is verplicht.";
    return errors;
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

    // client-side validation first (snelle feedback)
    const clientErrors = validateClient({
      name: payload.name,
      email: payload.email,
      message: payload.message,
      consent: payload.consent,
    });

    if (Object.keys(clientErrors).length > 0) {
      setStatus("error");
      setFieldErrors(clientErrors);
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

      const data: any = await res.json().catch(() => null);

      if (!res.ok) {
        // API kan: { ok:false, errors:{...} } of { ok:false, error:"..." }
        const serverFieldErrors: FieldErrors = data?.errors ?? {};
        const msg =
          data?.error ??
          (serverFieldErrors && Object.keys(serverFieldErrors).length
            ? "Controleer de velden en probeer opnieuw."
            : "Er ging iets mis. Probeer het later opnieuw.");

        setStatus("error");
        setFormError(msg);

        if (serverFieldErrors && Object.keys(serverFieldErrors).length) {
          setFieldErrors(serverFieldErrors);
          focusFirstError(serverFieldErrors);
        }
        return;
      }

      setStatus("success");
      formEl.reset();
      setFormError(null);
      setFieldErrors({});
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  const inputBase =
    "mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black/20";
  const errorRing = "ring-2 ring-red-500/40";

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
            {successTitle ?? "Bericht verzonden 🎉"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {successText ??
              "Dankjewel voor je bericht. Ik neem zo snel mogelijk contact met je op."}
          </p>
          <p className="mt-2 text-xs text-[var(--text-soft)]">
            Je hoeft niets meer te doen — ik kom bij je terug.
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
        <form onSubmit={onSubmit} className="grid gap-3" noValidate>
          {/* honeypot */}
          <input
            name="company"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          {status === "error" && (formError || hasErrors) ? (
            <div
              className="rounded-2xl bg-white/60 p-3 text-sm"
              style={{ border: "1px solid var(--border)" }}
              role="alert"
            >
              <p className="font-semibold text-red-700">
                {formError ?? "Controleer de velden en probeer opnieuw."}
              </p>
              {!formError && hasErrors ? (
                <p className="mt-1 text-xs text-[var(--text-soft)]">
                  Tip: velden met een rode rand hebben extra aandacht nodig.
                </p>
              ) : null}
            </div>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-[var(--text)]">Naam *</label>
              <input
                ref={nameRef}
                name="name"
                required
                aria-invalid={Boolean(fieldErrors.name)}
                aria-describedby={fieldErrors.name ? "err-name" : undefined}
                className={`${inputBase} ${fieldErrors.name ? errorRing : ""}`}
                style={{ border: "1px solid var(--border)" }}
                placeholder="Je naam"
              />
              {fieldErrors.name ? (
                <p id="err-name" className="mt-1 text-xs text-red-700">
                  {fieldErrors.name}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">E-mail *</label>
              <input
                ref={emailRef}
                name="email"
                type="email"
                required
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? "err-email" : undefined}
                className={`${inputBase} ${fieldErrors.email ? errorRing : ""}`}
                style={{ border: "1px solid var(--border)" }}
                placeholder="jij@mail.nl"
              />
              {fieldErrors.email ? (
                <p id="err-email" className="mt-1 text-xs text-red-700">
                  {fieldErrors.email}
                </p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Telefoon</label>
              <input
                name="phone"
                className={inputBase}
                style={{ border: "1px solid var(--border)" }}
                placeholder="06…"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Onderwerp</label>
              <input
                name="subject"
                className={inputBase}
                style={{ border: "1px solid var(--border)" }}
                placeholder="Bijv. gezinsshoot"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Bericht *</label>
            <textarea
              ref={messageRef}
              name="message"
              required
              rows={5}
              aria-invalid={Boolean(fieldErrors.message)}
              aria-describedby={fieldErrors.message ? "err-message" : "hint-message"}
              className={`${inputBase} ${fieldErrors.message ? errorRing : ""}`}
              style={{ border: "1px solid var(--border)" }}
              placeholder="Vertel kort wat je in gedachten hebt (datum, locatie of wensen)…"
            />
            {fieldErrors.message ? (
              <p id="err-message" className="mt-1 text-xs text-red-700">
                {fieldErrors.message}
              </p>
            ) : (
              <p id="hint-message" className="mt-2 text-xs text-[var(--text-soft)]">
                Twijfel je nog? Bekijk eerst de{" "}
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
              className={inputBase}
              style={{ border: "1px solid var(--border)" }}
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefoon</option>
            </select>
          </div>

          <div>
            <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
              <input
                ref={consentRef}
                type="checkbox"
                name="consent"
                required
                aria-invalid={Boolean(fieldErrors.consent)}
                aria-describedby={fieldErrors.consent ? "err-consent" : undefined}
                className={`mt-1 ${fieldErrors.consent ? "outline outline-2 outline-red-500/40" : ""}`}
              />
              <span>Ik geef toestemming om contact op te nemen. *</span>
            </label>
            {fieldErrors.consent ? (
              <p id="err-consent" className="mt-1 text-xs text-red-700">
                {fieldErrors.consent}
              </p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={status === "sending"}
            className="mt-2 inline-flex w-full items-center justify-center rounded-full px-7 py-4 text-sm font-semibold text-white transition disabled:opacity-60"
            style={{ background: "var(--accent-strong)" }}
          >
            {status === "sending" ? "Versturen…" : "Verstuur bericht"}
          </button>

          <p className="text-center text-xs text-[var(--text-soft)]">
            Door te versturen ga je akkoord dat ik je mag terugmailen/bellen/appen over je aanvraag.
          </p>
        </form>
      )}
    </section>
  );
}