import { useGame } from '../context/GameContext'

export default function Toasts() {
  const { toasts } = useGame()

  return (
    <div className="toast-area">
      {toasts.map(t => (
        <div key={t.id} className="toast">{t.text}</div>
      ))}
    </div>
  )
}
