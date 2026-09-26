import { useState } from 'react'
import './App.css'
import PlaySection from './components/section/PlaySection/PlaySection'
import RecordSection from './components/section/RecordSection/RecordSection'

function App() {
    const [tab, setTab] = useState('play') // 'play', 'record'
    const [isPlaying, setIsPlaying] = useState(false)
    const [mode, setMode] = useState('normal') // 'basic', 'normal', 'review'
    const [basicSettings, setBasicSettings] = useState({
        timesTable: Array(9).fill(false),
        order: 'inorder'
    })
    const [normalSettings, setNormalSettings] = useState({
        op: '+',
        range: 'positive',
        count: 20
    })
    const [reviewSettings, setReviewSettings] = useState({
        count: 20
    })

  return (
    <>
    <div className="app-container">
        <nav className="tab-nav">
            <button 
                id="tab-play-btn" 
                className={`tab-btn ${tab === "play" ? "active" : ""}`}
                onClick={() => setTab("play")}
                disabled={isPlaying}
            >
                問題に挑戦
            </button>

            <button 
                id="tab-record-btn"
                className={`tab-btn ${tab === "record" ? "active" : ""}`}
                onClick={ () => setTab("record")}
                disabled={isPlaying}
            >
                過去の記録
            </button>
        </nav>

      { tab === "play" && 
          <PlaySection 
          setIsPlaying={setIsPlaying}
          mode={mode} setMode={setMode}
          basicSettings={basicSettings} setBasicSettings={setBasicSettings}
          normalSettings={normalSettings} setNormalSettings={setNormalSettings}
          reviewSettings={reviewSettings} setReviewSettings={setReviewSettings}
          /> 
      }
      { tab === "record" && <RecordSection normalSettings={normalSettings}/> }
    </div>

    </>
  )
}

export default App
