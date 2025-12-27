"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function BookingForm({
  date,
  time,
  timezone,
  onSuccess,
}: {
  date: string | null;
  time: string | null;
  timezone: string;
  onSuccess?: () => void;
}) {
  const router = useRouter();

  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formEl = e.currentTarget;

    setStatus("sending");
    setError(null);

    const form = new FormData(formEl);

    const payload = {
      date: date ?? "",
      time: time ?? "",
      timezone,

      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),

      shootType: String(form.get("shootType") ?? ""),
      location: String(form.get("location") ?? ""),
      message: String(form.get("message") ?? ""),

      preferredContact: String(form.get("preferredContact") ?? "whatsapp"),
      consent: form.get("consent") === "on",

      // honeypot
      company: String(form.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);
      console.log("BOOKING RESPONSE", res.status, data);

      if (!res.ok) {
        const msg = data?.errors
          ? Object.values(data.errors).join(" ")
          : data?.error ?? "Er ging iets mis. Probeer opnieuw.";
        throw new Error(msg);
      }

      setStatus("success");
      formEl.reset();
      onSuccess?.();

      // ✅ Belangrijk: herlaadt server data (boekingRequest query) zodat de tijd verdwijnt
      router.refresh();
    } catch (err: any) {
      setStatus("error");
      setError(err?.message ?? "Er ging iets mis.");
    }
  }

  const canSend = Boolean(date && time);

  return (
    <section
      className="mx-auto mt-8 max-w-4xl rounded-3xl bg-[var(--surface-2)] p-6 md:p-8"
      style={{ border: "1px solid var(--border)" }}
    >
      <div className="text-center">
        <h3 className="text-xl font-semibold text-[var(--text)]">
          Aanvraag versturen
        </h3>
        <p className="mt-2 text-sm italic text-[var(--text-soft)]">
          {canSend ? (
            <>
              Je kiest: <strong>{date}</strong> om <strong>{time}</strong>
            </>
          ) : (
            "Kies eerst een datum + tijd hierboven."
          )}
        </p>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <input
          name="company"
          tabIndex={-1}
          autoComplete="off"
          className="hidden"
          aria-hidden="true"
        />

        {/* ... rest van je form blijft hetzelfde ... */}
      </form>
    </section>
  );
}