"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "subject" | "message" | "consent", string>
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

  const hasErrors = useMemo(() => Object.keys(fieldErrors).length > 0, [fieldErrors]);

  function validate(payload: any) {
    const errors: FieldErrors = {};

    if (!payload.name) errors.name = "Naam is verplicht.";
    if (!payload.email || !isValidEmail(payload.email))
      errors.email = "Vul een geldig e-mailadres in.";
    if (!payload.message || payload.message.length < 5)
      errors.message = "Bericht is te kort.";
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

    const localErrors = validate(payload);
    if (Object.keys(localErrors).length) {
      setStatus("error");
      setFieldErrors(localErrors);
      setFormError("Controleer de velden met een rode rand.");
      return;
    }

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const apiErrors: FieldErrors | undefined = data?.errors;
        if (apiErrors && typeof apiErrors === "object") {
          setFieldErrors(apiErrors);
          setFormError("Controleer de velden met een rode rand.");
        } else {
          setFormError(data?.error ?? "Er ging iets mis. Probeer opnieuw.");
        }
        setStatus("error");
        return;
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Er ging iets mis. Probeer opnieuw.");
    }
  }

  const inputBase =
    "mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none";
  const borderOk = { border: "1px solid var(--border)" } as const;
  const borderBad = { border: "1px solid rgba(220, 38, 38, .55)" } as const;

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
        <>
          <form onSubmit={onSubmit} className="grid gap-3" noValidate>
            {/* honeypot */}
            <input
              name="company"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden="true"
            />

            {formError ? (
              <div
                className="rounded-2xl bg-white/60 p-3 text-center text-sm"
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
                  className={inputBase}
                  style={fieldErrors.name ? borderBad : borderOk}
                  placeholder="Je naam"
                  aria-invalid={!!fieldErrors.name}
                />
                {fieldErrors.name ? (
                  <p className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>
                    {fieldErrors.name}
                  </p>
                ) : null}
              </div>

              <div>
                <label className="text-sm font-medium text-[var(--text)]">E-mail *</label>
                <input
                  name="email"
                  type="email"
                  className={inputBase}
                  style={fieldErrors.email ? borderBad : borderOk}
                  placeholder="jij@mail.nl"
                  aria-invalid={!!fieldErrors.email}
                />
                {fieldErrors.email ? (
                  <p className="mt-1 text-xs" style={{ color: "rgb(185 28 28)" }}>