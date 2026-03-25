import { useRef, useCallback, useState, useEffect } from 'react'
import { useLevel } from '../context/LevelContext'
import { useGame } from '../context/GameContext'
import { LEVELS, MERGE_RULES } from '../constants/levels'
import { TYPE_STYLES, LVL_BADGE, FORMS } from '../constants/gameData'

// ========== Tutorial overlay ==========
function LevelTutorial({ level, ruleDef, onStart }) {
  const [step, setStep] = useState(0)

  // Build tutorial steps from level info
  const steps = []

  // Step 1: Rule visual
  steps.push({
    title: `合成规则：${ruleDef.name}`,
    render: () => (
      <div className="tut-rule-visual">
        <div className="tut-rule-icon-big">{ruleDef.icon}</div>
        <div className="tut-rule-desc">{ruleDef.desc}</div>
        <div className="tut-grid-demo">
          {renderRuleDemo(ruleDef)}
        </div>
      </div>
    ),
  })

  // Step 2: Goal visual
  const goal = level.goal
  steps.push({
    title: '任务目标',
    render: () => (
      <div className="tut-goal-visual">
        <div className="tut-goal-icon">🎯</div>
        <div className="tut-goal-text">
          {goal.type === 'reach'
            ? <>合成出 <strong>{goal.count}</strong> 个 <span className="tut-lv-badge">Lv{goal.targetLv}</span> {goal.targetType ? TYPE_STYLES[goal.targetType]?.label : '任意类型'} 碎片</>
            : goal.type === 'score'
            ? <>完成 <strong>{goal.merges}</strong> 次合成操作</>
            : '完成目标'}
        </div>
        {goal.type === 'reach' && (
          <div className="tut-chain-preview">
            <span className="tut-chain-arrow">Lv1</span>
            <span className="tut-chain-sep">→</span>
            <span className="tut-chain-arrow">Lv2</span>
            <span className="tut-chain-sep">→</span>
            <span className={`tut-chain-arrow${goal.targetLv >= 3 ? '' : ' dim'}`}>Lv3</span>
            {goal.targetLv >= 4 && <><span className="tut-chain-sep">→</span><span className="tut-chain-arrow">Lv{goal.targetLv}</span></>}
            <div className="tut-chain-hint">每 3 个同类型同等级相邻合成 → 升 1 级</div>
          </div>
        )}
      </div>
    ),
  })

  // Step 3: Constraints + stars
  steps.push({
    title: '挑战条件',
    render: () => (
      <div className="tut-constraints">
        <div className="tut-constraint-list">
          {level.timeLimit > 0 && (
            <div className="tut-constraint-item">
              <span className="tut-c-icon">⏱</span>
              <span>限时 <strong>{level.timeLimit}</strong> 秒</span>
            </div>
          )}
          {level.moveLimit > 0 && (
            <div className="tut-constraint-item">
              <span className="tut-c-icon">👆</span>
              <span>限 <strong>{level.moveLimit}</strong> 步（拖拽=1步）</span>
            </div>
          )}
          {level.obstacles.length > 0 && (
            <div className="tut-constraint-item">
              <span className="tut-c-icon">🚫</span>
              <span><strong>{level.obstacles.length}</strong> 个障碍格（不可使用）</span>
            </div>
          )}
        </div>
        <div className="tut-stars-preview">
          <div className="tut-stars-title">⭐ 三星条件</div>
          {level.stars.map((s, i) => (
            <div key={i} className="tut-star-row">
              <span className="tut-star-icon">{'★'.repeat(i + 1)}</span>
              <span>{s.desc}</span>
            </div>
          ))}
        </div>
        <div className="tut-reward-preview">
          <span>通关奖励：</span>
          <span className="tut-reward-val">+{level.reward.coins} 💰</span>
          <span className="tut-reward-val">+{level.reward.rep} 🏆</span>
        </div>
      </div>
    ),
  })

  const isLast = step === steps.length - 1

  return (
    <div className="tut-overlay">
      <div className="tut-panel">
        <div className="tut-header">
          <span className="tut-level-name">{level.name}</span>
          <span className="tut-step-dots">
            {steps.map((_, i) => <span key={i} className={`tut-dot${i === step ? ' active' : ''}`} />)}
          </span>
        </div>
        <h3 className="tut-step-title">{steps[step].title}</h3>
        <div className="tut-step-content">{steps[step].render()}</div>
        <div className="tut-footer">
          {step > 0 && <button className="btn-tut-prev" onClick={() => setStep(step - 1)}>← 上一步</button>}
          <button className="btn-tut-next" onClick={isLast ? onStart : () => setStep(step + 1)}>
            {isLast ? '🚀 开始挑战' : '下一步 →'}
          </button>
        </div>
      </div>
    </div>
  )
}

// Render a 3x3 mini grid showing the merge rule direction
function renderRuleDemo(ruleDef) {
  const grid = Array(9).fill(null) // 3x3
  // center is the "target"
  grid[4] = 'center'
  for (const [dr, dc] of ruleDef.dirs) {
    const r = 1 + dr, c = 1 + dc
    if (r >= 0 && r < 3 && c >= 0 && c < 3) grid[r * 3 + c] = 'dir'
    // for skip rule, show in a 5x5 grid instead
  }
  // use 5x5 for skip rule
  if (ruleDef.id === 'skip') {
    const big = Array(25).fill(null)
    big[12] = 'center'
    for (const [dr, dc] of ruleDef.dirs) {
      const r = 2 + dr, c = 2 + dc
      if (r >= 0 && r < 5 && c >= 0 && c < 5) big[r * 5 + c] = 'dir'
    }
    return (
      <div className="tut-mini-grid skip">
        {big.map((v, i) => (
          <div key={i} className={`tut-mini-cell${v === 'center' ? ' center' : v === 'dir' ? ' dir' : ''}`}>
            {v === 'center' ? '📰' : v === 'dir' ? '✓' : ''}
          </div>
        ))}
      </div>
    )
  }
  return (
    <div className="tut-mini-grid">
      {grid.map((v, i) => (
        <div key={i} className={`tut-mini-cell${v === 'center' ? ' center' : v === 'dir' ? ' dir' : ''}`}>
          {v === 'center' ? '📰' : v === 'dir' ? '✓' : ''}
        </div>
      ))}
    </div>
  )
}

// ========== Main LevelBoard ==========
export default function LevelBoard() {
  const {
    cells, obstacles, cols, rows, rule, goal, result, stars,
    timeLimit, moveLimit, moves, merges, elapsed, levelId, selectedCell, goalMet,
    tryMerge, moveTile, exitLevel, selectCell, canMergeCheck, startLevel, unpause, finishLevel,
  } = useLevel()
  const { dispatch: mainDispatch, addToast } = useGame()

  const level = LEVELS.find(l => l.id === levelId)
  const ruleDef = MERGE_RULES[rule]
  const total = cols * rows
  const timeLeft = timeLimit > 0 ? Math.max(0, timeLimit - elapsed) : null
  const movesLeft = moveLimit > 0 ? Math.max(0, moveLimit - moves) : null

  // Tutorial state: show before first move
  const [showTutorial, setShowTutorial] = useState(true)

  // Reset tutorial on level change
  useEffect(() => {
    setShowTutorial(true)
  }, [levelId])

  const handleTutorialDone = useCallback(() => {
    setShowTutorial(false)
    unpause()
  }, [unpause])

  const dragRef = useRef({ fromIdx: -1, tile: null })

  const handleDragStart = useCallback((e, idx) => {
    dragRef.current = { fromIdx: idx, tile: cells[idx] }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
    requestAnimationFrame(() => e.target.classList.add('dragging'))
  }, [cells])

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('dragging')
    document.querySelectorAll('.merge-hint,.drag-over').forEach(el => el.classList.remove('merge-hint', 'drag-over'))
    dragRef.current = { fromIdx: -1, tile: null }
  }, [])

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault()
    const { tile } = dragRef.current
    if (cells[idx] && tile && canMergeCheck(tile, cells[idx])) {
      e.currentTarget.classList.add('merge-hint')
    } else if (!cells[idx] && !obstacles.has(idx)) {
      e.currentTarget.classList.add('drag-over')
    }
  }, [cells, obstacles, canMergeCheck])

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over', 'merge-hint')
  }, [])

  const handleDrop = useCallback((e, toIdx) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over', 'merge-hint')
    document.querySelectorAll('.merge-hint,.drag-over').forEach(el => el.classList.remove('merge-hint', 'drag-over'))
    const { fromIdx, tile } = dragRef.current
    if (fromIdx < 0 || fromIdx === toIdx || result) return
    if (cells[toIdx] && canMergeCheck(tile, cells[toIdx])) {
      tryMerge(fromIdx, toIdx)
    } else if (!cells[toIdx] && !obstacles.has(toIdx)) {
      moveTile(fromIdx, toIdx)
    }
  }, [cells, obstacles, tryMerge, moveTile, canMergeCheck, result])

  // Collect reward — actually dispatch to main game
  const handleCollect = useCallback(() => {
    if (level && result === 'win') {
      mainDispatch({ type: 'LEVEL_REWARD', coins: level.reward.coins, rep: level.reward.rep })
      addToast(`🎉 关卡奖励：+${level.reward.coins}💰 +${level.reward.rep}🏆`)
    }
    exitLevel()
  }, [level, result, exitLevel, mainDispatch, addToast])

  // Retry
  const handleRetry = useCallback(() => {
    if (level) startLevel(level.id)
  }, [level, startLevel])

  const renderTile = (cell, idx) => {
    if (!cell) return null
    const s = TYPE_STYLES[cell.type]
    const lb = LVL_BADGE[cell.lv] || LVL_BADGE[1]
    const iconSize = Math.min(28, 13 + cell.lv * 2)
    const isSelected = selectedCell === idx
    return (
      <div
        className={`tile${isSelected ? ' selected' : ''}`}
        style={{ background: s.bg, borderColor: isSelected ? '#E83535' : s.bd }}
        draggable={!result}
        onDragStart={e => handleDragStart(e, idx)}
        onDragEnd={handleDragEnd}
        onClick={e => { e.stopPropagation(); selectCell(idx) }}
      >
        <span className="tile-icon" style={{ fontSize: iconSize }}>{cell.icon}</span>
        <span className="tile-name" style={{ color: s.tx }}>{cell.name}</span>
        <span className="tile-lvl" style={{ background: lb.bg, color: lb.tx }}>{cell.lv}</span>
        <span className="tile-form">{FORMS[cell.form]?.icon}</span>
      </div>
    )
  }

  // Goal progress indicator
  const goalProgress = (() => {
    if (!goal) return { current: 0, target: 0 }
    if (goal.type === 'reach') {
      let count = 0
      cells.forEach(c => { if (c && c.lv >= goal.targetLv && (!goal.targetType || c.type === goal.targetType)) count++ })
      return { current: count, target: goal.count }
    }
    if (goal.type === 'score') return { current: merges, target: goal.merges }
    return { current: 0, target: 1 }
  })()

  // Live star tracking — check each star condition in real-time
  const liveStarStatus = (level?.stars || []).map((s, i) => {
    if (i === 0) return goalMet // star 0 = complete
    if (s.condition === 'time') return elapsed <= s.value
    if (s.condition === 'moves') return moves <= s.value
    if (s.condition === 'reach') {
      let cnt = 0
      cells.forEach(c => { if (c && c.lv >= s.targetLv) cnt++ })
      return cnt >= s.count
    }
    if (s.condition === 'score') return merges >= s.merges
    return false
  })

  return (
    <div className="level-overlay">
      {showTutorial && level ? (
        <LevelTutorial level={level} ruleDef={ruleDef} onStart={handleTutorialDone} />
      ) : (
        <div className="level-play-panel">
          {/* Header */}
          <div className="level-play-header">
            <div className="lp-left">
              <button className="btn-exit-level" onClick={exitLevel}>← 返回</button>
              <span className="lp-name">{level?.name}</span>
            </div>
            <div className="lp-right">
              {timeLeft !== null && (
                <span className={`lp-timer${timeLeft <= 10 ? ' urgent' : ''}`}>⏱ {timeLeft}s</span>
              )}
              {movesLeft !== null && (
                <span className={`lp-moves${movesLeft <= 3 ? ' urgent' : ''}`}>👆 {movesLeft}</span>
              )}
            </div>
          </div>

          {/* Goal progress bar + live stars */}
          <div className="level-goal-bar">
            <span className="lgb-label">
              🎯 {goal?.type === 'reach'
                ? `Lv${goal.targetLv} ${goal.targetType ? TYPE_STYLES[goal.targetType]?.label : ''}`
                : '合成'}
            </span>
            <div className="lgb-track">
              <div className="lgb-fill" style={{ width: `${Math.min(100, (goalProgress.current / goalProgress.target) * 100)}%` }} />
            </div>
            <span className="lgb-count">{goalProgress.current}/{goalProgress.target}</span>
            <span className="lgb-rule">{ruleDef.icon} {ruleDef.name}</span>
            {/* Live star indicators */}
            <div className="lgb-live-stars">
              {level?.stars.map((s, i) => (
                <span key={i} className={`lgb-star${liveStarStatus[i] ? ' earned' : ''}`} title={s.desc}>★</span>
              ))}
            </div>
          </div>

          {/* Goal met banner */}
          {goalMet && !result && (
            <div className="goal-met-banner">
              <span className="gmb-text">✅ 目标已达成！继续冲击三星，或提交结算</span>
              <button className="btn-finish" onClick={finishLevel}>📤 提交</button>
            </div>
          )}

          {/* Grid */}
          <div className="level-grid-wrap" onClick={() => selectCell(-1)}>
            <div className="grid level-board" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)`, maxWidth: cols * 72 }}>
              {Array.from({ length: total }, (_, i) => {
                const isObs = obstacles.has(i)
                return (
                  <div key={i} className={`cell${isObs ? ' obstacle' : ''}`}
                    data-cell-idx={i}
                    onDragOver={isObs ? undefined : e => handleDragOver(e, i)}
                    onDragLeave={isObs ? undefined : handleDragLeave}
                    onDrop={isObs ? undefined : e => handleDrop(e, i)}>
                    <div className="cell-inner">
                      {isObs ? <div className="obstacle-content"><span className="obstacle-icon">🚫</span></div> : renderTile(cells[i], i)}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Result overlay */}
          {result && (
            <div className="level-result">
              <div className={`result-card ${result}`}>
                {result === 'win' ? (
                  <>
                    <div className="result-title">🎉 采访成功！</div>
                    <div className="result-stars">
                      {[0, 1, 2].map(i => <span key={i} className={`result-star${i < stars ? ' earned' : ''}`}>★</span>)}
                    </div>
                    <div className="result-star-descs">
                      {level?.stars.map((s, i) => (
                        <div key={i} className={`result-star-desc${i < stars ? ' earned' : ''}`}>
                          {'★'.repeat(i + 1)} {s.desc}
                        </div>
                      ))}
                    </div>
                    <div className="result-reward">+{level?.reward.coins} 💰  +{level?.reward.rep} 🏆</div>
                  </>
                ) : (
                  <>
                    <div className="result-title">😵 {timeLeft === 0 ? '时间到！' : '步数用完！'}</div>
                    <div className="result-sub">再接再厉，重新挑战？</div>
                  </>
                )}
                <div className="result-btns">
                  {result === 'lose' && (
                    <button className="btn-result btn-retry" onClick={handleRetry}>🔄 再试一次</button>
                  )}
                  <button className="btn-result" onClick={handleCollect}>
                    {result === 'win' ? '✅ 领取奖励' : '← 返回'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
