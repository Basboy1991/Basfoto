"use client";

import { useMemo, useState } from "react";

type Status = "idle" | "sending" | "success" | "error";

type FieldErrors = Partial<
  Record<
    "name" | "email" | "phone" | "subject" | "message" | "preferredContact" | "consent",
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

  function clearErrors() {
    setFormError(null);
    setFieldErrors({});
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

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify(payload),
      });

      const data = (await res.json().catch(() => null)) as any;

      if (!res.ok) {
        // 400: veld errors
        if (data?.errors && typeof data.errors === "object") {
          setFieldErrors(data.errors as FieldErrors);
          setStatus("error");
          setFormError("Controleer je invoer en probeer opnieuw.");
          return;
        }

        setStatus("error");
        setFormError(data?.error ?? "Er ging iets mis. Probeer het later opnieuw.");
        return;
      }

      setStatus("success");
      formEl.reset();
    } catch (err: any) {
      setStatus("error");
      setFormError(err?.message ?? "Er ging iets mis. Probeer het later opnieuw.");
    }
  }

  const inputBase =
    "mt-2 w-full rounded-2xl bg-white/70 px-4 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-black/30";
  const borderBase = { border: "1px solid var(--border)" } as const;

  function fieldStyle(name: keyof FieldErrors) {
    return fieldErrors[name]
      ? { border: "1px solid rgba(220,38,38,.6)" } // rood randje bij error
      : borderBase;
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
            {successTitle ?? "Bericht verzonden 🎉"}
          </p>
          <p className="mt-2 text-sm text-[var(--text-soft)]">
            {successText ?? "Dankjewel voor je bericht. Ik neem zo snel mogelijk contact met je op."}
          </p>

          <button
            type="button"
            onClick={() => {
              setStatus("idle");
              clearErrors();
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

          {/* algemene fout */}
          {status === "error" && formError ? (
            <div
              className="rounded-2xl bg-white/60 p-3 text-sm text-red-700"
              style={{ border: "1px solid var(--border)" }}
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
                className={inputBase}
                style={fieldStyle("name")}
                placeholder="Je naam"
                onChange={() => fieldErrors.name && setFieldErrors((p) => ({ ...p, name: undefined }))}
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-xs text-red-700">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">E-mail *</label>
              <input
                name="email"
                type="email"
                required
                className={inputBase}
                style={fieldStyle("email")}
                placeholder="jij@mail.nl"
                onChange={() => fieldErrors.email && setFieldErrors((p) => ({ ...p, email: undefined }))}
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-xs text-red-700">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Telefoon</label>
              <input
                name="phone"
                className={inputBase}
                style={fieldStyle("phone")}
                placeholder="06…"
                onChange={() => fieldErrors.phone && setFieldErrors((p) => ({ ...p, phone: undefined }))}
              />
              {fieldErrors.phone ? (
                <p className="mt-1 text-xs text-red-700">{fieldErrors.phone}</p>
              ) : null}
            </div>

            <div>
              <label className="text-sm font-medium text-[var(--text)]">Onderwerp</label>
              <input
                name="subject"
                className={inputBase}
                style={fieldStyle("subject")}
                placeholder="Bijv. gezinsshoot"
                onChange={() =>
                  fieldErrors.subject && setFieldErrors((p) => ({ ...p, subject: undefined }))
                }
              />
              {fieldErrors.subject ? (
                <p className="mt-1 text-xs text-red-700">{fieldErrors.subject}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Bericht *</label>
            <textarea
              name="message"
              required
              rows={5}
              className={inputBase}
              style={fieldStyle("message")}
              placeholder="Vertel kort wat je zoekt (datum/locatie/wensen)…"
              onChange={() =>
                fieldErrors.message && setFieldErrors((p) => ({ ...p, message: undefined }))
              }
            />
            {fieldErrors.message ? (
              <p className="mt-1 text-xs text-red-700">{fieldErrors.message}</p>
            ) : null}

            <p className="mt-2 text-xs text-[var(--text-soft)]">
              Tip: kijk ook even bij de{" "}
              <a href="/faq" className="underline underline-offset-4">
                veelgestelde vragen
              </a>
              .
            </p>
          </div>

          <div>
            <label className="text-sm font-medium text-[var(--text)]">Voorkeur</label>
            <select
              name="preferredContact"
              defaultValue="whatsapp"
              className={inputBase}
              style={fieldStyle("preferredContact")}
              onChange={() =>
                fieldErrors.preferredContact &&
                setFieldErrors((p) => ({ ...p, preferredContact: undefined }))
              }
            >
              <option value="whatsapp">WhatsApp</option>
              <option value="email">E-mail</option>
              <option value="phone">Telefoon</option>
            </select>
            {fieldErrors.preferredContact ? (
              <p className="mt-1 text-xs text-red-700">{fieldErrors.preferredContact}</p>
            ) : null}
          </div>

          <label className="flex items-start gap-3 text-sm text-[var(--text-soft)]">
            <input
              type="checkbox"
              name="consent"
              required
              className="mt-1"
              onChange={() => fieldErrors.consent && setFieldErrors((p) => ({ ...p, consent: undefined }))}
            />
            <span>Ik geef toestemming om contact op te nemen. *</span>
          </label>
          {fieldErrors.consent ? (
            <p className="-mt-2 text-xs text-red-700">{fieldErrors.consent}</p>
          ) : null}

          {/* microcopy als er errors zijn maar geen banner (bijv alleen veld errors) */}
          {hasErrors && status !== "sending" && !formError ? (
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