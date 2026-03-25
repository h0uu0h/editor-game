import { useGame } from '../context/GameContext'
import { useLevel } from '../context/LevelContext'
import { TYPE_STYLES, TOPICS } from '../constants/gameData'

export default function TopBar({ onStoryClick }) {
  const { coins, reputation, published, specialization, combo } = useGame()
  const { totalStars } = useLevel()

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h1>腾讯新闻编辑部</h1>
        <span className="subtitle">TENCENT NEWSROOM</span>
      </div>
      <div className="stats">
        {combo > 1 && <div className="combo-badge">Combo ×{combo}</div>}
        <div className="stat"><span>🏆</span><span className="stat-num">{reputation}</span></div>
        <div className="stat"><span>💰</span><span className="stat-num">{coins}</span></div>
        <div className="stat"><span>📰</span><span className="stat-num">{published}</span></div>
        <button className="btn-story" onClick={onStoryClick}>
          📋 采访任务 {totalStars > 0 && <span className="story-stars">⭐{totalStars}</span>}
        </button>
        {specialization && (() => {
          const s = TYPE_STYLES[specialization]
          const tp = TOPICS.find(t => t.id === specialization)
          return (
            <span className="spec-badge" style={{ background: s.bg, color: s.tx, border: `1px solid ${s.bd}` }}>
              {tp.label} 专栏
            </span>
          )
        })()}
      </div>
    </div>
  )
}
