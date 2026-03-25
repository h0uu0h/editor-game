import { useGame } from '../context/GameContext'

const TIER_NAMES = { 1: '普通', 2: '优质', 3: '重磅' }
const TIER_COLORS = { 1: '#8A8477', 2: '#C4922A', 3: '#E83535' }

export default function PublishModal() {
  const { modal, closeModal } = useGame()
  if (!modal) return null

  const tier = modal.tier || 1
  const stars = '⭐'.repeat(tier)

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header" style={tier >= 3 ? { background: '#E83535' } : {}}>
          {tier >= 3 ? '🔥 号 外 · 重 磅 发 布' : '号 外 · 交 付 成 功'}
        </div>
        <div className="modal-body">
          <div className="modal-grade">
            <span className="grade-icon">{tier >= 3 ? '🏆' : tier >= 2 ? '📰' : '📄'}</span>
            <span className="grade-name">{modal.title}</span>
            <div style={{ marginTop: 4 }}>{stars}</div>
            <div style={{ fontSize: 11, color: TIER_COLORS[tier], marginTop: 2, fontWeight: 500 }}>
              {TIER_NAMES[tier]}报道
            </div>
          </div>
          <div className="modal-stats">
            <div className="modal-stat">
              <span className="ms-num" style={{ color: '#185FA5' }}>+{modal.rep}</span>
              <span className="ms-label">声望</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num" style={{ color: '#C4922A' }}>+{modal.coins}</span>
              <span className="ms-label">代币</span>
            </div>
            <div className="modal-stat">
              <span className="ms-num" style={{ color: '#E83535' }}>{modal.published}</span>
              <span className="ms-label">累计发布</span>
            </div>
          </div>
          <button className="btn-modal" onClick={closeModal}>继 续 办 报</button>
        </div>
      </div>
    </div>
  )
}
