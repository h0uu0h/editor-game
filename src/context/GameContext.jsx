import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react'
import {
  TOTAL_CELLS, GRID_COLS, GRID_ROWS, PAGE_DEFS, PAGE_EXPAND_PRICES,
  ORDER_TEMPLATES, TOPICS, BREAKING_NEWS, createTileData, getChainItem, findConnectedSame,
  getSellPrice,
} from '../constants/gameData'

const GameContext = createContext(null)

// ========== helpers (operate on a single page) ==========
function isBlocked(idx, locked, obstacles) {
  return locked.has(idx) || obstacles.has(idx)
}
function findRandomEmpty(cells, locked, obstacles) {
  const empties = []
  for (let i = 0; i < TOTAL_CELLS; i++) if (!cells[i] && !isBlocked(i, locked, obstacles)) empties.push(i)
  return empties.length ? empties[Math.floor(Math.random() * empties.length)] : -1
}
function findEmptyNear(idx, cells, locked, obstacles) {
  const r = Math.floor(idx / GRID_COLS), c = idx % GRID_COLS
  const dirs = [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]]
  for (let i = dirs.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [dirs[i], dirs[j]] = [dirs[j], dirs[i]] }
  for (const [dr, dc] of dirs) {
    const nr = r + dr, nc = c + dc
    if (nr >= 0 && nr < GRID_ROWS && nc >= 0 && nc < GRID_COLS) {
      const ni = nr * GRID_COLS + nc
      if (!cells[ni] && !isBlocked(ni, locked, obstacles)) return ni
    }
  }
  return findRandomEmpty(cells, locked, obstacles)
}
function canMerge(a, b) { return a && b && a.type === b.type && a.lv === b.lv && a.lv < 8 }

function countEmpty(cells, locked, obstacles) {
  let n = 0
  for (let i = 0; i < TOTAL_CELLS; i++) if (!cells[i] && !isBlocked(i, locked, obstacles)) n++
  return n
}

// ========== create one page state ==========
function createPageState(pageDef) {
  return {
    id: pageDef.id,
    cells: new Array(TOTAL_CELLS).fill(null),
    locked: new Set(pageDef.locked),
    obstacles: new Set(pageDef.obstacles),
    obstacleContent: pageDef.obstacleContent,
    expandCount: 0,
    unlocked: pageDef.unlockCost === 0,  // only front page starts unlocked
  }
}

// ========== initial state ==========
const initialState = {
  pages: PAGE_DEFS.map(createPageState),
  currentPage: 0,
  coins: 80,
  reputation: 0,
  published: 0,
  specCounts: { tech: 0, finance: 0, sport: 0, culture: 0, world: 0 },
  specialization: null,
  orders: [],
  orderIdCounter: 1,
  toasts: [],
  modal: null,
  combo: 0,
  breakingNews: null,
  particles: [],
  totalMerges: 0,
  selectedCell: -1,
}

function generateOrder(counter, pubCount) {
  const available = pubCount < 3
    ? ORDER_TEMPLATES.filter(t => t.tier === 1)
    : pubCount < 8
    ? ORDER_TEMPLATES.filter(t => t.tier <= 2)
    : ORDER_TEMPLATES
  const tmpl = available[Math.floor(Math.random() * available.length)]
  return { id: counter, title: tmpl.title, needs: [...tmpl.needs], reward: { ...tmpl.reward }, tier: tmpl.tier }
}

// ========== helper to update a specific page ==========
function updatePage(pages, pageIdx, updater) {
  const newPages = [...pages]
  newPages[pageIdx] = { ...newPages[pageIdx], ...updater(newPages[pageIdx]) }
  return newPages
}

// ========== reducer ==========
function reducer(state, action) {
  const pi = state.currentPage
  const page = state.pages[pi]

  switch (action.type) {
    case 'SWITCH_PAGE': return { ...state, currentPage: action.idx, selectedCell: -1 }

    case 'UNLOCK_PAGE': {
      const targetIdx = action.pageIdx
      const def = PAGE_DEFS[targetIdx]
      if (state.coins < def.unlockCost || state.reputation < def.unlockRep) return state
      return {
        ...state,
        coins: state.coins - def.unlockCost,
        reputation: state.reputation - def.unlockRep,
        pages: updatePage(state.pages, targetIdx, () => ({ unlocked: true })),
      }
    }

    case 'SPAWN_ITEMS': {
      const cells = [...page.cells]
      const spawned = []
      for (const item of action.items) {
        const idx = item.targetIdx != null ? item.targetIdx : findRandomEmpty(cells, page.locked, page.obstacles)
        if (idx >= 0) { cells[idx] = item.tile; spawned.push(idx) }
      }
      return { ...state, pages: updatePage(state.pages, pi, () => ({ cells })), _spawned: spawned }
    }

    case 'MOVE_TILE': {
      const cells = [...page.cells]
      cells[action.to] = cells[action.from]; cells[action.from] = null
      return { ...state, pages: updatePage(state.pages, pi, () => ({ cells })) }
    }

    case 'MERGE': {
      const { indices, newTiles, combo } = action
      const cells = [...page.cells]
      indices.forEach(i => { cells[i] = null })
      newTiles.forEach(({ idx, tile }) => { cells[idx] = tile })
      const specCounts = { ...state.specCounts }
      const mergeType = newTiles[0]?.tile?.type
      if (mergeType) specCounts[mergeType] = (specCounts[mergeType] || 0) + 1
      let specialization = state.specialization
      const max = Object.entries(specCounts).sort((a, b) => b[1] - a[1])[0]
      if (max && max[1] >= 8 && specialization !== max[0]) specialization = max[0]
      const bonusCoins = combo > 1 ? combo * 5 : 0
      return {
        ...state,
        pages: updatePage(state.pages, pi, () => ({ cells })),
        specCounts, specialization,
        combo, totalMerges: state.totalMerges + 1,
        coins: state.coins + bonusCoins,
        _merged: newTiles.map(t => t.idx),
      }
    }

    case 'PRODUCE': {
      const { producerIdx, form, pageIdx } = action
      const targetPage = state.pages[pageIdx]
      if (!targetPage) return state
      const cells = [...targetPage.cells]
      const pt = cells[producerIdx]
      if (!pt?.isProducer) return state
      const empty = findEmptyNear(producerIdx, cells, targetPage.locked, targetPage.obstacles)
      if (empty < 0) return state
      cells[empty] = createTileData(pt.type, form, 1)
      return { ...state, pages: updatePage(state.pages, pageIdx, () => ({ cells })), _spawned: [empty] }
    }

    case 'FULFILL_ORDER': {
      const order = state.orders.find(o => o.id === action.orderId)
      if (!order) return state
      // consume tiles from current page
      const cells = [...page.cells]
      for (const n of order.needs) {
        for (let i = 0; i < TOTAL_CELLS; i++) {
          if (cells[i] && cells[i].form === n) { cells[i] = null; break }
        }
      }
      const newOrders = state.orders.filter(o => o.id !== order.id)
      const newPub = state.published + 1
      newOrders.push(generateOrder(state.orderIdCounter, newPub))
      return {
        ...state,
        pages: updatePage(state.pages, pi, () => ({ cells })),
        coins: state.coins + order.reward.coins,
        reputation: state.reputation + order.reward.rep,
        published: newPub,
        orders: newOrders.slice(-3),
        orderIdCounter: state.orderIdCounter + 1,
        modal: { title: order.title, rep: order.reward.rep, coins: order.reward.coins, published: newPub, tier: order.tier },
      }
    }

    case 'CLOSE_MODAL': return { ...state, modal: null }

    case 'EXPAND_PAGE': {
      const targetPI = action.pageIdx != null ? action.pageIdx : pi
      const targetPage = state.pages[targetPI]
      const price = PAGE_EXPAND_PRICES[targetPage.expandCount] || 5000
      if (state.coins < price) return state
      if (targetPage.locked.size === 0) return state
      const locked = new Set(targetPage.locked)
      let count = 0
      for (const idx of locked) { if (count >= GRID_COLS) break; locked.delete(idx); count++ }
      return {
        ...state,
        coins: state.coins - price,
        pages: updatePage(state.pages, targetPI, () => ({ locked, expandCount: targetPage.expandCount + 1 })),
      }
    }

    case 'SET_BREAKING': return { ...state, breakingNews: action.event }
    case 'CLEAR_BREAKING': return { ...state, breakingNews: null }
    case 'CLAIM_BREAKING': {
      const bn = state.breakingNews
      if (!bn) return state
      return { ...state, breakingNews: null, coins: state.coins + bn.reward.coins, reputation: state.reputation + bn.reward.rep }
    }

    case 'ADD_TOAST': {
      const toasts = [...state.toasts, { id: Date.now() + Math.random(), text: action.text }]
      return { ...state, toasts: toasts.slice(-5) }
    }
    case 'REMOVE_TOAST': return { ...state, toasts: state.toasts.filter(t => t.id !== action.id) }
    case 'SET_PARTICLES': return { ...state, particles: action.particles }
    case 'SELECT_CELL': return { ...state, selectedCell: action.idx }
    case 'DESELECT': return { ...state, selectedCell: -1 }
    case 'SELL_TILE': {
      const idx = action.idx
      const tile = page.cells[idx]
      if (!tile) return state
      const price = getSellPrice(tile)
      const cells = [...page.cells]
      cells[idx] = null
      return { ...state, pages: updatePage(state.pages, pi, () => ({ cells })), coins: state.coins + price, selectedCell: -1 }
    }
    case 'INIT_ORDERS': {
      return { ...state, orders: [generateOrder(1, 0), generateOrder(2, 0)], orderIdCounter: 3 }
    }
    case 'LEVEL_REWARD': {
      return {
        ...state,
        coins: state.coins + (action.coins || 0),
        reputation: state.reputation + (action.rep || 0),
      }
    }
    default: return state
  }
}

// ========== provider ==========
export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const producerTimers = useRef({})  // key = "pageIdx_cellIdx"
  const comboTimerRef = useRef(null)
  const breakingTimerRef = useRef(null)

  // current page shorthand
  const page = state.pages[state.currentPage]
  const pageDef = PAGE_DEFS[state.currentPage]

  // producer timers — run for current page only
  useEffect(() => {
    // clear all existing
    Object.values(producerTimers.current).forEach(clearInterval)
    producerTimers.current = {}

    const pi = state.currentPage
    const pg = state.pages[pi]
    pg.cells.forEach((cell, idx) => {
      if (cell?.isProducer) {
        const key = `${pi}_${idx}`
        producerTimers.current[key] = setInterval(() => {
          dispatch({ type: 'PRODUCE', producerIdx: idx, form: cell.produces, pageIdx: pi })
        }, cell.interval)
      }
    })
    return () => {
      Object.values(producerTimers.current).forEach(clearInterval)
      producerTimers.current = {}
    }
  }, [state.currentPage, state.pages])

  // breaking news
  useEffect(() => {
    const scheduleBreaking = () => {
      const delay = 40000 + Math.random() * 50000
      breakingTimerRef.current = setTimeout(() => {
        if (!state.breakingNews) {
          const event = BREAKING_NEWS[Math.floor(Math.random() * BREAKING_NEWS.length)]
          dispatch({ type: 'SET_BREAKING', event: { ...event, expiresAt: Date.now() + event.duration } })
          const items = [
            { tile: createTileData(event.type, event.bonus, 1) },
            { tile: createTileData(event.type, event.bonus, 1) },
            { tile: createTileData(event.type, 'fact', 1) },
          ]
          dispatch({ type: 'SPAWN_ITEMS', items })
          addToast(`${event.headline} +3条紧急线索！`)
          setTimeout(() => dispatch({ type: 'CLEAR_BREAKING' }), event.duration)
        }
        scheduleBreaking()
      }, delay)
    }
    scheduleBreaking()
    return () => clearTimeout(breakingTimerRef.current)
  }, [])

  const addToast = useCallback((text) => {
    const id = Date.now() + Math.random()
    dispatch({ type: 'ADD_TOAST', text })
    setTimeout(() => dispatch({ type: 'REMOVE_TOAST', id }), 2500)
  }, [])

  const spawnParticles = useCallback((cellIdx, emoji, count = 6) => {
    const cellEl = document.querySelector(`[data-cell-idx="${cellIdx}"]`)
    if (!cellEl) return
    const rect = cellEl.getBoundingClientRect()
    const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2
    const particles = Array.from({ length: count }, (_, i) => ({
      id: Date.now() + i, x: cx, y: cy, emoji,
      dx: (Math.random() - 0.5) * 120, dy: (Math.random() - 0.5) * 120 - 30,
    }))
    dispatch({ type: 'SET_PARTICLES', particles })
    setTimeout(() => dispatch({ type: 'SET_PARTICLES', particles: [] }), 600)
  }, [])

  const tryMerge = useCallback((fromIdx, toIdx) => {
    const cells = page.cells
    const a = cells[fromIdx], b = cells[toIdx]
    if (!canMerge(a, b)) return false

    const virtualCells = [...cells]
    virtualCells[fromIdx] = null
    virtualCells[toIdx] = b
    const connected = findConnectedSame(toIdx, virtualCells)
    if (!connected.includes(fromIdx)) connected.push(fromIdx)
    const all = [...new Set(connected)]

    // page boost: if boost type matches, allow merge with 2
    const boost = pageDef.boost
    const minMerge = (boost && a.type === boost.type) ? boost.mergeCount : 3
    if (all.length < minMerge) return false

    clearTimeout(comboTimerRef.current)
    const newCombo = state.combo + 1
    comboTimerRef.current = setTimeout(() => {
      dispatch({ type: 'MERGE', indices: [], newTiles: [], combo: 0 })
    }, 2000)

    const newLv = a.lv + 1
    const ci = getChainItem(a.type, newLv)
    const isFive = all.length >= 5

    if (isFive) {
      const use = all.slice(0, 5)
      const secondEmpty = findEmptyNear(toIdx, cells, page.locked, page.obstacles)
      const newTiles = [{ idx: toIdx, tile: createTileData(a.type, a.form, newLv) }]
      if (secondEmpty >= 0) newTiles.push({ idx: secondEmpty, tile: createTileData(a.type, a.form, newLv) })
      dispatch({ type: 'MERGE', indices: use, newTiles, combo: newCombo })
      spawnParticles(toIdx, '✨', 10)
      addToast(`🎯 5合2！${ci?.name || 'Lv' + newLv} ×2${newCombo > 1 ? ` · Combo ×${newCombo}` : ''}`)
      return true
    }
    const mergeSize = minMerge === 2 ? Math.min(all.length, 3) : 3
    const use = all.slice(0, mergeSize)
    const newTiles = [{ idx: toIdx, tile: createTileData(a.type, a.form, newLv) }]
    dispatch({ type: 'MERGE', indices: use, newTiles, combo: newCombo })
    const particleEmoji = ci?.producer ? '⚡' : '✨'
    spawnParticles(toIdx, particleEmoji, ci?.producer ? 8 : 5)
    let msg = minMerge === 2 ? `专栏加成！` : ''
    msg += `合成 → ${ci?.name || 'Lv' + newLv}`
    if (ci?.producer) msg += ' ✦产出'
    if (newCombo > 1) msg += ` · Combo ×${newCombo}!`
    addToast(msg)
    return true
  }, [page, pageDef, state.combo, addToast, spawnParticles])

  const moveTile = useCallback((from, to) => dispatch({ type: 'MOVE_TILE', from, to }), [])

  const doAI = useCallback((topicId) => {
    const topic = TOPICS.find(t => t.id === topicId)
    const drops = topic.drops
    const count = 2 + Math.floor(Math.random() * 2)
    const items = []
    for (let i = 0; i < count; i++) {
      const form = drops[Math.floor(Math.random() * drops.length)]
      items.push({ tile: createTileData(topicId, form, 1) })
    }
    if (Math.random() < 0.12 + state.combo * 0.03) {
      items.push({ tile: createTileData(topicId, 'scoop', 1) })
    }
    dispatch({ type: 'SPAWN_ITEMS', items })
    return { topic, items, headline: topic.headlines[Math.floor(Math.random() * topic.headlines.length)] }
  }, [state.combo])

  const fulfillOrder = useCallback((orderId) => dispatch({ type: 'FULFILL_ORDER', orderId }), [])
  const closeModal = useCallback(() => dispatch({ type: 'CLOSE_MODAL' }), [])

  const tryExpand = useCallback(() => {
    const price = PAGE_EXPAND_PRICES[page.expandCount] || 5000
    if (state.coins < price) { addToast(`需要 ${price} 💰 才能扩建`); return }
    if (page.locked.size === 0) { addToast('本版面已全部解锁'); return }
    dispatch({ type: 'EXPAND_PAGE' })
    addToast('🏠 版面扩建！新区域已解锁')
  }, [page, state.coins, addToast])

  const switchPage = useCallback((idx) => {
    const pg = state.pages[idx]
    if (!pg.unlocked) return
    dispatch({ type: 'SWITCH_PAGE', idx })
  }, [state.pages])

  const unlockPage = useCallback((pageIdx) => {
    const def = PAGE_DEFS[pageIdx]
    if (state.coins < def.unlockCost) { addToast(`需要 ${def.unlockCost} 💰`); return }
    if (state.reputation < def.unlockRep) { addToast(`需要 ${def.unlockRep} 🏆`); return }
    dispatch({ type: 'UNLOCK_PAGE', pageIdx })
    addToast(`📰 ${def.name} 已解锁！`)
  }, [state.coins, state.reputation, addToast])

  const claimBreaking = useCallback(() => dispatch({ type: 'CLAIM_BREAKING' }), [])

  const selectCell = useCallback((idx) => {
    dispatch({ type: state.selectedCell === idx ? 'DESELECT' : 'SELECT_CELL', idx })
  }, [state.selectedCell])

  const sellTile = useCallback((idx) => {
    const tile = page.cells[idx]
    if (!tile) return
    const price = getSellPrice(tile)
    dispatch({ type: 'SELL_TILE', idx })
    spawnParticles(idx, '💰', 5)
    addToast(`卖出 ${tile.name} → +${price} 💰`)
  }, [page, addToast, spawnParticles])

  const emptyCount = countEmpty(page.cells, page.locked, page.obstacles)

  const value = {
    // global
    coins: state.coins, reputation: state.reputation, published: state.published,
    specCounts: state.specCounts, specialization: state.specialization,
    orders: state.orders, toasts: state.toasts, modal: state.modal,
    combo: state.combo, breakingNews: state.breakingNews, particles: state.particles,
    totalMerges: state.totalMerges, selectedCell: state.selectedCell,
    // page
    pages: state.pages, currentPage: state.currentPage, pageDef,
    cells: page.cells, locked: page.locked, obstacles: page.obstacles,
    obstacleContent: page.obstacleContent,
    expandCount: page.expandCount, emptyCount,
    // actions
    dispatch, addToast, tryMerge, moveTile, doAI, fulfillOrder,
    closeModal, tryExpand, switchPage, unlockPage, claimBreaking,
    spawnParticles, selectCell, sellTile, canMergeCheck: canMerge,
  }

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>
}

export function useGame() {
  const ctx = useContext(GameContext)
  if (!ctx) throw new Error('useGame must be inside GameProvider')
  return ctx
}
