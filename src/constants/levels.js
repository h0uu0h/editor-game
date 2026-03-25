import { createTileData } from './gameData'

// ========== 合成规则变体 ==========
export const MERGE_RULES = {
  normal:   { id: 'normal',   name: '标准',     desc: '上下左右相邻合成', icon: '➕', dirs: [[-1,0],[1,0],[0,-1],[0,1]] },
  diagonal: { id: 'diagonal', name: '对角线',   desc: '只能斜向合成',     icon: '✖️', dirs: [[-1,-1],[-1,1],[1,-1],[1,1]] },
  skip:     { id: 'skip',     name: '隔一格',   desc: '隔一格才能合成',   icon: '⏭️', dirs: [[-2,0],[2,0],[0,-2],[0,2]] },
  sameRow:  { id: 'sameRow',  name: '同行限定', desc: '只有同一行内合成', icon: '↔️', dirs: [[0,-1],[0,1]] },
  sameCol:  { id: 'sameCol',  name: '同列限定', desc: '只有同一列内合成', icon: '↕️', dirs: [[-1,0],[1,0]] },
  allDir:   { id: 'allDir',   name: '八方合成', desc: '八个方向都能合成', icon: '🌟', dirs: [[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[-1,1],[1,-1],[1,1]] },
}

export const CHAPTERS = [
  { id: 1, name: '第一章：实习记者', desc: '学习基本合成技巧', icon: '📋', requiredStars: 0 },
  { id: 2, name: '第二章：外勤采访', desc: '掌握特殊合成规则', icon: '🎤', requiredStars: 8 },
  { id: 3, name: '第三章：深度调查', desc: '挑战复杂版面',     icon: '🔍', requiredStars: 20 },
]

// ========== 关卡定义 ==========
export const LEVELS = [
  // ===================== 章节 1：实习记者 =====================
  {
    id: 'L1-1',
    chapter: 1,
    name: '第一条线索',
    desc: '在杂乱的桌面上合出 2 个采访笔记（Lv2）',
    cols: 5, rows: 5,
    rule: 'normal',
    goal: { type: 'reach', targetType: null, targetLv: 2, count: 2 },
    timeLimit: 40,
    moveLimit: 0,
    tiles: [
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 2, type: 'finance', form: 'data', lv: 1 },
      { r: 0, c: 4, type: 'tech', form: 'data', lv: 1 },
      { r: 1, c: 1, type: 'sport', form: 'photo', lv: 1 },
      { r: 1, c: 3, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 0, type: 'finance', form: 'data', lv: 1 },
      { r: 2, c: 2, type: 'culture', form: 'quote', lv: 1 },
      { r: 2, c: 4, type: 'finance', form: 'quote', lv: 1 },
      { r: 3, c: 1, type: 'tech', form: 'fact', lv: 1 },
      { r: 3, c: 3, type: 'sport', form: 'photo', lv: 1 },
      { r: 4, c: 0, type: 'sport', form: 'fact', lv: 1 },
      { r: 4, c: 2, type: 'culture', form: 'quote', lv: 1 },
      { r: 4, c: 4, type: 'culture', form: 'fact', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 0 }, { r: 3, c: 4 }],
    reward: { coins: 60, rep: 15 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '25秒内完成', condition: 'time', value: 25 },
      { desc: '合出 Lv3', condition: 'reach', targetLv: 3, count: 1 },
    ],
  },
  {
    id: 'L1-2',
    chapter: 1,
    name: '素材分拣',
    desc: '合出 1 个选题方案（Lv3）',
    cols: 6, rows: 5,
    rule: 'normal',
    goal: { type: 'reach', targetType: null, targetLv: 3, count: 1 },
    timeLimit: 50,
    moveLimit: 0,
    tiles: [
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 1, type: 'tech', form: 'data', lv: 1 },
      { r: 0, c: 3, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 5, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 1, c: 2, type: 'sport', form: 'photo', lv: 1 },
      { r: 1, c: 4, type: 'tech', form: 'quote', lv: 1 },
      { r: 2, c: 1, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 3, type: 'tech', form: 'data', lv: 1 },
      { r: 2, c: 5, type: 'sport', form: 'photo', lv: 1 },
      { r: 3, c: 0, type: 'finance', form: 'data', lv: 1 },
      { r: 3, c: 2, type: 'tech', form: 'fact', lv: 1 },
      { r: 3, c: 4, type: 'finance', form: 'quote', lv: 1 },
      { r: 4, c: 1, type: 'sport', form: 'fact', lv: 1 },
      { r: 4, c: 3, type: 'tech', form: 'fact', lv: 1 },
      { r: 4, c: 5, type: 'finance', form: 'data', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 1 }, { r: 3, c: 3 }, { r: 2, c: 4 }],
    reward: { coins: 100, rep: 25 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '35秒内完成', condition: 'time', value: 35 },
      { desc: '完成 6 次合成', condition: 'score', merges: 6 },
    ],
  },
  {
    id: 'L1-3',
    chapter: 1,
    name: '截稿压力',
    desc: '限 12 步内合出 2 个 Lv3',
    cols: 6, rows: 5,
    rule: 'normal',
    goal: { type: 'reach', targetType: null, targetLv: 3, count: 2 },
    timeLimit: 0,
    moveLimit: 18,
    tiles: [
      // tech cluster 1
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 1, type: 'tech', form: 'fact', lv: 1 },
      { r: 1, c: 0, type: 'tech', form: 'data', lv: 1 },
      { r: 1, c: 2, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 0, type: 'tech', form: 'quote', lv: 2 },
      { r: 2, c: 1, type: 'tech', form: 'fact', lv: 2 },
      // finance cluster
      { r: 0, c: 4, type: 'finance', form: 'data', lv: 1 },
      { r: 0, c: 5, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 4, type: 'finance', form: 'quote', lv: 1 },
      { r: 1, c: 5, type: 'finance', form: 'data', lv: 2 },
      { r: 2, c: 4, type: 'finance', form: 'fact', lv: 2 },
      // distractors
      { r: 3, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 3, c: 2, type: 'culture', form: 'quote', lv: 1 },
      { r: 3, c: 5, type: 'world', form: 'fact', lv: 1 },
      { r: 4, c: 1, type: 'sport', form: 'fact', lv: 1 },
      { r: 4, c: 3, type: 'culture', form: 'quote', lv: 1 },
      { r: 4, c: 5, type: 'finance', form: 'data', lv: 2 },
    ],
    obstacles: [{ r: 1, c: 1 }, { r: 2, c: 3 }, { r: 3, c: 4 }, { r: 4, c: 0 }],
    reward: { coins: 120, rep: 30 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '12步内完成', condition: 'moves', value: 12 },
      { desc: '合出 Lv4', condition: 'reach', targetLv: 4, count: 1 },
    ],
  },
  {
    id: 'L1-4',
    chapter: 1,
    name: '主编考核',
    desc: '30秒+15步 合出 Lv4 稿件',
    cols: 6, rows: 6,
    rule: 'normal',
    goal: { type: 'reach', targetType: null, targetLv: 4, count: 1 },
    timeLimit: 35,
    moveLimit: 20,
    tiles: [
      // pre-built Lv2s and Lv1s for tech
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 2 },
      { r: 0, c: 1, type: 'tech', form: 'data', lv: 2 },
      { r: 0, c: 3, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 5, type: 'tech', form: 'fact', lv: 1 },
      { r: 1, c: 0, type: 'tech', form: 'quote', lv: 1 },
      { r: 1, c: 2, type: 'tech', form: 'fact', lv: 2 },
      { r: 1, c: 4, type: 'tech', form: 'data', lv: 1 },
      { r: 2, c: 1, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 3, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 5, type: 'tech', form: 'quote', lv: 3 },
      // noise
      { r: 3, c: 0, type: 'finance', form: 'data', lv: 1 },
      { r: 3, c: 2, type: 'sport', form: 'photo', lv: 1 },
      { r: 3, c: 4, type: 'culture', form: 'quote', lv: 2 },
      { r: 4, c: 1, type: 'world', form: 'fact', lv: 1 },
      { r: 4, c: 3, type: 'finance', form: 'data', lv: 2 },
      { r: 4, c: 5, type: 'sport', form: 'fact', lv: 1 },
      { r: 5, c: 0, type: 'culture', form: 'quote', lv: 1 },
      { r: 5, c: 2, type: 'world', form: 'data', lv: 1 },
      { r: 5, c: 4, type: 'finance', form: 'quote', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 1 }, { r: 1, c: 3 }, { r: 3, c: 1 }, { r: 3, c: 3 }, { r: 4, c: 4 }],
    reward: { coins: 180, rep: 50 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '20秒内完成', condition: 'time', value: 20 },
      { desc: '合出 Lv5', condition: 'reach', targetLv: 5, count: 1 },
    ],
  },

  // ===================== 章节 2：外勤采访 =====================
  {
    id: 'L2-1',
    chapter: 2,
    name: '斜线采访',
    desc: '对角线合成！合出 3 个 Lv2',
    cols: 6, rows: 6,
    rule: 'diagonal',
    goal: { type: 'reach', targetType: null, targetLv: 2, count: 3 },
    timeLimit: 55,
    moveLimit: 0,
    tiles: [
      // diagonal chains
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 1, c: 1, type: 'tech', form: 'data', lv: 1 },
      { r: 2, c: 2, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 5, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 4, type: 'finance', form: 'data', lv: 1 },
      { r: 2, c: 3, type: 'finance', form: 'quote', lv: 1 },
      { r: 3, c: 1, type: 'sport', form: 'photo', lv: 1 },
      { r: 4, c: 2, type: 'sport', form: 'photo', lv: 1 },
      { r: 5, c: 3, type: 'sport', form: 'fact', lv: 1 },
      // extra scattered
      { r: 3, c: 4, type: 'tech', form: 'fact', lv: 1 },
      { r: 4, c: 5, type: 'finance', form: 'data', lv: 1 },
      { r: 5, c: 0, type: 'culture', form: 'quote', lv: 1 },
      { r: 0, c: 3, type: 'world', form: 'fact', lv: 1 },
      { r: 4, c: 0, type: 'world', form: 'data', lv: 1 },
      { r: 2, c: 5, type: 'culture', form: 'fact', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 2 }, { r: 3, c: 3 }, { r: 5, c: 5 }],
    reward: { coins: 150, rep: 35 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '35秒内完成', condition: 'time', value: 35 },
      { desc: '合出 Lv3', condition: 'reach', targetLv: 3, count: 1 },
    ],
  },
  {
    id: 'L2-2',
    chapter: 2,
    name: '隔空取材',
    desc: '隔一格合成！合出 Lv3',
    cols: 7, rows: 5,
    rule: 'skip',
    goal: { type: 'reach', targetType: null, targetLv: 3, count: 1 },
    timeLimit: 60,
    moveLimit: 0,
    tiles: [
      // spaced for skip merge
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 2, type: 'tech', form: 'data', lv: 1 },
      { r: 0, c: 4, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 6, type: 'finance', form: 'data', lv: 1 },
      { r: 2, c: 0, type: 'tech', form: 'fact', lv: 2 },
      { r: 2, c: 2, type: 'tech', form: 'data', lv: 2 },
      { r: 2, c: 4, type: 'tech', form: 'quote', lv: 2 },
      { r: 2, c: 6, type: 'finance', form: 'data', lv: 1 },
      { r: 4, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 4, c: 2, type: 'sport', form: 'photo', lv: 1 },
      { r: 4, c: 4, type: 'sport', form: 'fact', lv: 1 },
      { r: 4, c: 6, type: 'finance', form: 'data', lv: 2 },
      // fillers blocking paths
      { r: 1, c: 1, type: 'culture', form: 'quote', lv: 1 },
      { r: 1, c: 5, type: 'world', form: 'fact', lv: 1 },
      { r: 3, c: 1, type: 'world', form: 'data', lv: 1 },
      { r: 3, c: 5, type: 'culture', form: 'fact', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 3 }, { r: 3, c: 3 }, { r: 2, c: 3 }],
    reward: { coins: 200, rep: 45 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '40秒内完成', condition: 'time', value: 40 },
      { desc: '合出 2 个 Lv3', condition: 'reach', targetLv: 3, count: 2 },
    ],
  },
  {
    id: 'L2-3',
    chapter: 2,
    name: '横版排列',
    desc: '同行合成！12步内合 3 个 Lv2',
    cols: 7, rows: 5,
    rule: 'sameRow',
    goal: { type: 'reach', targetType: null, targetLv: 2, count: 3 },
    timeLimit: 0,
    moveLimit: 16,
    tiles: [
      // row 0 tech
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 2, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 5, type: 'tech', form: 'data', lv: 1 },
      // row 1 finance
      { r: 1, c: 1, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 3, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 6, type: 'finance', form: 'quote', lv: 1 },
      // row 2 sport
      { r: 2, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 2, c: 2, type: 'sport', form: 'photo', lv: 1 },
      { r: 2, c: 4, type: 'sport', form: 'fact', lv: 1 },
      // row 3 mixed distractors
      { r: 3, c: 0, type: 'culture', form: 'quote', lv: 1 },
      { r: 3, c: 3, type: 'world', form: 'fact', lv: 1 },
      { r: 3, c: 6, type: 'tech', form: 'fact', lv: 1 },
      // row 4
      { r: 4, c: 1, type: 'culture', form: 'quote', lv: 1 },
      { r: 4, c: 4, type: 'world', form: 'data', lv: 1 },
    ],
    obstacles: [{ r: 0, c: 3 }, { r: 1, c: 5 }, { r: 2, c: 6 }, { r: 4, c: 3 }],
    reward: { coins: 220, rep: 50 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '10步内完成', condition: 'moves', value: 10 },
      { desc: '合出 Lv3', condition: 'reach', targetLv: 3, count: 1 },
    ],
  },
  {
    id: 'L2-4',
    chapter: 2,
    name: '纵向突破',
    desc: '同列合成！45秒合出 Lv3',
    cols: 6, rows: 7,
    rule: 'sameCol',
    goal: { type: 'reach', targetType: null, targetLv: 3, count: 1 },
    timeLimit: 45,
    moveLimit: 0,
    tiles: [
      // col 0 tech
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 4, c: 0, type: 'tech', form: 'data', lv: 1 },
      { r: 6, c: 0, type: 'tech', form: 'fact', lv: 2 },
      // col 2 finance
      { r: 0, c: 2, type: 'finance', form: 'data', lv: 1 },
      { r: 1, c: 2, type: 'finance', form: 'data', lv: 1 },
      { r: 3, c: 2, type: 'finance', form: 'quote', lv: 1 },
      { r: 5, c: 2, type: 'finance', form: 'data', lv: 2 },
      // col 4 tech
      { r: 1, c: 4, type: 'tech', form: 'fact', lv: 2 },
      { r: 3, c: 4, type: 'tech', form: 'data', lv: 2 },
      // scattered
      { r: 0, c: 5, type: 'sport', form: 'photo', lv: 1 },
      { r: 2, c: 3, type: 'culture', form: 'quote', lv: 1 },
      { r: 4, c: 5, type: 'world', form: 'fact', lv: 1 },
      { r: 6, c: 3, type: 'sport', form: 'photo', lv: 1 },
    ],
    obstacles: [{ r: 1, c: 0 }, { r: 3, c: 0 }, { r: 2, c: 2 }, { r: 4, c: 2 }, { r: 3, c: 5 }],
    reward: { coins: 250, rep: 55 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '30秒内完成', condition: 'time', value: 30 },
      { desc: '完成 5 次合成', condition: 'score', merges: 5 },
    ],
  },

  // ===================== 章节 3：深度调查 =====================
  {
    id: 'L3-1',
    chapter: 3,
    name: '迷宫版面',
    desc: '障碍重重！合出 2 个 Lv4',
    cols: 7, rows: 7,
    rule: 'normal',
    goal: { type: 'reach', targetType: null, targetLv: 4, count: 1 },
    timeLimit: 75,
    moveLimit: 0,
    tiles: [
      // tech chain path
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 2 },
      { r: 0, c: 1, type: 'tech', form: 'data', lv: 2 },
      { r: 0, c: 2, type: 'tech', form: 'fact', lv: 1 },
      { r: 0, c: 5, type: 'tech', form: 'fact', lv: 2 },
      { r: 1, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 1, c: 5, type: 'tech', form: 'data', lv: 1 },
      { r: 2, c: 0, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 5, type: 'tech', form: 'fact', lv: 1 },
      { r: 2, c: 6, type: 'tech', form: 'fact', lv: 3 },
      // finance chain
      { r: 4, c: 0, type: 'finance', form: 'data', lv: 2 },
      { r: 4, c: 1, type: 'finance', form: 'data', lv: 2 },
      { r: 4, c: 2, type: 'finance', form: 'quote', lv: 2 },
      { r: 5, c: 0, type: 'finance', form: 'data', lv: 1 },
      { r: 5, c: 1, type: 'finance', form: 'quote', lv: 3 },
      // distractors
      { r: 6, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 6, c: 2, type: 'culture', form: 'quote', lv: 1 },
      { r: 6, c: 4, type: 'world', form: 'fact', lv: 2 },
      { r: 6, c: 6, type: 'sport', form: 'fact', lv: 1 },
      { r: 3, c: 6, type: 'culture', form: 'quote', lv: 2 },
      { r: 0, c: 4, type: 'world', form: 'data', lv: 1 },
    ],
    obstacles: [
      { r: 1, c: 2 }, { r: 1, c: 3 }, { r: 1, c: 4 },
      { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 2 }, { r: 3, c: 3 },
      { r: 5, c: 3 }, { r: 5, c: 4 }, { r: 5, c: 5 },
    ],
    reward: { coins: 350, rep: 100 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '50秒内完成', condition: 'time', value: 50 },
      { desc: '合出 Lv5', condition: 'reach', targetLv: 5, count: 1 },
    ],
  },
  {
    id: 'L3-2',
    chapter: 3,
    name: '对角迷局',
    desc: '对角线 + 障碍！合出 Lv4',
    cols: 7, rows: 7,
    rule: 'diagonal',
    goal: { type: 'reach', targetType: null, targetLv: 4, count: 1 },
    timeLimit: 90,
    moveLimit: 25,
    tiles: [
      // diagonal-ready clusters
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 2 },
      { r: 1, c: 1, type: 'tech', form: 'data', lv: 2 },
      { r: 2, c: 2, type: 'tech', form: 'fact', lv: 2 },
      { r: 3, c: 3, type: 'tech', form: 'fact', lv: 3 },
      { r: 0, c: 6, type: 'finance', form: 'data', lv: 2 },
      { r: 1, c: 5, type: 'finance', form: 'data', lv: 2 },
      { r: 2, c: 4, type: 'finance', form: 'quote', lv: 2 },
      { r: 4, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 5, c: 1, type: 'sport', form: 'photo', lv: 1 },
      { r: 6, c: 2, type: 'sport', form: 'fact', lv: 1 },
      { r: 4, c: 4, type: 'culture', form: 'quote', lv: 1 },
      { r: 5, c: 5, type: 'culture', form: 'quote', lv: 1 },
      { r: 6, c: 6, type: 'culture', form: 'fact', lv: 1 },
      { r: 4, c: 6, type: 'tech', form: 'fact', lv: 3 },
      { r: 6, c: 0, type: 'world', form: 'data', lv: 2 },
    ],
    obstacles: [
      { r: 0, c: 3 }, { r: 1, c: 3 },
      { r: 3, c: 0 }, { r: 3, c: 1 }, { r: 3, c: 5 }, { r: 3, c: 6 },
      { r: 5, c: 3 }, { r: 6, c: 3 },
    ],
    reward: { coins: 500, rep: 150 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '60秒内完成', condition: 'time', value: 60 },
      { desc: '15步内完成', condition: 'moves', value: 15 },
    ],
  },
  {
    id: 'L3-3',
    chapter: 3,
    name: '终极特刊',
    desc: '八方合成！60秒合出 Lv5 传奇',
    cols: 7, rows: 7,
    rule: 'allDir',
    goal: { type: 'reach', targetType: null, targetLv: 5, count: 1 },
    timeLimit: 60,
    moveLimit: 0,
    tiles: [
      // high level pieces scattered
      { r: 0, c: 0, type: 'tech', form: 'fact', lv: 3 },
      { r: 0, c: 3, type: 'tech', form: 'data', lv: 3 },
      { r: 0, c: 6, type: 'tech', form: 'fact', lv: 2 },
      { r: 1, c: 1, type: 'tech', form: 'fact', lv: 2 },
      { r: 1, c: 5, type: 'tech', form: 'data', lv: 2 },
      { r: 2, c: 3, type: 'tech', form: 'quote', lv: 4 },
      { r: 3, c: 0, type: 'tech', form: 'fact', lv: 3 },
      { r: 3, c: 6, type: 'tech', form: 'data', lv: 4 },
      // need to merge Lv4s — need 3 of them
      // distractors & blockers
      { r: 4, c: 2, type: 'finance', form: 'data', lv: 3 },
      { r: 4, c: 4, type: 'sport', form: 'photo', lv: 3 },
      { r: 5, c: 1, type: 'culture', form: 'quote', lv: 2 },
      { r: 5, c: 5, type: 'world', form: 'fact', lv: 2 },
      { r: 6, c: 0, type: 'sport', form: 'photo', lv: 1 },
      { r: 6, c: 3, type: 'finance', form: 'data', lv: 1 },
      { r: 6, c: 6, type: 'culture', form: 'quote', lv: 1 },
    ],
    obstacles: [
      { r: 1, c: 3 }, { r: 2, c: 1 }, { r: 2, c: 5 },
      { r: 4, c: 0 }, { r: 4, c: 6 },
      { r: 5, c: 3 },
    ],
    reward: { coins: 800, rep: 250 },
    stars: [
      { desc: '完成关卡', condition: 'complete' },
      { desc: '40秒内完成', condition: 'time', value: 40 },
      { desc: '合出 2 个 Lv5', condition: 'reach', targetLv: 5, count: 2 },
    ],
  },
]

// ========== helpers ==========
export function buildLevelCells(level) {
  const total = level.cols * level.rows
  const cells = new Array(total).fill(null)
  for (const t of level.tiles) {
    const idx = t.r * level.cols + t.c
    cells[idx] = createTileData(t.type, t.form, t.lv)
  }
  const obstacles = new Set()
  for (const o of level.obstacles) obstacles.add(o.r * level.cols + o.c)
  return { cells, obstacles }
}

export function findConnectedLevel(startIdx, cells, dirs, cols, rows) {
  const tile = cells[startIdx]
  if (!tile) return []
  const visited = new Set([startIdx])
  const queue = [startIdx]
  const result = [startIdx]
  while (queue.length) {
    const cur = queue.shift()
    const r = Math.floor(cur / cols), c = cur % cols
    for (const [dr, dc] of dirs) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const ni = nr * cols + nc
      if (visited.has(ni)) continue
      visited.add(ni)
      if (cells[ni] && cells[ni].type === tile.type && cells[ni].lv === tile.lv) {
        result.push(ni); queue.push(ni)
      }
    }
  }
  return result
}
