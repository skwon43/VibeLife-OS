import { useState } from 'react'

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function Habits({ data, saveData }) {
  const [input, setInput] = useState('')
  const habits = data.habits || []
  const now = new Date()

  function toStr(d) {
    return d.getFullYear() + '-' +
      String(d.getMonth() + 1).padStart(2, '0') + '-' +
      String(d.getDate()).padStart(2, '0')
  }

  function getWeekDates() {
    const base = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    base.setDate(base.getDate() - base.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      return d
    })
  }

  function weeklyPct(done = []) {
    const weekDates = getWeekDates()
    const checked = weekDates.filter(d => done.includes(toStr(d))).length
    return Math.round((checked / 7) * 100)
  }

  function addHabit() {
    if (!input.trim()) return
    saveData({ habits: [...habits, { name: input, done: [] }] })
    setInput('')
  }

  function delHabit(i) {
    saveData({ habits: habits.filter((_, idx) => idx !== i) })
  }

  function updateHabitName(i, value) {
    const updated = [...habits]
    updated[i].name = value
    saveData({ habits: updated })
  }

  function toggleDay(hi, ds) {
    const updated = [...habits]
    if (!updated[hi].done) updated[hi].done = []
    const idx = updated[hi].done.indexOf(ds)
    if (idx >= 0) updated[hi].done.splice(idx, 1)
    else updated[hi].done.push(ds)
    saveData({ habits: updated })
  }

  const todayStr = toStr(now)
  const weekDates = getWeekDates()

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Habits</h2>

      {/* 추가 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addHabit()}
          placeholder="새 습관 추가..."
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' }}
        />
        <button onClick={addHabit} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>추가</button>
      </div>

      {!habits.length && (
        <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>
          습관을 추가해봐
        </p>
      )}

      {habits.map((h, hi) => {
        const pct = weeklyPct(h.done)
        const pctColor = pct >= 80 ? '#085041' : pct >= 50 ? '#633806' : '#3C3489'
        const pctBg = pct >= 80 ? '#E1F5EE' : pct >= 50 ? '#FAEEDA' : '#EEEDFE'
        const checkedThisWeek = weekDates.filter(d => (h.done || []).includes(toStr(d))).length

        return (
          <div key={hi} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem' }}>

            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              {/* 인라인 이름 수정 */}
              <input
                value={h.name}
                onChange={e => updateHabitName(hi, e.target.value)}
                style={{
                  flex: 1, fontSize: '15px', fontWeight: '500', color: '#1a1a2e',
                  border: 'none', background: 'transparent', outline: 'none',
                  fontFamily: 'sans-serif', padding: 0, marginRight: '8px'
                }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '11px', fontWeight: '500', padding: '3px 9px', borderRadius: '10px', background: pctBg, color: pctColor }}>
                  이번 주 {checkedThisWeek}/7 ({pct}%)
                </span>
                <button onClick={() => delHabit(hi)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
              </div>
            </div>

            {/* 프로그레스 바 */}
            <div style={{ height: '5px', background: '#F7F6FB', borderRadius: '3px', overflow: 'hidden', border: '1px solid #E8E7F2', marginBottom: '10px' }}>
              <div style={{
                height: '100%', width: `${pct}%`,
                background: pct >= 80 ? '#1D9E75' : pct >= 50 ? '#BA7517' : '#7F77DD',
                borderRadius: '3px', transition: 'width 0.4s'
              }} />
            </div>

            {/* 주간 체크 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
              {weekDates.map((d, di) => {
                const ds = toStr(d)
                const on = (h.done || []).includes(ds)
                const isT = ds === todayStr
                const isFuture = ds > todayStr

                return (
                  <div key={di} onClick={() => !isFuture && toggleDay(hi, ds)} style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                    cursor: isFuture ? 'default' : 'pointer'
                  }}>
                    <span style={{ fontSize: '10px', color: '#9999b3', fontWeight: '500' }}>{DAYS[di]}</span>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: '8px',
                      border: isT && !on ? '1.5px solid #7F77DD' : '1.5px solid #E8E7F2',
                      background: on ? (pct >= 80 ? '#1D9E75' : pct >= 50 ? '#BA7517' : '#7F77DD') : isFuture ? '#F7F6FB' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '500',
                      color: on ? '#fff' : isFuture ? '#E8E7F2' : '#9999b3',
                      opacity: isFuture ? 0.4 : 1,
                      transition: 'all 0.18s'
                    }}>
                      {on ? '✓' : d.getDate()}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}