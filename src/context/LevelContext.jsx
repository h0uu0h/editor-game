import { createContext, useContext, useReducer, useCallback, useRef, useEffect, useState } from 'react'
import { LEVELS, MERGE_RULES, buildLevelCells, findConnectedLevel } from '../constants/levels'
import { createTileData, getChainItem } from '../constants/gameData'

const LevelContext = createContext(null)

function canMerge(a, b) { return a && b && a.type === b.type && a.lv === b.lv && a.lv < 8 }

function findRandomEmpty(cells, obstacles, total) {
  const empties = []
  for (let i = 0; i < total; i++) if (!cells[i] && !obstacles.has(i)) empties.push(i)
  return empties.length ? empties[Math.floor(Math.random() * empties.length)] : -1
}

const initLevelState = {
  active: false,
  levelId: null,
  cells: [],
  obstacles: new Set(),
  cols: 5,
  rows: 4,
  rule: 'normal',
  goal: null,
  timeLimit: 0,
  moveLimit: 0,
  moves: 0,
  merges: 0,
  maxLvReached: {},
  elapsed: 0,
  result: null,
  stars: 0,
  selectedCell: -1,
  paused: true,
  goalMet: false,     // goal achieved but player can keep going for stars
}

function reducer(state, action) {
  switch (action.type) {
    case 'START_LEVEL': {
      const level = action.level
      const { cells, obstacles } = buildLevelCells(level)
      return {
        ...initLevelState,
        active: true,
        levelId: level.id,
        cells,
        obstacles,
        cols: level.cols,
        rows: level.rows,
        rule: level.rule,
        goal: level.goal,
        timeLimit: level.timeLimit,
        moveLimit: level.moveLimit,
      }
    }
    case 'MOVE_TILE': {
      const cells = [...state.cells]
      cells[action.to] = cells[action.from]; cells[action.from] = null
      const moves = state.moves + 1
      let result = state.result
      // if move limit reached, auto-finish (win if goal met, lose if not)
      if (state.moveLimit > 0 && moves >= state.moveLimit && !result) {
        result = state.goalMet ? 'win' : 'lose'
      }
      return { ...state, cells, moves, result, selectedCell: -1 }
    }
    case 'MERGE': {
      const { indices, newTiles } = action
      const cells = [...state.cells]
      indices.forEach(i => { cells[i] = null })
      newTiles.forEach(({ idx, tile }) => { cells[idx] = tile })
      const merges = state.merges + 1
      const moves = state.moves + 1
      const maxLvReached = { ...state.maxLvReached }
      for (const nt of newTiles) {
        const t = nt.tile
        if (!maxLvReached[t.type] || t.lv > maxLvReached[t.type]) maxLvReached[t.type] = t.lv
      }
      let result = state.result
      if (state.moveLimit > 0 && moves >= state.moveLimit && !result) {
        result = state.goalMet ? 'win' : 'lose'
      }
      return { ...state, cells, merges, moves, maxLvReached, result, selectedCell: -1 }
    }
    case 'TICK': return state.paused ? state : { ...state, elapsed: state.elapsed + 1 }
    case 'GOAL_MET': return state.goalMet ? state : { ...state, goalMet: true }
    case 'FINISH': return { ...state, result: action.result, stars: action.stars || 0, paused: true }
    case 'SET_RESULT': return { ...state, result: action.result, stars: action.stars || 0, paused: true }
    case 'EXIT': return { ...initLevelState }
    case 'UNPAUSE': return { ...state, paused: false }
    case 'SELECT_CELL': return { ...state, selectedCell: state.selectedCell === action.idx ? -1 : action.idx }
    default: return state
  }
}

// Calculate stars based on current state
function calcStars(level, state) {
  let stars = 1
  for (let si = 1; si < level.stars.length; si++) {
    const s = level.stars[si]
    if (s.condition === 'time' && state.elapsed <= s.value) stars++
    else if (s.condition === 'moves' && state.moves <= s.value) stars++
    else if (s.condition === 'reach') {
      let cnt = 0
      state.cells.forEach(c => { if (c && c.lv >= s.targetLv) cnt++ })
      if (cnt >= s.count) stars++
    }
    else if (s.condition === 'score' && state.merges >= s.merges) stars++
  }
  return stars
}

export function LevelProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initLevelState)
  const timerRef = useRef(null)

  // progress tracking persisted in localStorage
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem('level_progress') || '{}') } catch { return {} }
  })
  const saveProgress = useCallback((levelId, stars, reward) => {
    setProgress(prev => {
      const old = prev[levelId] || { stars: 0, completed: false }
      const next = { ...prev, [levelId]: { stars: Math.max(old.stars, stars), completed: true } }
      localStorage.setItem('level_progress', JSON.stringify(next))
      return next
    })
    return reward
  }, [])

  // timer
  useEffect(() => {
    if (state.active && state.timeLimit > 0 && !state.result) {
      timerRef.current = setInterval(() => dispatch({ type: 'TICK' }), 1000)
      return () => clearInterval(timerRef.current)
    }
    return () => clearInterval(timerRef.current)
  }, [state.active, state.timeLimit, state.result])

  // check time over → auto-finish
  useEffect(() => {
    if (state.active && state.timeLimit > 0 && state.elapsed >= state.timeLimit && !state.result) {
      if (state.goalMet) {
        // time's up but goal was met → calculate stars and win
        const level = LEVELS.find(l => l.id === state.levelId)
        if (level) {
          const stars = calcStars(level, state)
          dispatch({ type: 'FINISH', result: 'win', stars })
          saveProgress(level.id, stars, level.reward)
        }
      } else {
        dispatch({ type: 'SET_RESULT', result: 'lose', stars: 0 })
      }
    }
  }, [state.elapsed, state.timeLimit, state.active, state.result, state.goalMet, state.levelId])

  // auto-finish when move-limit result was set in reducer
  useEffect(() => {
    if (state.result === 'win' && state.active) {
      const level = LEVELS.find(l => l.id === state.levelId)
      if (level && state.stars === 0) {
        const stars = calcStars(level, state)
        dispatch({ type: 'FINISH', result: 'win', stars })
        saveProgress(level.id, stars, level.reward)
      }
    }
  }, [state.result, state.active, state.levelId, state.stars])

  // check goal met (but don't end the level)
  useEffect(() => {
    if (!state.active || state.result || state.goalMet) return
    const goal = state.goal
    if (!goal) return

    let met = false
    if (goal.type === 'reach') {
      let count = 0
      state.cells.forEach(c => {
        if (c && c.lv >= goal.targetLv && (!goal.targetType || c.type === goal.targetType)) count++
      })
      if (count >= goal.count) met = true
    } else if (goal.type === 'score') {
      if (state.merges >= goal.merges) met = true
    }
    if (met) dispatch({ type: 'GOAL_MET' })
  }, [state.cells, state.merges, state.active, state.result, state.goal, state.goalMet])

  const startLevel = useCallback((levelId) => {
    const level = LEVELS.find(l => l.id === levelId)
    if (level) dispatch({ type: 'START_LEVEL', level })
  }, [])

  const exitLevel = useCallback(() => dispatch({ type: 'EXIT' }), [])

  // Player manually submits → calculate stars and finish
  const finishLevel = useCallback(() => {
    if (!state.goalMet || state.result) return
    const level = LEVELS.find(l => l.id === state.levelId)
    if (!level) return
    const stars = calcStars(level, state)
    dispatch({ type: 'FINISH', result: 'win', stars })
    saveProgress(level.id, stars, level.reward)
  }, [state, saveProgress])

  const tryMerge = useCallback((fromIdx, toIdx) => {
    const cells = state.cells
    const a = cells[fromIdx], b = cells[toIdx]
    if (!canMerge(a, b)) return false

    const ruleDef = MERGE_RULES[state.rule] || MERGE_RULES.normal
    const virtualCells = [...cells]
    virtualCells[fromIdx] = null
    const connected = findConnectedLevel(toIdx, virtualCells, ruleDef.dirs, state.cols, state.rows)
    if (!connected.includes(fromIdx)) connected.push(fromIdx)
    const all = [...new Set(connected)]
    if (all.length < 3) return false

    const newLv = a.lv + 1
    if (all.length >= 5) {
      const use = all.slice(0, 5)
      const secondEmpty = findRandomEmpty(cells, state.obstacles, state.cols * state.rows)
      const newTiles = [{ idx: toIdx, tile: createTileData(a.type, a.form, newLv) }]
      if (secondEmpty >= 0) newTiles.push({ idx: secondEmpty, tile: createTileData(a.type, a.form, newLv) })
      dispatch({ type: 'MERGE', indices: use, newTiles })
      return true
    }
    const use = all.slice(0, 3)
    dispatch({ type: 'MERGE', indices: use, newTiles: [{ idx: toIdx, tile: createTileData(a.type, a.form, newLv) }] })
    return true
  }, [state.cells, state.rule, state.cols, state.rows, state.obstacles])

  const moveTile = useCallback((from, to) => {
    if (state.obstacles.has(to)) return
    dispatch({ type: 'MOVE_TILE', from, to })
  }, [state.obstacles])

  const selectCell = useCallback((idx) => dispatch({ type: 'SELECT_CELL', idx }), [])
  const unpause = useCallback(() => dispatch({ type: 'UNPAUSE' }), [])

  const totalStars = Object.values(progress).reduce((s, p) => s + p.stars, 0)

  const value = {
    ...state, progress, totalStars,
    startLevel, exitLevel, finishLevel, tryMerge, moveTile, selectCell, unpause, dispatch,
    canMergeCheck: canMerge,
  }
  return <LevelContext.Provider value={value}>{children}</LevelContext.Provider>
}

export function useLevel() {
  const ctx = useContext(LevelContext)
  if (!ctx) throw new Error('useLevel must be inside LevelProvider')
  return ctx
}
