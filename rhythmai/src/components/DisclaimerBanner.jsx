export default function DisclaimerBanner({ children }) {
  return (
    <div className="rounded-xl border border-clay-400/40 bg-clay-400/10 px-4 py-3 text-sm text-clay-500 flex gap-2">
      <span aria-hidden>⚕️</span>
      <p>{children}</p>
    </div>
  )
}
