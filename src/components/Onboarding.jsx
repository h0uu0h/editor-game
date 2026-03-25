import { useState, useEffect, useCallback, useRef } from 'react'

const STEPS = [
  {
    title: '欢迎来到编辑部！',
    desc: '你是腾讯新闻的实习编辑，你的任务是收集线索、合成稿件、打造属于自己的新闻王国。',
    icon: '📰',
    target: null,
  },
  {
    title: '这是你的编辑桌',
    desc: '桌上散落着各种线索碎片。相同类型、相同等级的碎片如果相邻，就可以合成升级！',
    icon: '🗂️',
    target: '.board-area',
  },
  {
    title: '拖拽合成',
    desc: '试试把同类碎片拖到一起 —— 3 个相邻的同类碎片合成为更高级的素材。5 个一起合还能出 2 个！',
    icon: '👆',
    target: '.grid',
  },
  {
    title: '碎片等级链',
    desc: '📎线索 → 📝笔记 → 💡选题 → 💻稿件 → 🖥️专栏 … Lv8 传奇刊物！Lv4+ 自动产出新碎片。',
    icon: '🔗',
    target: '.grid',
    showChain: true,
  },
  {
    title: '障碍格',
    desc: '有些格子被广告和赞助商占据了，不可使用 —— 合理规划空间！',
    icon: '🚫',
    target: '.cell.obstacle',
  },
  {
    title: 'AI 采访',
    desc: '点击 AI 采访按钮，派记者去各频道收集线索碎片，每次获得 2-3 个！',
    icon: '🤖',
    target: '.side-section:first-child',
  },
  {
    title: '完成订单赚金币',
    desc: '根据订单要求交付素材，赚金币💰和声望🏆。金币扩建版面，声望解锁新版面。',
    icon: '📋',
    target: '.order-card',
  },
  {
    title: '扩建版面',
    desc: '版面快满了？花金币扩建新区域！',
    icon: '🏠',
    target: '.space-panel',
  },
  {
    title: '多页报纸',
    desc: '底部切换不同版面 —— 每个版面有独特合成加成！需金币和声望解锁。',
    icon: '📑',
    target: '.page-tabs',
  },
  {
    title: '采访任务',
    desc: '点击「📋采访任务」挑战关卡 —— 限时、限步、特殊规则，赢取额外奖励！',
    icon: '⭐',
    target: '.btn-story',
  },
  {
    title: '准备好了吗？',
    desc: '试试把桌上那 3 个科技碎片拖到一起合成吧！祝你成为最优秀的编辑 ✨',
    icon: '🚀',
    target: null,
  },
]

// Calculate best tooltip position that fits in viewport
function calcTooltipPos(highlight, tooltipW, tooltipH) {
  if (!highlight) return null
  const vw = window.innerWidth, vh = window.innerHeight
  const gap = 12
  const h = highlight

  // Try each side in priority: right, bottom, left, top
  const candidates = [
    { top: Math.max(gap, Math.min(h.top, vh - tooltipH - gap)), left: h.left + h.width + gap }, // right
    { top: h.top + h.height + gap, left: Math.max(gap, Math.min(h.left, vw - tooltipW - gap)) }, // bottom
    { top: Math.max(gap, Math.min(h.top, vh - tooltipH - gap)), left: h.left - tooltipW - gap }, // left
    { top: h.top - tooltipH - gap, left: Math.max(gap, Math.min(h.left, vw - tooltipW - gap)) }, // top
  ]

  for (const c of candidates) {
    if (c.top >= gap && c.top + tooltipH <= vh - gap && c.left >= gap && c.left + tooltipW <= vw - gap) {
      return c
    }
  }

  // Fallback: center in viewport
  return null
}

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0)
  const [highlight, setHighlight] = useState(null)
  const [tooltipPos, setTooltipPos] = useState(null)
  const tooltipRef = useRef(null)
  const current = STEPS[step]

  // Recalc highlight + tooltip position
  const recalc = useCallback(() => {
    if (!current.target) {
      setHighlight(null)
      setTooltipPos(null)
      return
    }
    const el = document.querySelector(current.target)
    if (!el) { setHighlight(null); setTooltipPos(null); return }

    const rect = el.getBoundingClientRect()
    const pad = 6
    const hl = {
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    }
    setHighlight(hl)

    // Tooltip size — use ref or estimate
    const ttEl = tooltipRef.current
    const ttW = ttEl ? ttEl.offsetWidth : 280
    const ttH = ttEl ? ttEl.offsetHeight : 200
    setTooltipPos(calcTooltipPos(hl, ttW, ttH))
  }, [current.target])

  useEffect(() => { recalc() }, [recalc])

  // Recalc on resize / scroll
  useEffect(() => {
    const handler = () => recalc()
    window.addEventListener('resize', handler)
    window.addEventListener('scroll', handler, true)
    return () => { window.removeEventListener('resize', handler); window.removeEventListener('scroll', handler, true) }
  }, [recalc])

  // After tooltip renders, recalc once more to get accurate size
  useEffect(() => {
    const t = setTimeout(recalc, 50)
    return () => clearTimeout(t)
  }, [step, recalc])

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else onFinish()
  }, [step, onFinish])

  const prev = useCallback(() => { if (step > 0) setStep(step - 1) }, [step])
  const skip = useCallback(() => onFinish(), [onFinish])

  const tooltipStyle = tooltipPos
    ? { position: 'fixed', top: tooltipPos.top, left: tooltipPos.left }
    : { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }

  const isLast = step === STEPS.length - 1

  return (
    <div className="onboarding-overlay">
      {/* Dark mask with cutout */}
      <svg className="onboarding-mask" width="100%" height="100%">
        <defs>
          <mask id="ob-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {highlight && (
              <rect
                x={highlight.left} y={highlight.top}
                width={highlight.width} height={highlight.height}
                rx="8" fill="black"
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(26,26,26,0.65)" mask="url(#ob-mask)" />
      </svg>

      {/* Highlight border */}
      {highlight && (
        <div className="onboarding-highlight" style={{
          top: highlight.top, left: highlight.left,
          width: highlight.width, height: highlight.height,
        }} />
      )}

      {/* Tooltip card */}
      <div className="onboarding-tooltip" style={tooltipStyle} ref={tooltipRef}>
        <div className="ob-icon">{current.icon}</div>
        <div className="ob-title">{current.title}</div>
        <div className="ob-desc">{current.desc}</div>
        {current.showChain && (
          <div className="ob-chain-demo">
            {['📎','→','📝','→','💡','→','💻','→','🖥️','→','🤖','→','🏛️','→','🚀'].map((c, i) => (
              <span key={i} className={c === '→' ? 'ob-chain-arrow' : 'ob-chain-icon'}>{c}</span>
            ))}
          </div>
        )}
        <div className="ob-dots">
          {STEPS.map((_, i) => (
            <span key={i} className={`ob-dot${i === step ? ' active' : i < step ? ' done' : ''}`} />
          ))}
        </div>
        <div className="ob-actions">
          <button className="ob-skip" onClick={skip}>跳过</button>
          <div className="ob-nav">
            {step > 0 && <button className="ob-prev" onClick={prev}>←</button>}
            <button className="ob-next" onClick={next}>
              {isLast ? '开始游戏 🎮' : `下一步 (${step + 1}/${STEPS.length})`}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
