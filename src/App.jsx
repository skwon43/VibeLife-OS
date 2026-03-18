import { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Auth from './components/Auth'
import Main from './components/Main'
import GuestMain from './components/GuestMain'

const GUEST_KEY = 'vibelife_guest_data'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [mode, setMode] = useState(null)
  const [showMergePrompt, setShowMergePrompt] = useState(false)
  const [pendingSession, setPendingSession] = useState(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const guestData = localStorage.getItem(GUEST_KEY)
        if (guestData) {
          setPendingSession(session)
          setShowMergePrompt(true)
        } else {
          setSession(session)
          setMode('auth')
        }
      }
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        const guestData = localStorage.getItem(GUEST_KEY)
        if (guestData) {
          setPendingSession(session)
          setShowMergePrompt(true)
        } else {
          setSession(session)
          setMode('auth')
        }
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function mergeGuestData() {
    try {
      const guestData = JSON.parse(localStorage.getItem(GUEST_KEY) || '{}')
      await supabase
        .from('vibelife_data')
        .upsert({
          user_id: pendingSession.user.id,
          data: guestData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      localStorage.removeItem(GUEST_KEY)
    } catch (e) {
      console.error('merge 실패:', e)
    }
    setSession(pendingSession)
    setMode('auth')
    setShowMergePrompt(false)
    setPendingSession(null)
  }

  function discardGuestData() {
    localStorage.removeItem(GUEST_KEY)
    setSession(pendingSession)
    setMode('auth')
    setShowMergePrompt(false)
    setPendingSession(null)
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F7F6FB', fontSize: '14px', color: '#9999b3'
    }}>
      로딩 중...
    </div>
  )

  // 게스트 데이터 합치기 팝업
  // 게스트 데이터 합치기 팝업
if (showMergePrompt) return (
  <div style={{
    minHeight: '100vh', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    background: '#F7F6FB', padding: '1.5rem'
  }}>
    <div style={{
      background: '#fff', borderRadius: '16px',
      padding: '2rem', width: '100%', maxWidth: '380px',
      boxShadow: '0 4px 24px rgba(127,119,221,0.12)'
    }}>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.75rem' }}>
        게스트 데이터가 있어요
      </h2>
      <p style={{ fontSize: '14px', color: '#9999b3', lineHeight: '1.7', marginBottom: '0.75rem' }}>
        로그인 전에 게스트로 저장한 데이터가 있어.
      </p>
      <div style={{
        background: '#FAECE7', borderRadius: '8px',
        padding: '10px 14px', marginBottom: '1.5rem',
        fontSize: '13px', color: '#993C1D', lineHeight: '1.6'
      }}>
        ⚠️ "가져올게요" 선택 시 기존 계정 데이터는 게스트 데이터로 덮어씌워져!
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={mergeGuestData} style={{
          padding: '12px', borderRadius: '10px', border: 'none',
          background: '#7F77DD', color: '#fff', fontSize: '14px',
          fontWeight: '500', cursor: 'pointer'
        }}>
          게스트 데이터 가져올게요
        </button>
        <button onClick={discardGuestData} style={{
          padding: '12px', borderRadius: '10px',
          border: '1.5px solid #E8E7F2', background: 'transparent',
          color: '#9999b3', fontSize: '14px', cursor: 'pointer'
        }}>
          기존 계정 데이터 유지할게요
        </button>
      </div>
    </div>
  </div>
)

  // 게스트 모드
  if (mode === 'guest') return <GuestMain onLogin={() => setMode('login')} />

  // 로그인 화면
 if (mode === 'login' || (mode === 'auth' && !session)) return (
  <Auth
    onBack={() => setMode(null)}
    onSignUp={() => {
      const guestData = localStorage.getItem(GUEST_KEY)
      if (guestData) {
        const checkSession = setInterval(async () => {
          const { data: { session } } = await supabase.auth.getSession()
          if (session) {
            clearInterval(checkSession)
            setPendingSession(session)
            setShowMergePrompt(true)
          }
        }, 500)
      }
    }}
  />
)
  // 시작 화면
  if (!session && mode === null) return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F7F6FB', padding: '1.5rem'
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px',
        padding: '2rem', width: '100%', maxWidth: '380px',
        boxShadow: '0 4px 24px rgba(127,119,221,0.12)',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '28px', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
          Vibe<span style={{ color: '#7F77DD' }}>Life</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#9999b3', marginBottom: '2rem', lineHeight: '1.6' }}>
          Personal Development OS
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            onClick={() => setMode('login')}
            style={{
              padding: '12px', borderRadius: '10px', border: 'none',
              background: '#7F77DD', color: '#fff', fontSize: '14px',
              fontWeight: '500', cursor: 'pointer'
            }}
          >
            로그인 / 회원가입
          </button>
          <button
            onClick={() => setMode('guest')}
            style={{
              padding: '12px', borderRadius: '10px',
              border: '1.5px solid #E8E7F2', background: 'transparent',
              color: '#9999b3', fontSize: '14px', cursor: 'pointer'
            }}
          >
            로그인 없이 시작하기
          </button>
        </div>
        <p style={{ fontSize: '11px', color: '#9999b3', marginTop: '1rem' }}>
          로그인 없이 시작하면 이 기기에만 저장돼
        </p>
      </div>
    </div>
  )

  // 메인 앱
  return <Main session={session} />
}