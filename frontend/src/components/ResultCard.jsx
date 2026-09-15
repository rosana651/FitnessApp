export default function ResultCard({
  title,
  value,
  type = "default",
}) {
  const styles = {
    default:
      "border-white/10 bg-white/[0.025]",
    success:
      "border-emerald-400/10 bg-emerald-500/[0.05]",
    danger:
      "border-red-400/10 bg-red-500/[0.05]",
    warning:
      "border-amber-400/10 bg-amber-500/[0.05]",
  };

  const valueStyles = {
    default: "text-white",
    success: "text-emerald-400",
    danger: "text-red-400",
    warning: "text-amber-400",
  };

  return (
    <div
      className={`rounded-3xl border p-6 ${styles[type]}`}
    >
      <p className="text-xs font-medium uppercase tracking-[0.15em] text-slate-500">
        {title}
      </p>

      <p
        className={`mt-3 text-3xl font-bold ${valueStyles[type]}`}
      >
        {value}
      </p>
    </div>
  );
}