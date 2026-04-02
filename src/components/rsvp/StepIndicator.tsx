export default function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i + 1 === current ? 20 : 8,
            height: 8,
            backgroundColor: i + 1 === current ? '#722F37' : i + 1 < current ? '#C5A258' : '#e8d5c4',
          }}
        />
      ))}
    </div>
  )
}
