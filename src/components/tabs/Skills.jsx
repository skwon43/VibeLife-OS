import { useState } from 'react'

const SKILL_CATS = ['전체', '언어', '프레임워크', '수학/이론', '자격증', '기타']
const SKILL_ICONS = { '언어': '💻', '프레임워크': '🔧', '수학/이론': '📐', '자격증': '🏅', '기타': '⚡' }
const SKILL_LEVELS = ['미시작', '입문', '초급', '초급+', '중급', '중급+', '고급', '고급+', '숙련', '숙련+', '마스터']

const ENG_CATS = [
  { key: 'all', label: '전체' },
  { key: 'email', label: '📧 Email' },
  { key: 'meeting', label: '🗣️ Meetings' },
  { key: 'casual', label: '💬 Casual' },
  { key: 'presentation', label: '📊 Presentations' },
  { key: 'other', label: '✨ Other' },
]
const ENG_CAT_LABELS = {
  email: '📧 Email / Writing',
  meeting: '🗣️ Meetings / Speaking',
  casual: '💬 Casual / Small Talk',
  presentation: '📊 Presentations',
  other: '✨ Other'
}

export default function Skills({ data, saveData }) {
  const [view, setView] = useState('skills')
  const [skillCat, setSkillCat] = useState('전체')
  const [skillInput, setSkillInput] = useState('')
  const [engCat, setEngCat] = useState('all')
  const [vocabForm, setVocabForm] = useState({ expr: '', example: '', nuance: '', cat: 'email' })

  const skills = data.skills || []
  const vocab = data.vocab || []

  // Skills 함수들
  function addSkill() {
    if (!skillInput.trim()) return
    saveData({ skills: [...skills, { name: skillInput, level: 1, cat: '기타' }] })
    setSkillInput('')
  }

  function delSkill(i) {
    saveData({ skills: skills.filter((_, idx) => idx !== i) })
  }

  function updateSkillLevel(i, level) {
    const updated = [...skills]
    updated[i].level = parseInt(level)
    saveData({ skills: updated })
  }

  function updateSkillCat(i, cat) {
    const updated = [...skills]
    updated[i].cat = cat
    saveData({ skills: updated })
  }

  // Vocab 함수들
  function addVocab() {
    if (!vocabForm.expr.trim()) return
    saveData({ vocab: [{ ...vocabForm, remembered: false, similar: '' }, ...vocab] })
    setVocabForm({ expr: '', example: '', nuance: '', cat: 'email' })
  }

  function delVocab(i) {
    saveData({ vocab: vocab.filter((_, idx) => idx !== i) })
  }

  function toggleRemembered(i) {
    const updated = [...vocab]
    updated[i].remembered = !updated[i].remembered
    saveData({ vocab: updated })
  }

  const filteredSkills = skillCat === '전체' ? skills : skills.filter(s => s.cat === skillCat)
  const filteredVocab = engCat === 'all' ? vocab : vocab.filter(v => v.cat === engCat)

  return (
    <div>
      {/* 상단 뷰 전환 탭 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        {[{ key: 'skills', label: 'Skills' }, { key: 'english', label: '🇺🇸 English' }].map(t => (
          <button key={t.key} onClick={() => setView(t.key)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
            border: `1.5px solid ${view === t.key ? '#7F77DD' : '#E8E7F2'}`,
            background: view === t.key ? '#7F77DD' : 'transparent',
            color: view === t.key ? '#fff' : '#9999b3', fontFamily: 'sans-serif'
          }}>{t.label}</button>
        ))}
      </div>

      {/* Skills 뷰 */}
      {view === 'skills' && (
        <div>
          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {SKILL_CATS.map(c => (
              <button key={c} onClick={() => setSkillCat(c)} style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                border: `1.5px solid ${skillCat === c ? '#7F77DD' : '#E8E7F2'}`,
                background: skillCat === c ? '#EEEDFE' : 'transparent',
                color: skillCat === c ? '#3C3489' : '#9999b3', fontFamily: 'sans-serif',
                fontWeight: skillCat === c ? '500' : '400'
              }}>{c}</button>
            ))}
          </div>

          {/* 스킬 추가 */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
            <input
              value={skillInput}
              onChange={e => setSkillInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addSkill()}
              placeholder="스킬 이름 (예: Python, 알고리즘)"
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' }}
            />
            <button onClick={addSkill} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>추가</button>
          </div>

          {!skills.length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>스킬을 추가해봐</p>}
          {!filteredSkills.length && skills.length > 0 && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>이 카테고리엔 스킬이 없어</p>}

          {filteredSkills.map(s => {
            const i = skills.indexOf(s)
            const icon = SKILL_ICONS[s.cat] || '⚡'
            const badge = s.level >= 8 ? '🔥' : s.level >= 5 ? '📈' : s.level >= 2 ? '🌱' : ''
            return (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '20px' }}>{icon}</span>
                  <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{s.name}</span>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#7F77DD' }}>{s.level * 10}%</span>
                  <button onClick={() => delSkill(i)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
                </div>
                <div style={{ height: '7px', background: '#F7F6FB', borderRadius: '4px', overflow: 'hidden', border: '1px solid #E8E7F2', marginBottom: '6px' }}>
                  <div style={{ height: '100%', width: `${s.level * 10}%`, background: 'linear-gradient(90deg, #7F77DD, #a89ff0)', borderRadius: '4px', transition: 'width 0.4s' }} />
                </div>
                <input type="range" min="0" max="10" step="1" value={s.level}
                  onChange={e => updateSkillLevel(i, e.target.value)}
                  style={{ width: '100%', accentColor: '#7F77DD', marginBottom: '6px', cursor: 'pointer' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <select value={s.cat} onChange={e => updateSkillCat(i, e.target.value)}
                    style={{ fontSize: '11px', border: '1px solid #E8E7F2', borderRadius: '6px', background: '#F7F6FB', padding: '2px 6px', color: '#555572', outline: 'none' }}>
                    {['언어', '프레임워크', '수학/이론', '자격증', '기타'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <span style={{ fontSize: '12px', color: '#7F77DD', fontWeight: '500' }}>{badge} {SKILL_LEVELS[s.level]}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* English 뷰 */}
      {view === 'english' && (
        <div>
          {/* 카테고리 필터 */}
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {ENG_CATS.map(c => (
              <button key={c.key} onClick={() => setEngCat(c.key)} style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
                border: `1.5px solid ${engCat === c.key ? '#7F77DD' : '#E8E7F2'}`,
                background: engCat === c.key ? '#EEEDFE' : 'transparent',
                color: engCat === c.key ? '#3C3489' : '#9999b3', fontFamily: 'sans-serif',
                fontWeight: engCat === c.key ? '500' : '400'
              }}>{c.label}</button>
            ))}
          </div>

          {/* 표현 추가 폼 */}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input value={vocabForm.expr} onChange={e => setVocabForm(p => ({ ...p, expr: e.target.value }))}
              placeholder='표현 (예: "loop you in")'
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F7F6FB' }}
            />
            <input value={vocabForm.example} onChange={e => setVocabForm(p => ({ ...p, example: e.target.value }))}
              placeholder='예문 (예: "I wanted to loop you in on the update.")'
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F7F6FB' }}
            />
            <input value={vocabForm.nuance} onChange={e => setVocabForm(p => ({ ...p, nuance: e.target.value }))}
              placeholder='뉘앙스 / 언제 쓰는지'
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F7F6FB' }}
            />
            <select value={vocabForm.cat} onChange={e => setVocabForm(p => ({ ...p, cat: e.target.value }))}
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', background: '#F7F6FB', color: '#1a1a2e', outline: 'none' }}>
              {Object.entries(ENG_CAT_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
            <button onClick={addVocab} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>저장</button>
          </div>

          {!vocab.length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>첫 번째 표현을 추가해봐</p>}

          {filteredVocab.map(v => {
            const i = vocab.indexOf(v)
            const catColors = {
              email: { bg: '#EEEDFE', color: '#3C3489' },
              meeting: { bg: '#E1F5EE', color: '#085041' },
              casual: { bg: '#FAEEDA', color: '#633806' },
              presentation: { bg: '#FAECE7', color: '#993C1D' },
              other: { bg: '#F7F6FB', color: '#9999b3' }
            }
            const cc = catColors[v.cat] || catColors.other
            return (
              <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem' }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#1a1a2e', marginBottom: '5px' }}>{v.expr}</div>
                {v.example && (
                  <div style={{ fontSize: '13px', color: '#555572', fontStyle: 'italic', lineHeight: '1.6', marginBottom: '6px', paddingLeft: '10px', borderLeft: '2px solid #D0CEEA' }}>
                    "{v.example}"
                  </div>
                )}
                {v.nuance && <div style={{ fontSize: '12px', color: '#9999b3', marginBottom: '8px' }}>💡 {v.nuance}</div>}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px', fontWeight: '500', background: cc.bg, color: cc.color }}>
                      {ENG_CAT_LABELS[v.cat]}
                    </span>
                    <button onClick={() => toggleRemembered(i)} style={{
                      fontSize: '12px', border: 'none', background: 'none', cursor: 'pointer',
                      color: v.remembered ? '#1D9E75' : '#9999b3', fontWeight: v.remembered ? '500' : '400',
                      fontFamily: 'sans-serif', padding: 0
                    }}>
                      {v.remembered ? '✓ 외웠어' : '○ 외우는 중'}
                    </button>
                  </div>
                  <button onClick={() => delVocab(i)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}