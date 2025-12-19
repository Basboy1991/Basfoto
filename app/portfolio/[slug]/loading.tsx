export default function Loading() {
  return (
    <div className="py-16">
      <div className="h-6 w-40 rounded bg-[var(--surface-2)]" />
      <div className="mt-4 h-10 w-2/3 rounded bg-[var(--surface-2)]" />
      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[4/5] rounded-2xl bg-[var(--surface-2)]"
            style={{ border: "1px solid var(--border)" }}
          />
        ))}
      </div>
    </div>
  );
}
