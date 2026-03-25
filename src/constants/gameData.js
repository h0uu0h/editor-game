// ========== 新闻类型视觉 ==========
export const TYPE_STYLES = {
  tech:    { bg: '#E6F1FB', bd: '#85B7EB', tx: '#0C447C', label: '🖥 科技' },
  finance: { bg: '#EAF3DE', bd: '#97C459', tx: '#27500A', label: '📈 财经' },
  sport:   { bg: '#FAECE7', bd: '#F0997B', tx: '#712B13', label: '⚽ 体育' },
  culture: { bg: '#EEEDFE', bd: '#AFA9EC', tx: '#3C3489', label: '🎨 文化' },
  world:   { bg: '#FBEAF0', bd: '#ED93B1', tx: '#72243E', label: '🌍 国际' },
}

export const LVL_BADGE = {
  1: { bg: '#D3D1C7', tx: '#2C2C2A' },
  2: { bg: '#85B7EB', tx: '#042C53' },
  3: { bg: '#6BC06B', tx: '#0A3A0A' },
  4: { bg: '#EF9F27', tx: '#412402' },
  5: { bg: '#E24B4A', tx: '#ffffff' },
  6: { bg: '#534AB7', tx: '#ffffff' },
  7: { bg: '#C4922A', tx: '#ffffff' },
  8: { bg: '#1A1A1A', tx: '#FFD700' },
}

export const FORMS = {
  fact:  { icon: '📋', name: '事实', color: '#185FA5' },
  quote: { icon: '🗣️', name: '引语', color: '#8B4513' },
  data:  { icon: '📊', name: '数据', color: '#2E7D32' },
  photo: { icon: '📷', name: '图片', color: '#6A1B9A' },
  scoop: { icon: '🔥', name: '独家', color: '#C62828' },
}

// ========== 合成链（8 级） ==========
export const CHAINS = {
  tech: [
    { lv: 1, icon: '📎', name: '线索碎片' },
    { lv: 2, icon: '📝', name: '采访笔记' },
    { lv: 3, icon: '💡', name: '选题方案' },
    { lv: 4, icon: '💻', name: '科技稿件', producer: true, produces: 'fact', interval: 12000 },
    { lv: 5, icon: '🖥️', name: '深度专栏', producer: true, produces: 'data', interval: 9000 },
    { lv: 6, icon: '🤖', name: 'AI特刊',  producer: true, produces: 'quote', interval: 7000 },
    { lv: 7, icon: '🏛️', name: '科技周刊', producer: true, produces: 'scoop', interval: 12000 },
    { lv: 8, icon: '🚀', name: '传奇刊物', producer: true, produces: 'scoop', interval: 6000 },
  ],
  finance: [
    { lv: 1, icon: '📎', name: '线索碎片' },
    { lv: 2, icon: '📝', name: '采访笔记' },
    { lv: 3, icon: '💡', name: '选题方案' },
    { lv: 4, icon: '💰', name: '财经稿件', producer: true, produces: 'data', interval: 12000 },
    { lv: 5, icon: '📊', name: '分析报告', producer: true, produces: 'quote', interval: 9000 },
    { lv: 6, icon: '🏦', name: '金融特刊', producer: true, produces: 'fact', interval: 7000 },
    { lv: 7, icon: '💎', name: '财富周刊', producer: true, produces: 'scoop', interval: 12000 },
    { lv: 8, icon: '👑', name: '传奇刊物', producer: true, produces: 'scoop', interval: 6000 },
  ],
  sport: [
    { lv: 1, icon: '📎', name: '线索碎片' },
    { lv: 2, icon: '📝', name: '采访笔记' },
    { lv: 3, icon: '💡', name: '选题方案' },
    { lv: 4, icon: '⚽', name: '赛事稿件', producer: true, produces: 'photo', interval: 12000 },
    { lv: 5, icon: '🏆', name: '深度战报', producer: true, produces: 'quote', interval: 9000 },
    { lv: 6, icon: '🥇', name: '冠军特刊', producer: true, produces: 'fact', interval: 7000 },
    { lv: 7, icon: '🏟️', name: '体育周刊', producer: true, produces: 'scoop', interval: 12000 },
    { lv: 8, icon: '🔥', name: '传奇刊物', producer: true, produces: 'scoop', interval: 6000 },
  ],
  culture: [
    { lv: 1, icon: '📎', name: '线索碎片' },
    { lv: 2, icon: '📝', name: '采访笔记' },
    { lv: 3, icon: '💡', name: '选题方案' },
    { lv: 4, icon: '🎨', name: '文化稿件', producer: true, produces: 'photo', interval: 12000 },
    { lv: 5, icon: '🎭', name: '深度评论', producer: true, produces: 'quote', interval: 9000 },
    { lv: 6, icon: '🖼️', name: '文化特刊', producer: true, produces: 'fact', interval: 7000 },
    { lv: 7, icon: '🎪', name: '文艺周刊', producer: true, produces: 'scoop', interval: 12000 },
    { lv: 8, icon: '✨', name: '传奇刊物', producer: true, produces: 'scoop', interval: 6000 },
  ],
  world: [
    { lv: 1, icon: '📎', name: '线索碎片' },
    { lv: 2, icon: '📝', name: '采访笔记' },
    { lv: 3, icon: '💡', name: '选题方案' },
    { lv: 4, icon: '🌐', name: '国际稿件', producer: true, produces: 'fact', interval: 12000 },
    { lv: 5, icon: '🕊️', name: '外交分析', producer: true, produces: 'data', interval: 9000 },
    { lv: 6, icon: '🌍', name: '国际特刊', producer: true, produces: 'quote', interval: 7000 },
    { lv: 7, icon: '🗺️', name: '环球周刊', producer: true, produces: 'scoop', interval: 12000 },
    { lv: 8, icon: '🌟', name: '传奇刊物', producer: true, produces: 'scoop', interval: 6000 },
  ],
}

export const TOPICS = [
  { id: 'tech',    label: '🖥 科技', drops: ['fact', 'data', 'quote'],
    headlines: ['国产大模型代码能力超越GPT-4', 'SpaceX星舰第七次试飞回收成功', '苹果Vision Pro二代搭载M5芯片', '量子计算突破：1000量子比特处理器', '全球首款脑机接口设备获FDA批准'] },
  { id: 'finance', label: '📈 财经', drops: ['fact', 'data', 'quote'],
    headlines: ['央行定向降准释放1.2万亿资金', 'A股北向资金净流入超120亿', '比特币突破10万美元大关', '新能源车企Q3利润翻倍', '数字人民币跨境支付试点扩大'] },
  { id: 'sport',   label: '⚽ 体育', drops: ['fact', 'photo', 'quote'],
    headlines: ['中国女足3:1大胜日本进决赛', 'NBA季后赛：湖人淘汰勇士', '巴黎奥运中国代表团420人', '梅西宣布退役引全球关注', '电竞正式成为亚运会正式项目'] },
  { id: 'culture', label: '🎨 文化', drops: ['fact', 'photo', 'quote'],
    headlines: ['故宫AI导览：与虚拟乾隆对话', '《三体》动画第二季正式定档', '敦煌数字藏经洞获UNESCO创新奖', 'AI生成艺术品拍出千万天价', '国家博物馆推出元宇宙展厅'] },
  { id: 'world',   label: '🌍 国际', drops: ['fact', 'data', 'quote'],
    headlines: ['联合国通过加沙人道主义决议', '欧盟全球首部AI监管法案生效', '金砖峰会聚焦去美元化议程', '北极航道全年通航成为现实', '全球可再生能源占比首超50%'] },
]

export const ORDER_TEMPLATES = [
  { title: '突发快报',   needs: ['fact', 'fact'],           reward: { coins: 40,  rep: 10 },  tier: 1 },
  { title: '图文报道',   needs: ['fact', 'photo'],          reward: { coins: 60,  rep: 20 },  tier: 1 },
  { title: '午间快讯',   needs: ['fact', 'quote'],          reward: { coins: 60,  rep: 20 },  tier: 1 },
  { title: '数据报告',   needs: ['data', 'data', 'fact'],   reward: { coins: 120, rep: 50 },  tier: 2 },
  { title: '人物专访',   needs: ['quote', 'quote', 'photo'],reward: { coins: 100, rep: 45 },  tier: 2 },
  { title: '深度调查',   needs: ['fact', 'data', 'scoop'],  reward: { coins: 180, rep: 90 },  tier: 3 },
  { title: '独家头条',   needs: ['scoop', 'quote', 'data'], reward: { coins: 250, rep: 150 }, tier: 3 },
]

export const BREAKING_NEWS = [
  { headline: '🔴 突发：重大科技突破！', type: 'tech',    bonus: 'scoop', reward: { coins: 100, rep: 50 }, duration: 30000 },
  { headline: '🔴 突发：股市剧烈波动！', type: 'finance', bonus: 'data',  reward: { coins: 80, rep: 40 },  duration: 25000 },
  { headline: '🔴 突发：冠军赛绝杀时刻！', type: 'sport', bonus: 'photo', reward: { coins: 80, rep: 40 },  duration: 25000 },
  { headline: '🔴 突发：文化遗产重大发现！', type: 'culture', bonus: 'quote', reward: { coins: 80, rep: 40 },  duration: 25000 },
  { headline: '🔴 突发：国际局势巨变！', type: 'world',  bonus: 'scoop', reward: { coins: 120, rep: 60 }, duration: 30000 },
]

export const GRID_COLS = 7
export const GRID_ROWS = 7
export const TOTAL_CELLS = GRID_COLS * GRID_ROWS

// ========== 多页报纸系统 ==========
export const PAGE_DEFS = [
  {
    id: 'front',
    name: '头版 A1',
    icon: '📰',
    desc: '综合版面',
    unlockCost: 0,
    unlockRep: 0,
    boost: null,  // 无特殊加成
    locked: new Set([
      ...Array.from({ length: GRID_COLS * 2 }, (_, i) => TOTAL_CELLS - GRID_COLS * 2 + i),
      GRID_COLS * 4 + 5, GRID_COLS * 4 + 6,
      GRID_COLS * 3 + 5, GRID_COLS * 3 + 6,
    ]),
    obstacles: new Set([10, 24, 4, 30]),
    obstacleContent: {
      10: { icon: '📺', label: '广告位' },
      24: { icon: '🏷️', label: '推广' },
      4:  { icon: '☕', label: '赞助商' },
      30: { icon: '📢', label: '公告栏' },
    },
  },
  {
    id: 'finance',
    name: '财经版 B1',
    icon: '📈',
    desc: '财经类合成效率 +1',
    unlockCost: 2000,
    unlockRep: 200,
    boost: { type: 'finance', mergeCount: 2 }, // 2合1
    locked: new Set([
      ...Array.from({ length: GRID_COLS * 3 }, (_, i) => TOTAL_CELLS - GRID_COLS * 3 + i),
    ]),
    obstacles: new Set([3, 17, 31]),
    obstacleContent: {
      3:  { icon: '📊', label: '行情屏' },
      17: { icon: '💹', label: '指数' },
      31: { icon: '🏦', label: '银行广告' },
    },
  },
  {
    id: 'sport',
    name: '体育版 C1',
    icon: '⚽',
    desc: '体育类合成效率 +1',
    unlockCost: 5000,
    unlockRep: 500,
    boost: { type: 'sport', mergeCount: 2 },
    locked: new Set([
      ...Array.from({ length: GRID_COLS * 3 }, (_, i) => TOTAL_CELLS - GRID_COLS * 3 + i),
      GRID_COLS * 3 + 6,
    ]),
    obstacles: new Set([0, 20, 27]),
    obstacleContent: {
      0:  { icon: '🏟️', label: '赛事' },
      20: { icon: '🎯', label: '竞猜' },
      27: { icon: '🏅', label: '奖牌榜' },
    },
  },
  {
    id: 'culture',
    name: '文化版 D1',
    icon: '🎨',
    desc: '文化类合成效率 +1',
    unlockCost: 10000,
    unlockRep: 1000,
    boost: { type: 'culture', mergeCount: 2 },
    locked: new Set([
      ...Array.from({ length: GRID_COLS * 3 }, (_, i) => TOTAL_CELLS - GRID_COLS * 3 + i),
    ]),
    obstacles: new Set([6, 14, 35]),
    obstacleContent: {
      6:  { icon: '🎭', label: '演出' },
      14: { icon: '🖼️', label: '展览' },
      35: { icon: '📚', label: '书评' },
    },
  },
  {
    id: 'world',
    name: '国际版 E1',
    icon: '🌍',
    desc: '国际类合成效率 +1',
    unlockCost: 20000,
    unlockRep: 2000,
    boost: { type: 'world', mergeCount: 2 },
    locked: new Set([
      ...Array.from({ length: GRID_COLS * 3 }, (_, i) => TOTAL_CELLS - GRID_COLS * 3 + i),
      GRID_COLS * 2 + 6, GRID_COLS * 3 + 6,
    ]),
    obstacles: new Set([2, 24, 32]),
    obstacleContent: {
      2:  { icon: '🌐', label: '时区' },
      24: { icon: '🗺️', label: '地图' },
      32: { icon: '🕊️', label: '和平' },
    },
  },
]

// 每页内的扩建价格（递增）
export const PAGE_EXPAND_PRICES = [
  80, 200, 500, 1000, 2000, 3000, 5000,
]

export const SELL_PRICES = { 1: 5, 2: 15, 3: 40, 4: 100, 5: 250, 6: 500, 7: 1000, 8: 2500 }
export function getSellPrice(tile) {
  const base = SELL_PRICES[tile.lv] || 5
  return Math.floor(base * (tile.form === 'scoop' ? 1.5 : 1))
}

export function getChainItem(type, lv) {
  return CHAINS[type]?.find(c => c.lv === lv)
}

export function createTileData(type, form, lv) {
  const ci = getChainItem(type, lv)
  return {
    id: Date.now() + '_' + Math.random().toString(36).slice(2, 8),
    type, form, lv,
    icon: ci ? ci.icon : FORMS[form]?.icon || '📎',
    name: ci ? ci.name : `${FORMS[form]?.name || ''} Lv${lv}`,
    isProducer: ci?.producer || false,
    produces: ci?.produces,
    interval: ci?.interval,
  }
}

// BFS 相邻连通
export function findConnectedSame(startIdx, cells, cols = GRID_COLS, rows = GRID_ROWS) {
  const tile = cells[startIdx]
  if (!tile) return []
  const visited = new Set([startIdx])
  const queue = [startIdx]
  const result = [startIdx]
  while (queue.length) {
    const cur = queue.shift()
    const r = Math.floor(cur / cols), c = cur % cols
    for (const [dr, dc] of [[-1,0],[1,0],[0,-1],[0,1]]) {
      const nr = r + dr, nc = c + dc
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols) continue
      const ni = nr * cols + nc
      if (visited.has(ni)) continue
      visited.add(ni)
      if (cells[ni] && cells[ni].type === tile.type && cells[ni].lv === tile.lv) {
        result.push(ni)
        queue.push(ni)
      }
    }
  }
  return result
}
