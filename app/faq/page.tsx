{/* CTA card */}
<div
  className="mt-12 rounded-2xl bg-[var(--surface-2)] p-6 text-center"
  style={{ border: "1px solid var(--border)" }}
>
  <p className="text-sm text-[var(--text-soft)]">
    Staat je vraag er niet tussen?
  </p>

  <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
    <Link
      href="/contact"
      className="btn btn-primary px-6 py-3 text-sm"
    >
      Stel je vraag via contact
    </Link>

    <Link
      href="/boek"
      className="btn btn-secondary px-6 py-3 text-sm"
    >
      Boek direct een shoot
    </Link>
  </div>
</div>