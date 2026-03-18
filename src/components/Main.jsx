import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import Week from './tabs/Week'
import Goals from './tabs/Goals'
import Habits from './tabs/Habits'
import Knowledge from './tabs/Knowledge'
import Ideas from './tabs/Ideas'
import Skills from './tabs/Skills'
import Career from './tabs/Career'

// 하단 네비게이션 탭 정의
const TABS = [
  { id: 'week', label: '주간', icon: '📅' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'habits', label: 'Habits', icon: '🔄' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
  { id: 'know', label: '지식', icon: '📂' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'career', label: 'Career', icon: '💼' },
]

export default function Main({ session }) {
  const [activeTab, setActiveTab] = useState('week')
  const [data, setData] = useState({
    tasks: {}, habits: [], journal: {}, notes: [],
    goals: [], binders: [], skills: [], career: [],
    ideas: [], vocab: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: row } = await supabase
      .from('vibelife_data')
      .select('data')
      .eq('user_id', session.user.id)
      .single()

    if (row) setData(row.data)
    setLoading(false)
  }

async function saveData(newData) {
  const updated = { ...data, ...newData }
  setData(updated)

  const { error } = await supabase
    .from('vibelife_data')
    .upsert({
      user_id: session.user.id,
      data: updated,
      updated_at: new Date()
    }, { onConflict: 'user_id' })

  if (error) {
    console.log("🔥 ERROR:", error)
  } else {
    console.log("✅ SAVED")
  }
}

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F7F6FB', fontSize: '14px', color: '#9999b3'
    }}>
      불러오는 중...
    </div>
  )

  // 현재 활성 탭에 맞는 컴포넌트 렌더링
 function renderTab() {
  const props = { data, saveData, session }
  switch (activeTab) {
    case 'week':    return <Week {...props} />
    case 'goals':   return <Goals {...props} />
    case 'habits':  return <Habits {...props} />
    case 'know':    return <Knowledge {...props} />
    case 'ideas':   return <Ideas {...props} />
    case 'skills':  return <Skills {...props} />
    case 'career':  return <Career {...props} />
    default:        return <Week {...props} />
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
        <button
          onClick={() => supabase.auth.signOut()}
          style={{
            fontSize: '12px', color: '#9999b3', background: '#fff',
            padding: '5px 12px', borderRadius: '20px',
            border: '1px solid #E8E7F2', cursor: 'pointer'
          }}
        >
          로그아웃
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{ padding: '1.25rem 1rem 5.5rem' }}>
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