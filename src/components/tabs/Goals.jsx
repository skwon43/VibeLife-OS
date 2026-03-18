import { useState } from 'react'

export default function Goals({ data, saveData }) {
  const [title, setTitle] = useState('')
  const [msInputs, setMsInputs] = useState({})
  const goals = data.goals || []

  const todayStr = new Date().toISOString().split('T')[0]

  function addGoal() {
    if (!title.trim()) return
    const newGoals = [...goals, { title, pct: 0, milestones: [], _open: true }]
    saveData({ goals: newGoals })
    setTitle('')
  }

  function delGoal(i) {
    saveData({ goals: goals.filter((_, idx) => idx !== i) })
  }

  function toggleGoal(i) {
    const updated = [...goals]
    updated[i]._open = !updated[i]._open
    saveData({ goals: updated })
  }

  function addMilestone(gi) {
    const text = msInputs[gi]?.trim()
    if (!text) return
    const updated = [...goals]
    if (!updated[gi].milestones) updated[gi].milestones = []
    updated[gi].milestones.push({ text, done: false })
    saveData({ goals: updated })
    setMsInputs(prev => ({ ...prev, [gi]: '' }))
  }

  function toggleMs(gi, mi) {
    const updated = [...goals]
    updated[gi].milestones[mi].done = !updated[gi].milestones[mi].done
    updated[gi].pct = Math.round(
      updated[gi].milestones.filter(m => m.done).length /
      updated[gi].milestones.length * 100
    )
    saveData({ goals: updated })
  }

  function delMs(gi, mi) {
    const updated = [...goals]
    updated[gi].milestones.splice(mi, 1)
    saveData({ goals: updated })
  }

  function sendToTask(gi, mi) {
    const ms = goals[gi].milestones[mi]
    const goalTitle = goals[gi].title
    const newTasks = {
      ...data.tasks,
      [todayStr]: [
        { text: ms.text, done: false, goal: goalTitle },
        ...(data.tasks?.[todayStr] || [])
      ]
    }
    const updated = [...goals]
    updated[gi].milestones[mi].done = true
    updated[gi].pct = Math.round(
      updated[gi].milestones.filter(m => m.done).length /
      updated[gi].milestones.length * 100
    )
    saveData({ goals: updated, tasks: newTasks })
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Goals</h2>

      {/* 추가 */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '1rem' }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addGoal()}
          placeholder="목표 이름 (예: 알고리즘 마스터)"
          style={{ flex: 1, padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#fff' }}
        />
        <button onClick={addGoal} style={{ padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>추가</button>
      </div>

      {/* Goal 카드들 */}
      {!goals.length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '2rem 0' }}>목표를 추가해봐</p>}
      {goals.map((g, gi) => {
        const pct = g.milestones?.length
          ? Math.round(g.milestones.filter(m => m.done).length / g.milestones.length * 100)
          : g.pct || 0
        return (
          <div key={gi} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', marginBottom: '0.75rem', overflow: 'hidden' }}>
            
            {/* 헤더 */}
            <div onClick={() => toggleGoal(gi)} style={{ padding: '0.9rem 1rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '15px', fontWeight: '500', color: '#1a1a2e' }}>{g.title}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#7F77DD' }}>{pct}%</span>
                  <button onClick={e => { e.stopPropagation(); delGoal(gi) }} style={{ width: '22px', height: '22px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '13px', cursor: 'pointer' }}>×</button>
                  <span style={{ fontSize: '12px', color: '#9999b3' }}>{g._open ? '▴' : '▾'}</span>
                </div>
              </div>
              <div style={{ height: '5px', background: '#F7F6FB', borderRadius: '3px', overflow: 'hidden', border: '1px solid #E8E7F2' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #7F77DD, #a89ff0)', borderRadius: '3px', transition: 'width 0.4s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
                <span style={{ fontSize: '11px', color: '#9999b3' }}>
                  {(g.milestones || []).filter(m => m.done).length}/{(g.milestones || []).length} Milestones
                </span>
              </div>
            </div>

            {/* Milestones */}
            {g._open && (
              <div style={{ borderTop: '1px solid #E8E7F2', padding: '0.75rem 1rem' }}>
                {(g.milestones || []).map((m, mi) => (
                  <div key={mi} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: mi < g.milestones.length - 1 ? '1px solid #E8E7F2' : 'none' }}>
                    <div onClick={() => toggleMs(gi, mi)} style={{
                      width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, cursor: 'pointer',
                      border: m.done ? 'none' : '2px solid #D0CEEA',
                      background: m.done ? '#1D9E75' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {m.done && <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>}
                    </div>
                    <span style={{ flex: 1, fontSize: '13px', color: m.done ? '#9999b3' : '#1a1a2e', textDecoration: m.done ? 'line-through' : 'none' }}>{m.text}</span>
                    {!m.done && (
                      <button onClick={() => sendToTask(gi, mi)} style={{ padding: '3px 9px', borderRadius: '20px', border: '1px solid #7F77DD', background: 'transparent', color: '#7F77DD', fontSize: '11px', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                        오늘 할 일로
                      </button>
                    )}
                    <button onClick={() => delMs(gi, mi)} style={{ width: '20px', height: '20px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '13px', cursor: 'pointer' }}>×</button>
                  </div>
                ))}
                <div style={{ display: 'flex', gap: '6px', marginTop: '0.5rem' }}>
                  <input
                    value={msInputs[gi] || ''}
                    onChange={e => setMsInputs(prev => ({ ...prev, [gi]: e.target.value }))}
                    onKeyDown={e => e.key === 'Enter' && addMilestone(gi)}
                    placeholder="Milestone 추가..."
                    style={{ flex: 1, padding: '7px 10px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#F7F6FB' }}
                  />
                  <button onClick={() => addMilestone(gi)} style={{ padding: '7px 12px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '12px', cursor: 'pointer' }}>추가</button>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}