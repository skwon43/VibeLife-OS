import { useState, useEffect } from 'react'
import Week from './tabs/Week'
import Goals from './tabs/Goals'
import Habits from './tabs/Habits'
import Knowledge from './tabs/Knowledge'
import Ideas from './tabs/Ideas'
import Skills from './tabs/Skills'
import Career from './tabs/Career'

const GUEST_KEY = 'vibelife_guest_data'

const DEFAULT_DATA = {
  tasks: {}, habits: [], journal: {}, notes: [],
  goals: [], binders: [], skills: [], career: [],
  ideas: [], vocab: []
}

const TABS = [
  { id: 'week', label: '주간', icon: '📅' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'habits', label: 'Habits', icon: '🔄' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
  { id: 'know', label: '지식', icon: '📂' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'career', label: 'Career', icon: '💼' },
]

export default function GuestMain({ onLogin }) {
  const [activeTab, setActiveTab] = useState('week')
  const [data, setData] = useState(DEFAULT_DATA)

  // localStorage에서 불러오기
  useEffect(() => {
    try {
      const saved = localStorage.getItem(GUEST_KEY)
      if (saved) setData(JSON.parse(saved))
    } catch (e) {
      console.error('불러오기 실패:', e)
    }
  }, [])

  // localStorage에 저장
  function saveData(newData) {
    setData(prev => {
      const updated = { ...prev }
      Object.keys(newData).forEach(key => {
        if (
          typeof newData[key] === 'object' &&
          !Array.isArray(newData[key]) &&
          newData[key] !== null &&
          typeof prev[key] === 'object' &&
          !Array.isArray(prev[key])
        ) {
          updated[key] = { ...prev[key], ...newData[key] }
        } else {
          updated[key] = newData[key]
        }
      })
      // localStorage에 즉시 저장
      try {
        localStorage.setItem(GUEST_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error('저장 실패:', e)
      }
      return updated
    })
  }

  function renderTab() {
    const props = { data, saveData }
    switch (activeTab) {
      case 'week':   return <Week {...props} />
      case 'goals':  return <Goals {...props} />
      case 'habits': return <Habits {...props} />
      case 'know':   return <Knowledge {...props} />
      case 'ideas':  return <Ideas {...props} />
      case 'skills': return <Skills {...props} />
      case 'career': return <Career {...props} />
      default:       return <Week {...props} />
    }
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#F7F6FB', position: 'relative' }}>

      {/* 상단 헤더 */}
      <div style={{
        padding: '1.1rem 1rem 0.6rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#F7F6FB', position: 'sticky', top: 0, zIndex: 40
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
          Vibe<span style={{ color: '#7F77DD' }}>Life</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 게스트 뱃지 */}
          <span style={{
            fontSize: '11px', color: '#BA7517', background: '#FAEEDA',
            padding: '3px 9px', borderRadius: '10px', fontWeight: '500'
          }}>
            Guest
          </span>
          <button
            onClick={onLogin}
            style={{
              fontSize: '12px', color: '#7F77DD', background: '#EEEDFE',
              padding: '5px 12px', borderRadius: '20px',
              border: '1px solid #D0CEEA', cursor: 'pointer', fontWeight: '500'
            }}
          >
            로그인
          </button>
        </div>
      </div>

      {/* 게스트 안내 배너 */}
      <div style={{
        margin: '0 1rem 0.75rem',
        padding: '10px 14px',
        background: '#FAEEDA', borderRadius: '10px',
        border: '1px solid #F5C4B3',
        fontSize: '12px', color: '#633806', lineHeight: '1.5'
      }}>
        💡 지금 이 기기에만 저장돼. 로그인하면 모든 기기에서 쓸 수 있어!
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{
        padding: '0 1rem 5.5rem',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
        minHeight: 'calc(100vh - 60px)',
      }}>
        {renderTab()}
      </div>

      {/* 하단 네비게이션 */}
      <div style={{
        position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: '480px',
        background: 'rgba(247,246,251,0.95)', backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E8E7F2',
        padding: '0.5rem 0.5rem 0.9rem',
        display: 'flex', zIndex: 50
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: '3px', padding: '6px 2px',
              borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? '#EEEDFE' : 'transparent',
              color: activeTab === tab.id ? '#7F77DD' : '#9999b3',
              fontSize: '10px', fontFamily: 'sans-serif',
              transition: 'all 0.18s'
            }}
          >
            <span style={{ fontSize: '18px' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}