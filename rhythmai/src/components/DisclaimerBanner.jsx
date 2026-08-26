export default function DisclaimerBanner({ children }) {
  return (
    <div className="rounded-xl border border-warn/40 bg-warnSoft px-4 py-3 text-sm text-warn flex gap-2">
      <span aria-hidden>⚕️</span>
      <p>{children}</p>
    </div>
  )
}
