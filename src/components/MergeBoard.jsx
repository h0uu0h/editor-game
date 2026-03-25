import { useRef, useCallback } from 'react'
import { useGame } from '../context/GameContext'
import { TYPE_STYLES, LVL_BADGE, FORMS, GRID_COLS, GRID_ROWS, TOTAL_CELLS, getSellPrice, CHAINS } from '../constants/gameData'

export default function MergeBoard() {
  const {
    cells, locked, obstacles, obstacleContent, pageDef,
    tryMerge, moveTile, canMergeCheck,
    selectedCell, selectCell, sellTile,
  } = useGame()

  const dragRef = useRef({ fromIdx: -1, tile: null })

  const handleDragStart = useCallback((e, idx) => {
    dragRef.current = { fromIdx: idx, tile: cells[idx] }
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('text/plain', String(idx))
    requestAnimationFrame(() => { e.target.classList.add('dragging') })
    highlightTargets(idx)
  }, [cells])

  const handleDragEnd = useCallback((e) => {
    e.target.classList.remove('dragging')
    clearHighlights()
    dragRef.current = { fromIdx: -1, tile: null }
  }, [])

  const handleDragOver = useCallback((e, idx) => {
    e.preventDefault()
    const cellEl = e.currentTarget
    const { tile } = dragRef.current
    if (cells[idx] && tile && canMergeCheck(tile, cells[idx])) {
      cellEl.classList.add('merge-hint')
    } else if (!cells[idx] && !locked.has(idx)) {
      cellEl.classList.add('drag-over')
    }
  }, [cells, locked, canMergeCheck])

  const handleDragLeave = useCallback((e) => {
    e.currentTarget.classList.remove('drag-over', 'merge-hint')
  }, [])

  const handleDrop = useCallback((e, toIdx) => {
    e.preventDefault()
    e.currentTarget.classList.remove('drag-over', 'merge-hint')
    clearHighlights()
    const { fromIdx, tile } = dragRef.current
    if (fromIdx < 0 || fromIdx === toIdx) return
    if (cells[toIdx] && canMergeCheck(tile, cells[toIdx])) {
      tryMerge(fromIdx, toIdx)
    } else if (!cells[toIdx] && !locked.has(toIdx)) {
      moveTile(fromIdx, toIdx)
    }
  }, [cells, locked, tryMerge, moveTile, canMergeCheck])

  const touchRef = useRef(null)

  const handleTouchStart = useCallback((e, idx) => {
    e.preventDefault()
    const touch = e.touches[0]
    const tile = e.currentTarget
    const rect = tile.getBoundingClientRect()
    dragRef.current = { fromIdx: idx, tile: cells[idx] }

    const clone = tile.cloneNode(true)
    Object.assign(clone.style, {
      position: 'fixed', width: rect.width + 'px', height: rect.height + 'px',
      zIndex: '9999', pointerEvents: 'none', transform: 'scale(1.1)',
      boxShadow: '0 8px 24px rgba(0,0,0,.2)', left: rect.left + 'px', top: rect.top + 'px',
    })
    document.body.appendChild(clone)
    tile.style.opacity = '.3'
    touchRef.current = { fromIdx: idx, clone, offsetX: touch.clientX - rect.left, offsetY: touch.clientY - rect.top, tileEl: tile }
    highlightTargets(idx)

    const onMove = (ev) => { ev.preventDefault(); const t = ev.touches[0]; clone.style.left = (t.clientX - touchRef.current.offsetX) + 'px'; clone.style.top = (t.clientY - touchRef.current.offsetY) + 'px' }
    const onEnd = (ev) => {
      document.removeEventListener('touchmove', onMove)
      document.removeEventListener('touchend', onEnd)
      clone.remove(); tile.style.opacity = '1'; clearHighlights()
      const t = ev.changedTouches[0]
      const el = document.elementFromPoint(t.clientX, t.clientY)
      const cellEl = el?.closest?.('[data-cell-idx]')
      if (cellEl) {
        const toIdx = Number(cellEl.dataset.cellIdx)
        if (toIdx !== idx) {
          const { tile: dragTile } = dragRef.current
          if (cells[toIdx] && canMergeCheck(dragTile, cells[toIdx])) tryMerge(idx, toIdx)
          else if (!cells[toIdx] && !locked.has(toIdx)) moveTile(idx, toIdx)
        }
      }
      touchRef.current = null; dragRef.current = { fromIdx: -1, tile: null }
    }
    document.addEventListener('touchmove', onMove, { passive: false })
    document.addEventListener('touchend', onEnd)
  }, [cells, locked, tryMerge, moveTile, canMergeCheck])

  function highlightTargets(idx) {
    const t = cells[idx]; if (!t) return
    document.querySelectorAll('[data-cell-idx]').forEach(el => {
      const ci = Number(el.dataset.cellIdx)
      if (ci !== idx && cells[ci] && canMergeCheck(t, cells[ci])) el.classList.add('merge-hint')
    })
  }
  function clearHighlights() {
    document.querySelectorAll('.merge-hint,.drag-over').forEach(el => el.classList.remove('merge-hint', 'drag-over'))
  }

  const handleTileClick = useCallback((e, idx) => {
    if (dragRef.current.fromIdx >= 0) return
    e.stopPropagation(); selectCell(idx)
  }, [selectCell])

  const renderTile = (cell, idx) => {
    if (!cell) return null
    const s = TYPE_STYLES[cell.type]
    const lb = LVL_BADGE[cell.lv] || LVL_BADGE[1]
    const iconSize = Math.min(24, 11 + cell.lv * 2)
    const lvClass = cell.lv >= 7 ? ' lv-legendary' : cell.lv >= 5 ? ' lv-high' : ''
    const isSelected = selectedCell === idx
    return (
      <div
        className={`tile${cell.isProducer ? ' producer' : ''}${lvClass}${isSelected ? ' selected' : ''}`}
        style={{ background: s.bg, borderColor: isSelected ? '#E83535' : s.bd }}
        draggable onDragStart={e => handleDragStart(e, idx)} onDragEnd={handleDragEnd}
        onTouchStart={e => handleTouchStart(e, idx)} onClick={e => handleTileClick(e, idx)}
      >
        <span className="tile-icon" style={{ fontSize: iconSize }}>{cell.icon}</span>
        <span className="tile-name" style={{ color: s.tx }}>{cell.name}</span>
        <span className="tile-lvl" style={{ background: lb.bg, color: lb.tx }}>{cell.lv}</span>
        <span className="tile-form">{FORMS[cell.form]?.icon}</span>
      </div>
    )
  }

  const renderSellPopup = (idx) => {
    const cell = cells[idx]
    if (!cell || selectedCell !== idx) return null
    const price = getSellPrice(cell)
    const chain = CHAINS[cell.type]; const ci = chain?.find(c => c.lv === cell.lv)
    return (
      <div className="sell-popup" onClick={e => e.stopPropagation()}>
        <div className="sell-info">
          <span className="sell-name">{cell.icon} {cell.name}</span>
          <span className="sell-detail">Lv{cell.lv} · {FORMS[cell.form]?.name}{ci?.producer ? ' · ✦产出' : ''}</span>
        </div>
        <button className="btn-sell" onClick={() => sellTile(idx)}>卖出 +{price} 💰</button>
      </div>
    )
  }

  const handleBoardClick = useCallback(() => { if (selectedCell >= 0) selectCell(-1) }, [selectedCell, selectCell])

  const boostLabel = pageDef.boost ? `${TYPE_STYLES[pageDef.boost.type]?.label} 2合1` : null

  return (
    <div className="board-area" onClick={handleBoardClick}>
      <div className="board-header">
        <h3>{pageDef.icon} {pageDef.name}</h3>
        <span className="hint">
          {boostLabel && <span className="boost-tag">{boostLabel}</span>}
          相邻合成 · 点击出售
        </span>
      </div>
      <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)` }}>
        {Array.from({ length: TOTAL_CELLS }, (_, i) => {
          const isObs = obstacles.has(i)
          const isLocked = locked.has(i)
          const blocked = isObs || isLocked
          return (
            <div key={i} className={`cell${isLocked ? ' locked' : ''}${isObs ? ' obstacle' : ''}`}
              data-cell-idx={i}
              onDragOver={blocked ? undefined : (e) => handleDragOver(e, i)}
              onDragLeave={blocked ? undefined : handleDragLeave}
              onDrop={blocked ? undefined : (e) => handleDrop(e, i)}>
              <div className="cell-inner">
                {isObs ? (
                  <div className="obstacle-content">
                    <span className="obstacle-icon">{obstacleContent[i]?.icon}</span>
                    <span className="obstacle-label">{obstacleContent[i]?.label}</span>
                  </div>
                ) : (<>{renderTile(cells[i], i)}{renderSellPopup(i)}</>)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
