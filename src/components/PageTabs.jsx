import { useGame } from '../context/GameContext'
import { PAGE_DEFS } from '../constants/gameData'

export default function PageTabs() {
  const { pages, currentPage, switchPage, unlockPage, coins, reputation } = useGame()

  return (
    <div className="page-tabs">
      {pages.map((pg, i) => {
        const def = PAGE_DEFS[i]
        const isCurrent = i === currentPage
        const isUnlocked = pg.unlocked

        if (!isUnlocked) {
          const canAfford = coins >= def.unlockCost && reputation >= def.unlockRep
          return (
            <div
              key={def.id}
              className={`page-tab locked-tab${canAfford ? ' affordable' : ''}`}
              onClick={() => canAfford && unlockPage(i)}
              title={`解锁：${def.unlockCost} 💰 + ${def.unlockRep} 🏆`}
            >
              <span className="tab-icon">🔒</span>
              <span className="tab-name">{def.name}</span>
              <span className="tab-cost">{def.unlockCost}💰</span>
            </div>
          )
        }

        return (
          <div
            key={def.id}
            className={`page-tab${isCurrent ? ' active' : ''}`}
            onClick={() => switchPage(i)}
          >
            <span className="tab-icon">{def.icon}</span>
            <span className="tab-name">{def.name}</span>
            {def.boost && <span className="tab-boost">{def.boost.type === def.id ? '★' : ''}</span>}
          </div>
        )
      })}
    </div>
  )
}
