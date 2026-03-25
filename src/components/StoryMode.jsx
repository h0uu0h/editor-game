import { useState } from 'react'
import { useLevel } from '../context/LevelContext'
import { CHAPTERS, LEVELS, MERGE_RULES } from '../constants/levels'
import { TYPE_STYLES, LVL_BADGE, FORMS } from '../constants/gameData'
import LevelBoard from './LevelBoard'

// ========== Level Select Screen ==========
function LevelSelect({ onClose }) {
  const { progress, totalStars, startLevel } = useLevel()

  // 自动定位到最新未完成的章节
  const latestChapter = (() => {
    for (let i = CHAPTERS.length - 1; i >= 0; i--) {
      const ch = CHAPTERS[i]
      if (totalStars >= ch.requiredStars) {
        const chapLevels = LEVELS.filter(l => l.chapter === ch.id)
        const allDone = chapLevels.every(l => progress[l.id]?.completed)
        if (!allDone || i === CHAPTERS.length - 1) return ch.id
      }
    }
    return 1
  })()

  const [chapter, setChapter] = useState(latestChapter)

  const chapLevels = LEVELS.filter(l => l.chapter === chapter)
  const chapDef = CHAPTERS.find(c => c.id === chapter)
  const canAccess = totalStars >= (chapDef?.requiredStars || 0)

  return (
    <div className="level-overlay">
      <div className="level-panel">
        <div className="level-header">
          <h2>📰 采访任务</h2>
          <span className="level-total-stars">⭐ {totalStars}</span>
          <button className="btn-close-level" onClick={onClose}>✕</button>
        </div>

        <div className="chapter-tabs">
          {CHAPTERS.map(ch => {
            const accessible = totalStars >= ch.requiredStars
            return (
              <div
                key={ch.id}
                className={`chapter-tab${chapter === ch.id ? ' active' : ''}${!accessible ? ' locked' : ''}`}
                onClick={() => accessible && setChapter(ch.id)}
              >
                <span>{ch.icon}</span>
                <span className="ch-name">{ch.name}</span>
                {!accessible && <span className="ch-lock">🔒 {ch.requiredStars}⭐</span>}
              </div>
            )
          })}
        </div>

        {canAccess ? (
          <div className="level-grid">
            {chapLevels.map(lv => {
              const prog = progress[lv.id]
              const rule = MERGE_RULES[lv.rule]
              return (
                <div key={lv.id} className={`level-card${prog?.completed ? ' completed' : ''}`} onClick={() => startLevel(lv.id)}>
                  <div className="lv-top">
                    <span className="lv-rule-icon">{rule.icon}</span>
                    <span className="lv-name">{lv.name}</span>
                  </div>
                  <div className="lv-desc">{lv.desc}</div>
                  <div className="lv-meta">
                    {lv.timeLimit > 0 && <span>⏱ {lv.timeLimit}s</span>}
                    {lv.moveLimit > 0 && <span>👆 {lv.moveLimit}步</span>}
                    <span>{rule.name}</span>
                  </div>
                  <div className="lv-stars">
                    {[0, 1, 2].map(i => (
                      <span key={i} className={`lv-star${prog && i < prog.stars ? ' earned' : ''}`}>★</span>
                    ))}
                  </div>
                  <div className="lv-reward">🏆+{lv.reward.rep} 💰+{lv.reward.coins}</div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="level-locked-msg">
            需要 {chapDef.requiredStars} ⭐ 解锁此章节（当前 {totalStars} ⭐）
          </div>
        )}
      </div>
    </div>
  )
}

// ========== Main export: wraps select + play ==========
export default function StoryMode({ onClose }) {
  const { active } = useLevel()

  if (active) return <LevelBoard />
  return <LevelSelect onClose={onClose} />
}
