import { useState } from 'react'

const ICONS = ['📚','💻','🎨','💡','🏃','💰','🔬','🌍','🎵','🍳','✈️','📷','🧠','🎯','🔧','📊']

export default function Knowledge({ data, saveData }) {
  const [selBinder, setSelBinder] = useState(null)
  const [selTab, setSelTab] = useState('links')
  const [showForm, setShowForm] = useState(false)
  const [binderName, setBinderName] = useState('')
  const [binderIcon, setBinderIcon] = useState(ICONS[0])
  const [binderType, setBinderType] = useState('general')
  const [linkForm, setLinkForm] = useState({ url: '', title: '', memo: '', tag: '', content: '' })
  const [conceptForm, setConceptForm] = useState({ title: '', body: '' })
  const todayStr = new Date().toISOString().split('T')[0]
  const binders = data.binders || []

  function addBinder() {
    if (!binderName.trim()) return
    saveData({ binders: [...binders, { name: binderName, icon: binderIcon, type: binderType, links: [], concepts: [] }] })
    setBinderName(''); setShowForm(false)
  }

  function delBinder(i) {
    if (!confirm('바인더를 삭제할까요?')) return
    saveData({ binders: binders.filter((_, idx) => idx !== i) })
    setSelBinder(null)
  }

  function addLink() {
    if (!linkForm.url.trim()) return
    const url = linkForm.url.startsWith('http') ? linkForm.url : 'https://' + linkForm.url
    const updated = [...binders]
    updated[selBinder].links = [{ ...linkForm, url, summary: '' }, ...(updated[selBinder].links || [])]
    saveData({ binders: updated })
    setLinkForm({ url: '', title: '', memo: '', tag: '', content: '' })
  }

  function delLink(li) {
    const updated = [...binders]
    updated[selBinder].links.splice(li, 1)
    saveData({ binders: updated })
  }

  function addConcept() {
    if (!conceptForm.title.trim()) return
    const updated = [...binders]
    if (!updated[selBinder].concepts) updated[selBinder].concepts = []
    updated[selBinder].concepts.unshift({ ...conceptForm, understand: 0, date: todayStr })
    saveData({ binders: updated })
    setConceptForm({ title: '', body: '' })
  }

  function delConcept(ci) {
    const updated = [...binders]
    updated[selBinder].concepts.splice(ci, 1)
    saveData({ binders: updated })
  }

  function setUnderstand(ci, n) {
    const updated = [...binders]
    updated[selBinder].concepts[ci].understand = n
    saveData({ binders: updated })
  }

  function getDomain(url) {
    try { return new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace('www.', '') }
    catch { return url }
  }

  // 바인더 목록
  if (selBinder === null) return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Knowledge</h2>

      {/* 새 바인더 폼 */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '1rem', marginBottom: '1rem' }}>
          <input
            value={binderName}
            onChange={e => setBinderName(e.target.value)}
            placeholder="바인더 이름 (예: 투자, 자료구조, 운동...)"
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', marginBottom: '10px', boxSizing: 'border-box' }}
          />
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
            {ICONS.map(ic => (
              <button key={ic} onClick={() => setBinderIcon(ic)} style={{
                width: '36px', height: '36px', borderRadius: '8px', fontSize: '18px',
                border: `1.5px solid ${binderIcon === ic ? '#7F77DD' : '#E8E7F2'}`,
                background: binderIcon === ic ? '#EEEDFE' : '#F7F6FB', cursor: 'pointer'
              }}>{ic}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            {[{ key: 'general', label: '📂 일반' }, { key: 'study', label: '📚 학습' }].map(t => (
              <button key={t.key} onClick={() => setBinderType(t.key)} style={{
                flex: 1, padding: '8px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer',
                border: `1.5px solid ${binderType === t.key ? '#7F77DD' : '#E8E7F2'}`,
                background: binderType === t.key ? '#EEEDFE' : '#F7F6FB',
                color: binderType === t.key ? '#3C3489' : '#9999b3', fontFamily: 'sans-serif'
              }}>{t.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: '8px', border: '1.5px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '14px', cursor: 'pointer' }}>취소</button>
            <button onClick={addBinder} style={{ padding: '9px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', cursor: 'pointer' }}>만들기</button>
          </div>
        </div>
      )}

      {/* 바인더 그리드 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
        {binders.map((b, i) => (
          <div key={i} onClick={() => setSelBinder(i)} style={{
            background: '#fff', borderRadius: '12px', border: '1.5px solid #E8E7F2',
            padding: '1rem', cursor: 'pointer', position: 'relative', transition: 'all 0.18s'
          }}>
            <button onClick={e => { e.stopPropagation(); delBinder(i) }} style={{
              position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px',
              borderRadius: '50%', border: '1px solid #E8E7F2', background: '#F7F6FB',
              color: '#9999b3', fontSize: '13px', cursor: 'pointer'
            }}>×</button>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{b.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1a1a2e', marginBottom: '4px' }}>{b.name}</div>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#9999b3' }}>{(b.links || []).length}개 링크</span>
              <span style={{
                fontSize: '10px', padding: '1px 7px', borderRadius: '10px', fontWeight: '500',
                background: b.type === 'study' ? '#E1F5EE' : '#EEEDFE',
                color: b.type === 'study' ? '#085041' : '#3C3489'
              }}>{b.type === 'study' ? '학습' : '일반'}</span>
            </div>
          </div>
        ))}
        <div onClick={() => setShowForm(true)} style={{
          background: 'transparent', borderRadius: '12px', border: '1.5px dashed #D0CEEA',
          padding: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '6px', minHeight: '100px'
        }}>
          <span style={{ fontSize: '26px', color: '#9999b3' }}>+</span>
          <span style={{ fontSize: '13px', color: '#9999b3' }}>새 바인더</span>
        </div>
      </div>
    </div>
  )

  const b = binders[selBinder]
  const isStudy = b.type === 'study'

  // 바인더 상세
  return (
    <div>
      <div onClick={() => setSelBinder(null)} style={{ fontSize: '14px', color: '#7F77DD', cursor: 'pointer', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}>
        ← Knowledge
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '24px' }}>{b.icon}</span>
        <span style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a2e' }}>{b.name}</span>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
        {['links', ...(isStudy ? ['concepts'] : [])].map(t => (
          <button key={t} onClick={() => setSelTab(t)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
            border: `1.5px solid ${selTab === t ? '#7F77DD' : '#E8E7F2'}`,
            background: selTab === t ? '#7F77DD' : 'transparent',
            color: selTab === t ? '#fff' : '#9999b3', fontFamily: 'sans-serif'
          }}>{t === 'links' ? '링크' : '개념카드'}</button>
        ))}
      </div>

      {/* 링크 탭 */}
      {selTab === 'links' && (
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {['url', 'title', 'memo', 'tag'].map(field => (
              <input key={field} value={linkForm[field]} onChange={e => setLinkForm(prev => ({ ...prev, [field]: e.target.value }))}
                placeholder={{ url: 'URL (https://...)', title: '제목 (선택)', memo: '메모 (선택)', tag: '태그 (선택)' }[field]}
                style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F7F6FB' }}
              />
            ))}
            <textarea
              value={linkForm.content}
              onChange={e => setLinkForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="📋 내용 붙여넣기 (선택)&#10;유튜브 자막, 기사 본문 등 → AI가 정확하게 요약"
              rows={3}
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#F7F6FB', resize: 'none', lineHeight: '1.6', fontFamily: 'sans-serif' }}
            />
            <button onClick={addLink} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>저장</button>
          </div>

          {!(b.links || []).length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '1.5rem 0' }}>링크를 추가해봐</p>}
          {(b.links || []).map((l, li) => (
            <div key={li} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.85rem 1rem', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: '#EEEDFE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#3C3489', fontWeight: '600', flexShrink: 0 }}>
                  {getDomain(l.url)[0]?.toUpperCase() || '?'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <a href={l.url} target="_blank" rel="noopener" style={{ fontSize: '14px', fontWeight: '500', color: '#7F77DD', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '3px', textDecoration: 'none' }}>
                    {l.title || getDomain(l.url)}
                  </a>
                  <div style={{ fontSize: '12px', color: '#9999b3' }}>{getDomain(l.url)}</div>
                  {l.memo && <div style={{ fontSize: '13px', color: '#555572', marginTop: '3px' }}>{l.memo}</div>}
                  {l.tag && <span style={{ fontSize: '11px', padding: '2px 9px', borderRadius: '10px', background: '#EEEDFE', color: '#3C3489', marginTop: '5px', display: 'inline-block', fontWeight: '500' }}>{l.tag}</span>}
                </div>
                <button onClick={() => delLink(li)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>
              {l.content && <div style={{ fontSize: '12px', color: '#9999b3', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #E8E7F2' }}>📋 내용 {l.content.length}자 저장됨</div>}
            </div>
          ))}
        </div>
      )}

      {/* 개념카드 탭 */}
      {selTab === 'concepts' && (
        <div>
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '1rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <input value={conceptForm.title} onChange={e => setConceptForm(prev => ({ ...prev, title: e.target.value }))}
              placeholder="개념 이름 (예: 퀵소트)"
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '14px', outline: 'none', background: '#F7F6FB' }}
            />
            <textarea value={conceptForm.body} onChange={e => setConceptForm(prev => ({ ...prev, body: e.target.value }))}
              placeholder="핵심 내용, 공식, 설명..."
              rows={3}
              style={{ padding: '10px 14px', border: '1.5px solid #E8E7F2', borderRadius: '8px', fontSize: '13px', outline: 'none', background: '#F7F6FB', resize: 'none', fontFamily: 'sans-serif' }}
            />
            <button onClick={addConcept} style={{ padding: '10px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '14px', fontWeight: '500', cursor: 'pointer' }}>추가</button>
          </div>

          {!(b.concepts || []).length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '1.5rem 0' }}>개념카드를 추가해봐</p>}
          {(b.concepts || []).map((c, ci) => (
            <div key={ci} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <span style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#1a1a2e' }}>{c.title}</span>
                <button onClick={() => delConcept(ci)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
              </div>
              {c.body && <p style={{ fontSize: '13px', color: '#555572', lineHeight: '1.7', marginBottom: '8px' }}>{c.body}</p>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9999b3' }}>이해도</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} onClick={() => setUnderstand(ci, n)} style={{
                      width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                      border: `1.5px solid ${(c.understand || 0) >= n ? '#1D9E75' : '#E8E7F2'}`,
                      background: (c.understand || 0) >= n ? '#1D9E75' : 'transparent',
                      transition: 'all 0.15s'
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: '#9999b3' }}>
                  {['', '조금', '반반', '잘 앎', '완전 이해'][c.understand || 0]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}