import { useGame } from '../context/GameContext'

export default function Particles() {
  const { particles } = useGame()
  if (!particles.length) return null

  return (
    <div className="particles-layer">
      {particles.map(p => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: p.x,
            top: p.y,
            '--dx': `${p.dx}px`,
            '--dy': `${p.dy}px`,
          }}
        >
          {p.emoji}
        </div>
      ))}
    </div>
  )
}
