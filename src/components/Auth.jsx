import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Auth({ onSignUp, onBack }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else {
        onSignUp?.()
        setMessage('이메일 확인 후 로그인해줘!')
      }
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#F7F6FB', fontFamily: 'sans-serif', padding: '1.5rem'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: '2rem', width: '100%', maxWidth: '380px',
        boxShadow: '0 4px 24px rgba(127,119,221,.12)'
      }}>

        {/* 뒤로가기 */}
        <button
          onClick={onBack}
          style={{
            fontSize: '13px', color: '#9999b3', background: 'none',
            border: 'none', cursor: 'pointer', padding: '0',
            marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '4px',
            fontFamily: 'sans-serif'
          }}
        >
          ← 돌아가기
        </button>

        <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1a1a2e', marginBottom: '0.5rem' }}>
          Vibe<span style={{ color: '#7F77DD' }}>Life</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#9999b3', marginBottom: '1.5rem' }}>
          {isLogin ? '로그인해서 시작해봐' : '계정을 만들어봐'}
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={{
              padding: '10px 14px', border: '1.5px solid #E8E7F2',
              borderRadius: '8px', fontSize: '14px', outline: 'none',
              background: '#F7F6FB', color: '#1a1a2e'
            }}
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={{
              padding: '10px 14px', border: '1.5px solid #E8E7F2',
              borderRadius: '8px', fontSize: '14px', outline: 'none',
              background: '#F7F6FB', color: '#1a1a2e'
            }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', background: '#7F77DD', color: 'white',
              border: 'none', borderRadius: '8px', fontSize: '14px',
              fontWeight: '500', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1, marginTop: '4px'
            }}
          >
            {loading ? '처리 중...' : isLogin ? '로그인' : '회원가입'}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: '12px', fontSize: '13px', color: '#D85A30', textAlign: 'center' }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: '16px', fontSize: '13px', color: '#9999b3', textAlign: 'center' }}>
          {isLogin ? '계정이 없어?' : '이미 계정 있어?'}{' '}
          <span
            onClick={() => { setIsLogin(!isLogin); setMessage('') }}
            style={{ color: '#7F77DD', cursor: 'pointer', fontWeight: '500' }}
          >
            {isLogin ? '회원가입' : '로그인'}
          </span>
        </p>
      </div>
    </div>
  )
}