import { useState, useEffect } from 'react'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Week({ data, saveData }) {
  const now = new Date()
  const todayStr = toStr(now)
  const [weekOffset, setWeekOffset] = useState(0)
  const [selDate, setSelDate] = useState(todayStr)
  const [taskInput, setTaskInput] = useState('')
  const [showTaskInput, setShowTaskInput] = useState(false)
  const [journalInput, setJournalInput] = useState('')

  useEffect(() => {
    setJournalInput('')
    setTaskInput('')
    setShowTaskInput(false)
  }, [selDate])

  function toStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0')
  }

  function getWeekDates(offset) {
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    base.setDate(base.getDate() - base.getDay() + offset * 7)
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return d
    })
  }

  const weekDates = getWeekDates(weekOffset)
  const tasks = data.tasks?.[selDate] || []
  const habits = data.habits || []
  const doneCount = tasks.filter(t => t.done).length

  function weeklyPct(done = []) {
    const checked = weekDates.filter(d => (done || []).includes(toStr(d))).length
    return Math.round((checked / 7) * 100)
  }

  function addTask() {
    if (!taskInput.trim()) return
    const newTasks = {
      ...data.tasks,
      [selDate]: [{ text: taskInput, done: false }, ...(data.tasks?.[selDate] || [])]
    }
    saveData({ tasks: newTasks })
    setTaskInput('')
    setShowTaskInput(false)
  }

  function toggleTask(idx) {
    const updated = [...tasks]
    updated[idx] = { ...updated[idx], done: !updated[idx].done }
    saveData({ tasks: { ...data.tasks, [selDate]: updated } })
  }

  function delTask(idx) {
    const updated = tasks.filter((_, i) => i !== idx)
    saveData({ tasks: { ...data.tasks, [selDate]: updated } })
  }

  function saveJournal() {
    if (!journalInput.trim()) return
    const existing = data.journal?.[selDate] || []
    const entries = Array.isArray(existing) ? existing : existing ? [{ text: existing, ts: 0 }] : []
    const newEntries = [...entries, { text: journalInput, ts: Date.now() }]
    saveData({ journal: { ...data.journal, [selDate]: newEntries } })
    setJournalInput('')
  }

  function toggleHabit(hi) {
    const updated = habits.map((h, i) => {
      if (i !== hi) return h
      const done = [...(h.done || [])]
      const idx = done.indexOf(selDate)
      if (idx >= 0) done.splice(idx, 1)
      else done.push(selDate)
      return { ...h, done }
    })
    saveData({ habits: updated })
  }

  const selD = new Date(selDate + 'T00:00:00')
  const dayLabel = (selD.getMonth() + 1) + '월 ' + selD.getDate() + '일 ' + DAYS[selD.getDay()] + '요일'

  return (
    <div>
      {/* 주간 네비게이션 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a2e' }}>
          {(weekDates[0].getMonth() + 1)}.{weekDates[0].getDate()} –{' '}
          {(weekDates[6].getMonth() + 1)}.{weekDates[6].getDate()}
        </span>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['‹', '오늘', '›'].map((btn, i) => (
            <button key={i} onClick={() => {
              if (i === 0) setWeekOffset(w => w - 1)
              else if (i === 1) { setWeekOffset(0); setSelDate(todayStr) }
              else setWeekOffset(w => w + 1)
            }} style={{
              height: '30px', padding: '0 12px',
              borderRadius: '8px', border: '1.5px solid #E8E7F2',
              background: '#fff', color: '#555572',
              fontSize: '12px', cursor: 'pointer'
            }}>{btn}</button>
          ))}
        </div>
      </div>

      {/* 주간 스트립 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px', marginBottom: '1rem' }}>
        {weekDates.map((d, i) => {
          const ds = toStr(d)
          const isTod = ds === todayStr
          const isSel = ds === selDate
          const hasTasks = (data.tasks?.[ds] || []).length > 0
          const hasHab = habits.some(h => (h.done || []).includes(ds))
          const hasJ = (() => {
          const j = data.journal?.[ds]
          if (!j) return false
          if (Array.isArray(j)) return j.length > 0
          return !!j
        })()
          return (
            <div key={i} onClick={() => setSelDate(ds)} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              gap: '4px', padding: '8px 4px', borderRadius: '8px',
              border: isSel ? '1.5px solid #7F77DD' : '1.5px solid transparent',
              background: isSel ? '#EEEDFE' : 'transparent', cursor: 'pointer'
            }}>
              <span style={{ fontSize: '10px', fontWeight: '500', color: isSel ? '#3C3489' : '#9999b3' }}>
                {DAYS[d.getDay()]}
              </span>
              <span style={{
                fontSize: '15px', fontWeight: '500',
                width: '30px', height: '30px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: '50%',
                background: isTod || isSel ? '#7F77DD' : 'transparent',
                color: isTod || isSel ? '#fff' : '#1a1a2e'
              }}>{d.getDate()}</span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {hasTasks && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7F77DD' }} />}
                {hasHab && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#1D9E75' }} />}
                {hasJ && <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#BA7517' }} />}
              </div>
            </div>
          )
        })}
      </div>

      {/* 날짜 카드 */}
      <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', overflow: 'hidden' }}>

        {/* 헤더 */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #E8E7F2', display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a2e' }}>{dayLabel}</span>
          <span style={{ fontSize: '12px', color: '#9999b3' }}>
            {tasks.length ? `${doneCount}/${tasks.length} 완료` : ''}
          </span>
        </div>

        {/* Tasks */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #E8E7F2' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '11px', fontWeight: '500', color: '#9999b3', letterSpacing: '0.06em' }}>TASKS</span>
            <span onClick={() => setShowTaskInput(s => !s)} style={{ fontSize: '22px', color: '#7F77DD', cursor: 'pointer', lineHeight: 1 }}>+</span>
          </div>
          {showTaskInput && (
            <div style={{ display: 'flex', gap: '6px', marginBottom: '0.6rem' }}>
              <input
                value={taskInput}
                onChange={e => setTaskInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addTask()}
                placeholder="할 일 추가..."
                autoFocus
                style={{ flex: 1, padding: '8px 12px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
              />
              <button onClick={addTask} style={{ padding: '8px 14px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '13px', cursor: 'pointer' }}>추가</button>
            </div>
          )}
          {tasks.length ? tasks.map((t, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: i < tasks.length - 1 ? '1px solid #E8E7F2' : 'none' }}>
          <div onClick={() => toggleTask(i)} style={{
            width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
            border: t.done ? 'none' : '2px solid #D0CEEA',
            background: t.done ? '#7F77DD' : 'transparent',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            {t.done && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
          </div>
          {/* 인라인 수정 */}
          <input
            value={t.text}
            onChange={e => {
              const updated = [...tasks]
              updated[i] = { ...updated[i], text: e.target.value }
              saveData({ tasks: { ...data.tasks, [selDate]: updated } })
            }}
            style={{
              flex: 1, fontSize: '14px', border: 'none', background: 'transparent',
              outline: 'none', fontFamily: 'sans-serif', padding: 0,
              color: t.done ? '#9999b3' : '#1a1a2e',
              textDecoration: t.done ? 'line-through' : 'none',
              cursor: 'text'
            }}
            />
            {t.goal && <span style={{ fontSize: '10px', color: '#3C3489', background: '#EEEDFE', padding: '1px 7px', borderRadius: '10px' }}>{t.goal}</span>}
            <button onClick={() => delTask(i)} style={{ fontSize: '15px', color: '#9999b3', border: 'none', background: 'none', cursor: 'pointer' }}>×</button>
          </div>
        )) : <p style={{ fontSize: '13px', color: '#9999b3', padding: '4px 0' }}>없음</p>}
        </div>

        {/* Habits */}
        <div style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #E8E7F2' }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#9999b3', letterSpacing: '0.06em' }}>HABITS</span>
          {habits.length ? habits.map((h, hi) => {
            const pct = weeklyPct(h.done)
            const pctColor = pct >= 80 ? '#085041' : pct >= 50 ? '#633806' : '#3C3489'
            const pctBg = pct >= 80 ? '#E1F5EE' : pct >= 50 ? '#FAEEDA' : '#EEEDFE'
            const isOn = (h.done || []).includes(selDate)
            return (
              <div key={hi} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '7px 0', borderBottom: hi < habits.length - 1 ? '1px solid #E8E7F2' : 'none' }}>
                <span style={{ flex: 1, fontSize: '14px', color: '#1a1a2e' }}>{h.name}</span>
                <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 8px', borderRadius: '10px', background: pctBg, color: pctColor }}>
                  {pct}%
                </span>
                <button onClick={() => toggleHabit(hi)} style={{
                  width: '38px', height: '22px', borderRadius: '11px', border: 'none', cursor: 'pointer',
                  background: isOn ? '#1D9E75' : '#D0CEEA',
                  position: 'relative', transition: 'background 0.2s', flexShrink: 0
                }}>
                  <div style={{
                    position: 'absolute', width: '18px', height: '18px', borderRadius: '50%',
                    background: '#fff', top: '2px',
                    left: isOn ? '18px' : '2px',
                    transition: 'left 0.2s'
                  }} />
                </button>
              </div>
            )
          }) : <p style={{ fontSize: '13px', color: '#9999b3', padding: '4px 0 0' }}>Habits 탭에서 추가해봐</p>}
        </div>

        {/* Journal */}
        <div style={{ padding: '0.85rem 1rem' }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#9999b3', letterSpacing: '0.06em' }}>JOURNAL</span>

          {/* 저장된 기록들 */}
          {(() => {
            const existing = data.journal?.[selDate] || []
            const entries = Array.isArray(existing)
              ? existing
              : existing ? [{ text: existing, ts: 0 }] : []
            return entries.map((entry, i) => (
              <div key={i} style={{
                background: '#F7F6FB', borderRadius: '8px', padding: '10px 12px',
                marginTop: '0.6rem', border: '1px solid #E8E7F2', position: 'relative'
              }}>
                <textarea
                  value={entry.text}
                  onChange={e => {
                    const ex = data.journal?.[selDate] || []
                    const ent = Array.isArray(ex) ? ex : [{ text: ex, ts: 0 }]
                    const updated = [...ent]
                    updated[i] = { ...updated[i], text: e.target.value }
                    saveData({ journal: { ...data.journal, [selDate]: updated } })
                  }}
                  style={{
                    width: '100%', border: 'none', background: 'transparent',
                    fontSize: '14px', color: '#1a1a2e', lineHeight: '1.7',
                    resize: 'none', outline: 'none', fontFamily: 'sans-serif',
                    padding: 0, minHeight: '40px'
                  }}
                />
                <button onClick={() => {
                  const ex = data.journal?.[selDate] || []
                  const ent = Array.isArray(ex) ? ex : [{ text: ex, ts: 0 }]
                  saveData({ journal: { ...data.journal, [selDate]: ent.filter((_, idx) => idx !== i) } })
                }} style={{
                  position: 'absolute', top: '6px', right: '8px',
                  fontSize: '14px', color: '#9999b3', border: 'none',
                  background: 'none', cursor: 'pointer'
                }}>×</button>
                {entry.ts > 0 && (
                  <div style={{ fontSize: '11px', color: '#9999b3', marginTop: '4px' }}>
                    {new Date(entry.ts).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                )}
              </div>
            ))
          })()}
          {/* 입력창 */}
          <textarea
            value={journalInput}
            onChange={e => setJournalInput(e.target.value)}
            placeholder="오늘 하루 기록..."
            style={{
              width: '100%', minHeight: '80px', padding: '10px 12px', marginTop: '0.6rem',
              border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px',
              lineHeight: '1.8', background: '#F7F6FB', color: '#1a1a2e',
              resize: 'none', outline: 'none', fontFamily: 'sans-serif', boxSizing: 'border-box'
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={saveJournal} style={{
              padding: '7px 16px', borderRadius: '8px', border: 'none',
              background: '#7F77DD', color: '#fff', fontSize: '13px',
              fontWeight: '500', cursor: 'pointer'
            }}>저장</button>
          </div>
        </div>
      </div>
    </div>
  )
}