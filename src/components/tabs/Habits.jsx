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
    const s = new Date(now)
    s.setDate(s.getDate() - s.getDay())
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(s)
      d.setDate(s.getDate() + i)
      return d
    })
  }

  function streak(done = [], ref) {
    let s = 0
    const d = new Date(ref + 'T00:00:00')
    while (true) {
      const ds = toStr(d)
      if (done.includes(ds)) { s++; d.setDate(d.getDate() - 1) }
      else break
    }
    return s
  }

  function addHabit() {
    if (!input.trim()) return
    saveData({ habits: [...habits, { name: input, done: [] }] })
    setInput('')
  }

  function delHabit(i) {
    saveData({ habits: habits.filter((_, idx) => idx !== i) })
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
        const st = streak(h.done, todayStr)
        return (
          <div key={hi} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem' }}>
            
            {/* 헤더 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a2e' }}>{h.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#085041', background: '#E1F5EE', padding: '3px 9px', borderRadius: '10px', fontWeight: '500' }}>
                  {st}일 연속
                </span>
                <button onClick={() => delHabit(hi)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
              </div>
            </div>

            {/* 주간 체크 */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '4px' }}>
              {weekDates.map((d, di) => {
                const ds = toStr(d)
                const on = (h.done || []).includes(ds)
                const isT = ds === todayStr
                return (
                  <div key={di} onClick={() => toggleDay(hi, ds)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '10px', color: '#9999b3', fontWeight: '500' }}>{DAYS[di]}</span>
                    <div style={{
                      width: '100%', aspectRatio: '1', borderRadius: '8px',
                      border: isT && !on ? '1.5px solid #7F77DD' : '1.5px solid #E8E7F2',
                      background: on ? '#1D9E75' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '11px', fontWeight: '500',
                      color: on ? '#fff' : '#9999b3',
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