import { useState, useCallback, useEffect, useRef } from 'react'
import { useGame } from '../context/GameContext'
import { TOPICS, FORMS, CHAINS, TYPE_STYLES, PAGE_EXPAND_PRICES } from '../constants/gameData'

// ========== AI Interview (开箱体验) ==========
function AIPanel() {
  const { doAI, addToast } = useGame()
  const [cooldown, setCooldown] = useState(null)
  const [rolling, setRolling] = useState(null) // { topicId, headline, items }
  const rollTimer = useRef(null)

  const handleClick = useCallback((topicId) => {
    if (cooldown || rolling) return
    const topic = TOPICS.find(t => t.id === topicId)

    // 开箱动画：先滚动新闻标题
    setRolling({ topicId, phase: 'rolling', headline: '', items: [] })
    let count = 0
    const headlines = topic.headlines
    rollTimer.current = setInterval(() => {
      count++
      setRolling(prev => ({
        ...prev,
        headline: headlines[count % headlines.length],
      }))
      if (count >= 8) {
        clearInterval(rollTimer.current)
        // 实际掉落
        const result = doAI(topicId)
        setRolling({
          topicId,
          phase: 'reveal',
          headline: result.headline,
          items: result.items,
        })
        setTimeout(() => {
          setRolling(null)
          setCooldown(topicId)
          setTimeout(() => setCooldown(null), 2500)
        }, 1800)
      }
    }, 120)
  }, [doAI, cooldown, rolling])

  useEffect(() => () => clearInterval(rollTimer.current), [])

  return (
    <div className="side-section">
      <h4>🤖 AI 采访</h4>
      {rolling && (
        <div className={`ai-rolling ${rolling.phase}`}>
          <div className="ai-rolling-headline">{rolling.headline || '...'}</div>
          {rolling.phase === 'reveal' && (
            <div className="ai-rolling-drops">
              {rolling.items.map((item, i) => (
                <span key={i} className="ai-drop-item">{item.tile.icon}</span>
              ))}
            </div>
          )}
        </div>
      )}
      {TOPICS.map(t => (
        <div
          key={t.id}
          className={`ai-btn${cooldown === t.id ? ' cooldown' : ''}${rolling?.topicId === t.id ? ' active-interview' : ''}`}
          onClick={() => handleClick(t.id)}
        >
          <span className="ai-icon">{t.label.slice(0, 2)}</span>
          <div>
            <div className="ai-label">采访{t.label.slice(2)}记者</div>
            <div className="ai-sub">
              {cooldown === t.id ? '冷却中...' : '获取线索碎片'}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// ========== Breaking News Banner ==========
function BreakingBanner() {
  const { breakingNews, claimBreaking, cells } = useGame()
  const [timeLeft, setTimeLeft] = useState(0)

  useEffect(() => {
    if (!breakingNews) return
    const tick = setInterval(() => {
      const left = Math.max(0, breakingNews.expiresAt - Date.now())
      setTimeLeft(left)
      if (left <= 0) clearInterval(tick)
    }, 200)
    return () => clearInterval(tick)
  }, [breakingNews])

  if (!breakingNews || timeLeft <= 0) return null

  // check if player has the bonus form on board
  const hasBonus = cells.some(c => c && c.type === breakingNews.type && c.form === breakingNews.bonus)

  return (
    <div className="breaking-banner">
      <div className="breaking-text">
        <span className="breaking-dot" />
        {breakingNews.headline}
      </div>
      <div className="breaking-bar">
        <div className="breaking-fill" style={{ width: `${(timeLeft / breakingNews.duration) * 100}%` }} />
      </div>
      <div className="breaking-action">
        <span className="breaking-reward">🏆+{breakingNews.reward.rep} 💰+{breakingNews.reward.coins}</span>
        <button
          className="btn-breaking"
          disabled={!hasBonus}
          onClick={claimBreaking}
        >
          {hasBonus ? '提交报道' : `需要 ${FORMS[breakingNews.bonus]?.icon} ${FORMS[breakingNews.bonus]?.name}`}
        </button>
      </div>
    </div>
  )
}

// ========== Orders ==========
function OrdersPanel() {
  const { orders, cells, fulfillOrder } = useGame()

  const canFulfill = (order) => {
    const available = cells.filter(Boolean).map(c => c.form)
    const needs = [...order.needs]
    for (const n of needs) { const idx = available.indexOf(n); if (idx < 0) return false; available.splice(idx, 1) }
    return true
  }

  const tierLabel = (tier) => tier === 3 ? '🔥' : tier === 2 ? '⭐' : ''

  return (
    <div className="side-section">
      <h4>📋 报道订单</h4>
      {orders.map(o => {
        const ok = canFulfill(o)
        return (
          <div key={o.id} className={`order-card${ok ? ' fulfillable' : ''}`}>
            <div className="order-title">{tierLabel(o.tier)} {o.title}</div>
            <div className="order-needs">
              {o.needs.map((form, i) => (
                <span key={i} className="order-need">
                  {FORMS[form]?.icon} {FORMS[form]?.name}
                </span>
              ))}
            </div>
            <div className="order-reward">
              <span style={{ color: '#185FA5' }}>🏆+{o.reward.rep}</span>
              <span style={{ color: '#C4922A' }}>💰+{o.reward.coins}</span>
            </div>
            <button className="btn-order" disabled={!ok} onClick={() => fulfillOrder(o.id)}>
              {ok ? '交付报道' : '素材不足'}
            </button>
          </div>
        )
      })}
    </div>
  )
}

// ========== Space pressure + unlock ==========
function SpacePanel() {
  const { emptyCount, locked, tryExpand, coins, expandCount, pageDef } = useGame()
  const price = PAGE_EXPAND_PRICES[expandCount] || 5000
  const isFull = emptyCount <= 3

  return (
    <div className={`side-section space-panel${isFull ? ' space-warning' : ''}`}>
      <h4>{isFull ? '⚠️ 版面将满！' : `📐 ${pageDef.name}`}</h4>
      <div className="space-bar-wrap">
        <div className="space-bar">
          <div className="space-fill" style={{ width: `${Math.max(5, 100 - (emptyCount / 30) * 100)}%` }} />
        </div>
        <span className="space-count">余 {emptyCount} 格</span>
      </div>
      {locked.size > 0 && (
        <button className="btn-unlock" onClick={tryExpand}>
          🏠 扩建 ({price} 💰)
        </button>
      )}
    </div>
  )
}

// ========== Chains ==========
function ChainsPanel() {
  const { cells } = useGame()
  return (
    <div className="side-section">
      <h4>🔗 合成链</h4>
      {Object.keys(CHAINS).map(type => {
        const chain = CHAINS[type]
        const s = TYPE_STYLES[type]
        let maxLv = 0
        cells.forEach(c => { if (c && c.type === type && c.lv > maxLv) maxLv = c.lv })
        return (
          <div key={type} style={{ marginBottom: 6 }}>
            <div className="chain-label">{s.label}</div>
            <div className="chain-row">
              {chain.map((c, i) => (
                <span key={c.lv} style={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <div
                    className={`chain-item${c.lv <= maxLv ? ' reached' : ''}${c.lv > maxLv + 1 ? ' locked' : ''}`}
                    title={`${c.name}${c.producer ? ' ✦产出' : ''}`}
                  >
                    {c.icon}
                  </div>
                  {i < chain.length - 1 && <span className="chain-arrow">›</span>}
                </span>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ========== Combined ==========
export default function Sidebar() {
  return (
    <div className="sidebar">
      <BreakingBanner />
      <AIPanel />
      <SpacePanel />
      <OrdersPanel />
      <ChainsPanel />
    </div>
  )
}
