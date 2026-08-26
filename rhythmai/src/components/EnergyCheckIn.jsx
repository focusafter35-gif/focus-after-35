const LEVELS = [
  { key: 'low', label: 'منخفضة', emoji: '🌧️' },
  { key: 'medium', label: 'متوسطة', emoji: '⛅' },
  { key: 'high', label: 'عالية', emoji: '☀️' },
]

export default function EnergyCheckIn({ onSelect }) {
  return (
    <div className="card p-5">
      <h2 className="font-semibold mb-3">كيف طاقتك اليوم؟</h2>
      <p className="text-xs text-ink/40 mb-3">سأعدّل يومك بناءً على إجابتك.</p>
      <div className="grid grid-cols-3 gap-2">
        {LEVELS.map((l) => (
          <button
            key={l.key}
            type="button"
            onClick={() => onSelect(l.key)}
            className="rounded-xl border border-black/10 hover:border-sage-400 hover:bg-sage-50 py-4 flex flex-col items-center gap-1 transition-colors"
          >
            <span className="text-2xl">{l.emoji}</span>
            <span className="text-sm">{l.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export { LEVELS }
