import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import Week from './tabs/Week'
import Goals from './tabs/Goals'
import Habits from './tabs/Habits'
import Knowledge from './tabs/Knowledge'
import Ideas from './tabs/Ideas'
import Skills from './tabs/Skills'
import Career from './tabs/Career'

const TABS = [
  { id: 'week', label: '주간', icon: '📅' },
  { id: 'goals', label: 'Goals', icon: '🎯' },
  { id: 'habits', label: 'Habits', icon: '🔄' },
  { id: 'ideas', label: 'Ideas', icon: '💡' },
  { id: 'know', label: '지식', icon: '📂' },
  { id: 'skills', label: 'Skills', icon: '⚡' },
  { id: 'career', label: 'Career', icon: '💼' },
]

// 저장 상태 표시
function SaveStatus({ status }) {
  if (status === 'idle') return null
  const config = {
    saving: { text: '저장 중...', color: '#9999b3' },
    saved:  { text: '저장됨 ✓',  color: '#1D9E75' },
    error:  { text: '저장 실패 ✗', color: '#D85A30' },
  }
  const c = config[status]
  return (
    <span style={{ fontSize: '11px', color: c.color, transition: 'all 0.3s' }}>
      {c.text}
    </span>
  )
}

export default function Main({ session }) {
  const [activeTab, setActiveTab] = useState('week')
  const [data, setData] = useState({
    tasks: {}, habits: [], journal: {}, notes: [],
    goals: [], binders: [], skills: [], career: [],
    ideas: [], vocab: []
  })
  const [loading, setLoading] = useState(true)
  const [saveStatus, setSaveStatus] = useState('idle')
  const saveTimerRef = useRef(null)
  const pendingDataRef = useRef(null)

  useEffect(() => {
    loadData()

    const channel = supabase
      .channel('vibelife_changes')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'vibelife_data',
        filter: `user_id=eq.${session.user.id}`
      }, (payload) => {
        setData(payload.new.data)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  async function loadData() {
    const { data: row } = await supabase
      .from('vibelife_data')
      .select('data')
      .eq('user_id', session.user.id)
      .maybeSingle()

    if (row?.data) setData(row.data)
    setLoading(false)
  }

  // 실제 DB 저장
  async function flushSave(updated) {
    setSaveStatus('saving')
    const { error } = await supabase
      .from('vibelife_data')
      .upsert({
        user_id: session.user.id,
        data: updated,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

    if (error) {
      console.error('저장 실패:', error)
      setSaveStatus('error')
      // 3초 후 retry
      setTimeout(() => flushSave(updated), 3000)
    } else {
      setSaveStatus('saved')
      // 2초 후 idle
      setTimeout(() => setSaveStatus('idle'), 2000)
    }
  }

  // debounce 저장 - UI는 즉시 반응, DB는 0.8초 후
  const saveData = useCallback((newData) => {
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
      pendingDataRef.current = updated
      return updated
    })

    // 기존 타이머 취소 후 새 타이머
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(() => {
      if (pendingDataRef.current) flushSave(pendingDataRef.current)
    }, 800)
  }, [session.user.id])

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F7F6FB', fontSize: '14px', color: '#9999b3'
    }}>
      불러오는 중...
    </div>
  )

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
        padding: '0.5rem 0.5rem env(safe-area-inset-bottom, 0.9rem)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: '#F7F6FB', position: 'sticky', top: 0, zIndex: 40
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a2e', letterSpacing: '-0.5px' }}>
          Vibe<span style={{ color: '#7F77DD' }}>Life</span>
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <SaveStatus status={saveStatus} />
          <button
            onClick={async () => {
              await supabase.auth.signOut()
              window.location.reload()
            }}
            style={{
              fontSize: '12px', color: '#9999b3', background: '#fff',
              padding: '5px 12px', borderRadius: '20px',
              border: '1px solid #E8E7F2', cursor: 'pointer'
            }}
          >
            로그아웃
          </button>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div style={{ 
        padding: '1.25rem 1rem 5.5rem',
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