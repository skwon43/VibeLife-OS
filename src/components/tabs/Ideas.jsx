import { useState } from 'react'

const IDEA_TAGS = [
  { key: 'vibe', label: '💻 바이브코딩', color: '#7F77DD', bg: '#EEEDFE' },
  { key: 'biz', label: '💼 비즈니스', color: '#085041', bg: '#E1F5EE' },
  { key: 'feedback', label: '🔍 피드백', color: '#633806', bg: '#FAEEDA' },
  { key: 'learn', label: '📚 학습', color: '#993C1D', bg: '#FAECE7' },
  { key: 'other', label: '✨ 기타', color: '#9999b3', bg: '#F7F6FB' },
]

export default function Ideas({ data, saveData }) {
  const [text, setText] = useState('')
  const [selTags, setSelTags] = useState(new Set())
  const [filter, setFilter] = useState('all')
  const ideas = data.ideas || []
  const todayStr = new Date().toISOString().split('T')[0]

  function toggleTag(key) {
    setSelTags(prev => {
      const next = new Set(prev)
      next.has(key) ? next.delete(key) : next.add(key)
      return next
    })
  }

  function saveIdea() {
    if (!text.trim()) return
    const newIdeas = [
      { text, tags: [...selTags], date: todayStr, ts: Date.now() },
      ...ideas
    ]
    saveData({ ideas: newIdeas })
    setText('')
    setSelTags(new Set())
  }

  function delIdea(i) {
    saveData({ ideas: ideas.filter((_, idx) => idx !== i) })
  }

  const filtered = filter === 'all'
    ? ideas
    : ideas.filter(idea => (idea.tags || []).includes(filter))

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Ideas</h2>

      {/* 입력창 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1.5px solid #E8E7F2', padding: '1rem', marginBottom: '1rem' }}>
        <textarea
          value={text}
          onChange={e => { setText(e.target.value); e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
          placeholder="💡 지금 떠오른 아이디어 바로 적어봐&#10;바이브 코딩, 비즈니스, 피드백..."
          style={{
            width: '100%', border: 'none', background: 'transparent',
            fontSize: '15px', color: '#1a1a2e', outline: 'none',
            resize: 'none', lineHeight: '1.7', fontFamily: 'sans-serif',
            minHeight: '72px'
          }}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid #E8E7F2', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flex: 1 }}>
            {IDEA_TAGS.map(t => (
              <button key={t.key} onClick={() => toggleTag(t.key)} style={{
                padding: '4px 11px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                border: `1.5px solid ${selTags.has(t.key) ? t.color : '#E8E7F2'}`,
                background: selTags.has(t.key) ? t.color : 'transparent',
                color: selTags.has(t.key) ? '#fff' : '#9999b3',
                fontFamily: 'sans-serif', transition: 'all 0.15s'
              }}>{t.label}</button>
            ))}
          </div>
          <button onClick={saveIdea} style={{ padding: '7px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '13px', fontWeight: '500', cursor: 'pointer', fontFamily: 'sans-serif' }}>저장</button>
        </div>
      </div>

      {/* 필터 */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {[{ key: 'all', label: '전체' }, ...IDEA_TAGS].map(t => (
          <button key={t.key} onClick={() => setFilter(t.key)} style={{
            padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
            border: `1.5px solid ${filter === t.key ? '#7F77DD' : '#E8E7F2'}`,
            background: filter === t.key ? '#EEEDFE' : 'transparent',
            color: filter === t.key ? '#3C3489' : '#9999b3',
            fontFamily: 'sans-serif', fontWeight: filter === t.key ? '500' : '400'
          }}>{t.label}</button>
        ))}
      </div>

      {/* 아이디어 카드 */}
      {!ideas.length && (
        <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>
          아이디어를 적어봐<br />
          <span style={{ fontSize: '12px' }}>떠오르는 순간 바로 캡처해</span>
        </p>
      )}
      {!filtered.length && ideas.length > 0 && (
        <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>이 태그의 아이디어가 없어</p>
      )}
      {filtered.map((idea, fi) => {
        const i = ideas.indexOf(idea)
        return (
          <div key={fi} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.85rem 1rem', marginBottom: '0.6rem' }}>
            <p style={{ fontSize: '14px', color: '#1a1a2e', lineHeight: '1.7', marginBottom: '0.6rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
              {idea.text}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(idea.tags || []).length ? (idea.tags || []).map(tk => {
                  const found = IDEA_TAGS.find(t => t.key === tk)
                  return found ? (
                    <span key={tk} style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px', fontWeight: '500', background: found.bg, color: found.color }}>
                      {found.label}
                    </span>
                  ) : null
                }) : (
                  <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px', background: '#F7F6FB', color: '#9999b3' }}>태그 없음</span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9999b3' }}>{idea.date}</span>
                <button onClick={() => delIdea(i)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}