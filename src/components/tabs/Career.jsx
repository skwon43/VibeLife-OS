import { useState } from 'react'
import AutoTextarea from '../lib/AutoTextarea'


const STATUS_KR = { planned: '예정', ongoing: '진행 중', done: '완료' }
const TYPE_LABELS = { intern: '인턴', project: '프로젝트', cert: '자격증', job: '취업' }
const STATUS_COLORS = {
  planned: { dot: '#D0CEEA' },
  ongoing: { dot: '#BA7517' },
  done: { dot: '#1D9E75' }
}
const TYPE_COLORS = {
  intern: { bg: '#EEEDFE', color: '#3C3489' },
  project: { bg: '#E1F5EE', color: '#085041' },
  cert: { bg: '#FAEEDA', color: '#633806' },
  job: { bg: '#FAECE7', color: '#993C1D' }
}

export default function Career({ data, saveData }) {
  const career = data.career || []

  function addCareer(status) {
    saveData({ career: [{ title: '', desc: '', date: '', type: 'project', status }, ...career] })
  }

  function updateCareer(i, field, value) {
    const updated = [...career]
    updated[i][field] = value
    saveData({ career: updated })
  }

  function delCareer(i) {
    saveData({ career: career.filter((_, idx) => idx !== i) })
  }

  function renderSection(status) {
    const items = career.filter(c => c.status === status)
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
          <span style={{ fontSize: '11px', fontWeight: '500', color: '#9999b3', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            {STATUS_KR[status]}
          </span>
          <button onClick={() => addCareer(status)} style={{ fontSize: '20px', color: '#7F77DD', border: 'none', background: 'none', cursor: 'pointer', lineHeight: 1 }}>+</button>
        </div>

        {!items.length && (
          <p style={{ fontSize: '13px', color: '#9999b3', padding: '0.3rem 0 0.8rem' }}>없음</p>
        )}

        {items.map(c => {
          const i = career.indexOf(c)
          const tc = TYPE_COLORS[c.type] || TYPE_COLORS.project
          return (
            <div key={i} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.85rem 1rem', marginBottom: '0.6rem', display: 'flex', gap: '12px' }}>
              {/* 상태 점 */}
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', flexShrink: 0, marginTop: '5px', background: STATUS_COLORS[c.status]?.dot || '#D0CEEA' }} />

              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 제목 인라인 수정 */}
                <input
                  value={c.title}
                  onChange={e => updateCareer(i, 'title', e.target.value)}
                  placeholder="제목 (예: 카카오 인턴 지원)"
                  style={{
                    width: '100%', fontSize: '14px', fontWeight: '500', color: '#1a1a2e',
                    border: 'none', background: 'transparent', outline: 'none',
                    fontFamily: 'sans-serif', padding: 0, marginBottom: '4px', boxSizing: 'border-box'
                  }}
                />
                {/* 메모 인라인 수정 */}
                <AutoTextarea
                  value={c.desc || ''}
                  onChange={e => updateCareer(i, 'desc', e.target.value)}
                  placeholder="메모, 준비사항..."
                  rows={2}
                  style={{
                    width: '100%', fontSize: '12px', color: '#555572',
                    border: 'none', background: 'transparent', outline: 'none',
                    fontFamily: 'sans-serif', padding: 0, lineHeight: '1.5', boxSizing: 'border-box'
                  }}
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
                  {/* 날짜 인라인 수정 */}
                  <input
                    value={c.date || ''}
                    onChange={e => updateCareer(i, 'date', e.target.value)}
                    placeholder="기간/마감일"
                    style={{
                      fontSize: '11px', color: '#9999b3', border: 'none',
                      background: 'transparent', outline: 'none',
                      fontFamily: 'sans-serif', padding: 0, width: '90px'
                    }}
                  />
                  {/* 상태 변경 */}
                  <select value={c.status} onChange={e => updateCareer(i, 'status', e.target.value)}
                    style={{ fontSize: '11px', border: '1px solid #E8E7F2', borderRadius: '6px', background: '#F7F6FB', padding: '2px 6px', color: '#555572', outline: 'none' }}>
                    {Object.entries(STATUS_KR).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  {/* 타입 변경 */}
                  <select value={c.type} onChange={e => updateCareer(i, 'type', e.target.value)}
                    style={{ fontSize: '11px', border: '1px solid #E8E7F2', borderRadius: '6px', background: '#F7F6FB', padding: '2px 6px', color: '#555572', outline: 'none' }}>
                    {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                  <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '10px', fontWeight: '500', background: tc.bg, color: tc.color }}>
                    {TYPE_LABELS[c.type]}
                  </span>
                </div>
              </div>

              <button onClick={() => delCareer(i)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>×</button>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Career</h2>
      {renderSection('ongoing')}
      {renderSection('planned')}
      {renderSection('done')}
    </div>
  )
}