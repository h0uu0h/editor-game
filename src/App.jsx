import { useEffect, useState, useCallback } from 'react'
import { GameProvider, useGame } from './context/GameContext'
import { LevelProvider, useLevel } from './context/LevelContext'
import TopBar from './components/TopBar'
import MergeBoard from './components/MergeBoard'
import Sidebar from './components/Sidebar'
import PageTabs from './components/PageTabs'
import Toasts from './components/Toasts'
import PublishModal from './components/PublishModal'
import Particles from './components/Particles'
import StoryMode from './components/StoryMode'
import Onboarding from './components/Onboarding'
import { createTileData } from './constants/gameData'

function GameInit() {
  const { cells, dispatch } = useGame()
  useEffect(() => {
    if (!cells.some(Boolean)) {
      dispatch({
        type: 'SPAWN_ITEMS',
        items: [
          { tile: createTileData('tech', 'fact', 1), targetIdx: 0 },
          { tile: createTileData('tech', 'fact', 1), targetIdx: 1 },
          { tile: createTileData('tech', 'fact', 1), targetIdx: 2 },
          { tile: createTileData('tech', 'quote', 1), targetIdx: 7 },
          { tile: createTileData('finance', 'data', 1), targetIdx: 8 },
          { tile: createTileData('sport', 'photo', 1), targetIdx: 9 },
        ],
      })
      dispatch({ type: 'INIT_ORDERS' })
    }
  }, [])
  return null
}

function AppInner() {
  const [showStory, setShowStory] = useState(false)
  const { active: levelActive } = useLevel()

  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('onboarding_done')
  })

  const finishOnboarding = useCallback(() => {
    setShowOnboarding(false)
    localStorage.setItem('onboarding_done', '1')
  }, [])

  return (
    <>
      <GameInit />
      <TopBar onStoryClick={() => setShowStory(true)} />
      <div className="main-layout">
        <MergeBoard />
        <Sidebar />
      </div>
      <PageTabs />
      <Toasts />
      <PublishModal />
      <Particles />
      {(showStory || levelActive) && (
        <StoryMode onClose={() => setShowStory(false)} />
      )}
      {showOnboarding && <Onboarding onFinish={finishOnboarding} />}
    </>
  )
}

export default function App() {
  return (
    <GameProvider>
      <LevelProvider>
        <AppInner />
      </LevelProvider>
    </GameProvider>
  )
}
