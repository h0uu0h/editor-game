import { useState, useEffect, useCallback, useRef } from 'react'

const STEPS = [
  {
    title: '欢迎来到编辑部！',
    desc: '你是腾讯新闻的实习编辑，你的任务是收集线索、合成稿件、打造属于自己的新闻王国。',
    icon: '📰',
    target: null, // no highlight, center overlay
    position: 'center',
  },
  {
    title: '这是你的编辑桌',
    desc: '桌上散落着各种线索碎片。相同类型、相同等级的碎片如果相邻，就可以合成升级！',
    icon: '🗂️',
    target: '.board-area',
    position: 'right',
  },
  {
    title: '拖拽合成',
    desc: '试试把同类碎片拖到一起 —— 3 个相邻的同类碎片合成为更高级的素材。5 个一起合还能出 2 个！',
    icon: '👆',
    target: '.grid',
    position: 'right',
  },
  {
    title: '碎片等级链',
    desc: '📎线索碎片 → 📝采访笔记 → 💡选题方案 → 💻稿件 → 🖥️专栏 … 一直到 Lv8 传奇刊物！Lv4 以上还会自动产出新碎片。',
    icon: '🔗',
    target: '.grid',
    position: 'right',
    showChain: true,
  },
  {
    title: '障碍格',
    desc: '报纸版面上有些格子被广告和赞助商占据了，它们不可使用 —— 合理规划你的空间吧！',
    icon: '🚫',
    target: '.cell.obstacle',
    position: 'right',
  },
  {
    title: 'AI 采访',
    desc: '点击右侧的 AI 采访按钮，派出记者去各频道收集线索碎片。每次采访都能获得 2-3 个碎片！',
    icon: '🤖',
    target: '.side-section:first-child',
    position: 'left',
  },
  {
    title: '完成订单赚金币',
    desc: '根据订单要求交付对应素材，就能赚到金币💰和声望🏆。金币用来扩建版面，声望用来解锁新版面。',
    icon: '📋',
    target: '.order-card',
    position: 'left',
  },
  {
    title: '扩建版面',
    desc: '版面快满了？花金币扩建新区域，让你有更多空间合成更多素材！',
    icon: '🏠',
    target: '.space-panel',
    position: 'left',
  },
  {
    title: '多页报纸',
    desc: '底部可以切换不同版面 —— 财经、体育、文化、国际，每个版面都有独特的合成加成！需要金币和声望解锁。',
    icon: '📑',
    target: '.page-tabs',
    position: 'top',
  },
  {
    title: '采访任务（闯关模式）',
    desc: '点击顶部「📋采访任务」挑战关卡 —— 限时、限步、对角线合成等特殊规则等你来挑战，赢取额外奖励！',
    icon: '⭐',
    target: '.btn-story',
    position: 'bottom',
  },
  {
    title: '准备好了吗？',
    desc: '现在，试试把桌上那 3 个科技碎片拖到一起合成吧！祝你成为最优秀的编辑 ✨',
    icon: '🚀',
    target: null,
    position: 'center',
  },
]

export default function Onboarding({ onFinish }) {
  const [step, setStep] = useState(0)
  const [highlight, setHighlight] = useState(null) // { top, left, width, height }
  const overlayRef = useRef(null)

  const current = STEPS[step]

  // Calculate highlight position
  useEffect(() => {
    if (!current.target) { setHighlight(null); return }
    const el = document.querySelector(current.target)
    if (!el) { setHighlight(null); return }
    const rect = el.getBoundingClientRect()
    const pad = 6
    setHighlight({
      top: rect.top - pad,
      left: rect.left - pad,
      width: rect.width + pad * 2,
      height: rect.height + pad * 2,
    })
  }, [step, current.target])

  const next = useCallback(() => {
    if (step < STEPS.length - 1) setStep(step + 1)
    else onFinish()
  }, [step, onFinish])

  const prev = useCallback(() => {
    if (step > 0) setStep(step - 1)
  }, [step])

  const skip = useCallback(() => onFinish(), [onFinish])

  // Tooltip position
  const tooltipStyle = (() => {
    if (!highlight || current.position === 'center') {
      return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
    }
    const h = highlight
    const style = { position: 'fixed' }
    switch (current.position) {
      case 'right':
        style.top = Math.max(20, h.top)
        style.left = h.left + h.width + 14
        // if overflow right, put below
        if (style.left + 300 > window.innerWidth) {
          style.left = Math.max(10, h.left)
          style.top = h.top + h.height + 14
        }
        break
      case 'left':
        style.top = Math.max(20, h.top)
        style.left = Math.max(10, h.left - 310)
        if (style.left < 10) {
          style.left = Math.max(10, h.left)
          style.top = h.top + h.height + 14
        }
        break
      case 'bottom':
        style.top = h.top + h.height + 14
        style.left = Math.max(10, h.left)
        break
      case 'top':
        style.top = Math.max(10, h.top - 180)
        style.left = Math.max(10, h.left)
        break
      default:
        break
    }
    return style
  })()

  const isLast = step === STEPS.length - 1

  return (
    <div className="onboarding-overlay" ref={overlayRef}>
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
      <div className="onboarding-tooltip" style={tooltipStyle}>
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
