export default function Spinner({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-ink-soft">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label && <span className="text-sm">{label}</span>}
    </div>
  );
}
