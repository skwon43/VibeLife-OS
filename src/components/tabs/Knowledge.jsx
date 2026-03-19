import { useState } from 'react'
import AutoTextarea from '../../lib/AutoTextarea'

const ICONS = ['📚','💻','🎨','💡','🏃','💰','🔬','🌍','🎵','🍳','✈️','📷','🧠','🎯','🔧','📊']

export default function Knowledge({ data, saveData }) {
  const [selBinder, setSelBinder] = useState(null)
  const [selTab, setSelTab] = useState('links')
  const [showForm, setShowForm] = useState(false)
  const [noteMode, setNoteMode] = useState(false)
  const [editingNote, setEditingNote] = useState(null)
  const [binderName, setBinderName] = useState('')
  const [binderIcon, setBinderIcon] = useState(ICONS[0])
  const [binderType, setBinderType] = useState('general')
  const [linkForm, setLinkForm] = useState({ url: '', title: '', memo: '', tag: '', content: '' })
  const [noteForm, setNoteForm] = useState({ title: '', body: '' })
  const [conceptForm, setConceptForm] = useState({ title: '', body: '' })

  const binders = data.binders || []

  function addBinder() {
    if (!binderName.trim()) return
    saveData({ binders: [...binders, { name: binderName, icon: binderIcon, type: binderType, links: [], notes: [], concepts: [] }] })
    setBinderName(''); setBinderIcon(ICONS[0]); setBinderType('general'); setShowForm(false)
  }

  function delBinder(i) {
    if (!confirm('바인더를 삭제할까요?')) return
    saveData({ binders: binders.filter((_, idx) => idx !== i) })
    setSelBinder(null)
  }

  // 바인더 이름 인라인 수정
  function updateBinderName(i, value) {
    const updated = [...binders]
    updated[i].name = value
    saveData({ binders: updated })
  }

  function addLink() {
    if (!linkForm.url.trim()) return
    const url = linkForm.url.startsWith('http') ? linkForm.url : 'https://' + linkForm.url
    const updated = binders.map((b, i) =>
      i === selBinder ? { ...b, links: [{ ...linkForm, url, summary: '' }, ...(b.links || [])] } : b
    )
    saveData({ binders: updated })
    setLinkForm({ url: '', title: '', memo: '', tag: '', content: '' })
  }

  function delLink(li) {
    const updated = binders.map((b, i) =>
      i === selBinder ? { ...b, links: b.links.filter((_, idx) => idx !== li) } : b
    )
    saveData({ binders: updated })
  }

  // 링크 인라인 수정
  function updateLink(li, field, value) {
    const updated = binders.map((b, i) => {
      if (i !== selBinder) return b
      const links = [...b.links]
      links[li] = { ...links[li], [field]: value }
      return { ...b, links }
    })
    saveData({ binders: updated })
  }

  function saveNote() {
    if (!noteForm.title.trim() && !noteForm.body.trim()) return
    const updated = binders.map((b, i) =>
      i === selBinder
        ? { ...b, notes: [{ title: noteForm.title, body: noteForm.body, date: new Date().toISOString().split('T')[0] }, ...(b.notes || [])] }
        : b
    )
    saveData({ binders: updated })
    setNoteForm({ title: '', body: '' })
    setNoteMode(false)
  }

  function updateNote(ni) {
    const updated = binders.map((b, i) =>
      i === selBinder
        ? { ...b, notes: b.notes.map((n, idx) => idx === ni ? { ...n, title: noteForm.title, body: noteForm.body } : n) }
        : b
    )
    saveData({ binders: updated })
    setEditingNote(null)
    setNoteForm({ title: '', body: '' })
    setNoteMode(false)
  }

  function delNote(ni) {
    const updated = binders.map((b, i) =>
      i === selBinder ? { ...b, notes: b.notes.filter((_, idx) => idx !== ni) } : b
    )
    saveData({ binders: updated })
  }

  function openNoteEdit(ni) {
    const n = binders[selBinder].notes[ni]
    setNoteForm({ title: n.title, body: n.body })
    setEditingNote(ni)
    setNoteMode(true)
  }

  function addConcept() {
    if (!conceptForm.title.trim()) return
    const updated = binders.map((b, i) =>
      i === selBinder
        ? { ...b, concepts: [{ ...conceptForm, understand: 0, date: new Date().toISOString().split('T')[0] }, ...(b.concepts || [])] }
        : b
    )
    saveData({ binders: updated })
    setConceptForm({ title: '', body: '' })
  }

  function delConcept(ci) {
    const updated = binders.map((b, i) =>
      i === selBinder ? { ...b, concepts: b.concepts.filter((_, idx) => idx !== ci) } : b
    )
    saveData({ binders: updated })
  }

  // 개념카드 인라인 수정
  function updateConcept(ci, field, value) {
    const updated = binders.map((b, i) => {
      if (i !== selBinder) return b
      const concepts = [...b.concepts]
      concepts[ci] = { ...concepts[ci], [field]: value }
      return { ...b, concepts }
    })
    saveData({ binders: updated })
  }

  function setUnderstand(ci, n) {
    const updated = binders.map((b, i) =>
      i === selBinder
        ? { ...b, concepts: b.concepts.map((c, idx) => idx === ci ? { ...c, understand: n } : c) }
        : b
    )
    saveData({ binders: updated })
  }

  function getDomain(url) {
    try { return new URL(url.startsWith('http') ? url : 'https://' + url).hostname.replace('www.', '') }
    catch { return url }
  }

  // 풀스크린 노트 에디터
  if (noteMode) {
    const isEditing = editingNote !== null
    return (
      <div style={{ position: 'fixed', inset: 0, background: '#FAFAF9', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #E8E7F2', background: '#fff' }}>
          <button onClick={() => { setNoteMode(false); setEditingNote(null); setNoteForm({ title: '', body: '' }) }}
            style={{ padding: '6px 14px', borderRadius: '8px', border: '1.5px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '13px', cursor: 'pointer' }}>← 취소</button>
          <span style={{ flex: 1, fontSize: '14px', fontWeight: '600', color: '#1a1a2e' }}>{isEditing ? '노트 편집' : '새 노트'}</span>
          <button onClick={() => isEditing ? updateNote(editingNote) : saveNote()}
            style={{ padding: '6px 18px', borderRadius: '8px', border: 'none', background: '#7F77DD', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}>저장</button>
        </div>
        <input value={noteForm.title} onChange={e => setNoteForm(prev => ({ ...prev, title: e.target.value }))}
          placeholder="제목"
          style={{ padding: '20px 22px 10px', fontSize: '22px', fontWeight: '700', border: 'none', outline: 'none', background: 'transparent', color: '#1a1a2e', fontFamily: 'sans-serif' }}
        />
        <textarea value={noteForm.body} onChange={e => setNoteForm(prev => ({ ...prev, body: e.target.value }))}
          placeholder="여기에 자유롭게 메모하세요..." autoFocus
          style={{ flex: 1, padding: '10px 22px 22px', fontSize: '15px', lineHeight: '1.85', border: 'none', outline: 'none', background: 'transparent', color: '#333355', resize: 'none', fontFamily: 'sans-serif', overflowY: 'auto' }}
        />
        <div style={{ padding: '8px 22px', borderTop: '1px solid #E8E7F2', fontSize: '12px', color: '#c0c0d8', background: '#fff' }}>
          {noteForm.body.length}자
        </div>
      </div>
    )
  }

  // 바인더 목록
  if (selBinder === null) return (
    <div>
      <h2 style={{ fontSize: '18px', fontWeight: '600', color: '#1a1a2e', marginBottom: '1rem' }}>Knowledge</h2>

      {showForm && (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '1rem', marginBottom: '1rem' }}>
          <input value={binderName} onChange={e => setBinderName(e.target.value)}
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '10px' }}>
        {binders.map((b, i) => (
          <div key={i} onClick={() => { setSelBinder(i); setSelTab('links') }} style={{
            background: '#fff', borderRadius: '12px', border: '1.5px solid #E8E7F2',
            padding: '1rem', cursor: 'pointer', position: 'relative'
          }}>
            <button onClick={e => { e.stopPropagation(); delBinder(i) }} style={{
              position: 'absolute', top: '8px', right: '8px', width: '22px', height: '22px',
              borderRadius: '50%', border: '1px solid #E8E7F2', background: '#F7F6FB',
              color: '#9999b3', fontSize: '13px', cursor: 'pointer'
            }}>×</button>
            <div style={{ fontSize: '26px', marginBottom: '6px' }}>{b.icon}</div>
            {/* 바인더 이름 인라인 수정 */}
            <input
              value={b.name}
              onChange={e => { e.stopPropagation(); updateBinderName(i, e.target.value) }}
              onClick={e => e.stopPropagation()}
              style={{
                fontSize: '14px', fontWeight: '500', color: '#1a1a2e',
                border: 'none', background: 'transparent', outline: 'none',
                fontFamily: 'sans-serif', padding: 0, width: '100%', marginBottom: '4px',
                cursor: 'text'
              }}
            />
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '11px', color: '#9999b3' }}>{(b.links || []).length}링크</span>
              <span style={{ fontSize: '11px', color: '#9999b3' }}>·</span>
              <span style={{ fontSize: '11px', color: '#9999b3' }}>{(b.notes || []).length}노트</span>
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
  const tabs = ['links', 'notes', ...(isStudy ? ['concepts'] : [])]

  return (
    <div>
      <div onClick={() => setSelBinder(null)} style={{ fontSize: '14px', color: '#7F77DD', cursor: 'pointer', marginBottom: '0.75rem', fontWeight: '500' }}>
        ← Knowledge
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '24px' }}>{b.icon}</span>
        <span style={{ fontSize: '20px', fontWeight: '600', color: '#1a1a2e' }}>{b.name}</span>
      </div>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '1rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setSelTab(t)} style={{
            padding: '6px 14px', borderRadius: '20px', fontSize: '13px', cursor: 'pointer',
            border: `1.5px solid ${selTab === t ? '#7F77DD' : '#E8E7F2'}`,
            background: selTab === t ? '#7F77DD' : 'transparent',
            color: selTab === t ? '#fff' : '#9999b3', fontFamily: 'sans-serif'
          }}>{{ links: '링크', notes: '노트', concepts: '개념카드' }[t]}</button>
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
            <textarea value={linkForm.content} onChange={e => setLinkForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="📋 내용 붙여넣기 (선택)" rows={3}
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
                  {/* 링크 제목 인라인 수정 */}
                  <input
                    value={l.title || ''}
                    onChange={e => updateLink(li, 'title', e.target.value)}
                    placeholder={getDomain(l.url)}
                    style={{ width: '100%', fontSize: '14px', fontWeight: '500', color: '#7F77DD', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'sans-serif', padding: 0, marginBottom: '3px' }}
                  />
                  <div style={{ fontSize: '12px', color: '#9999b3', marginBottom: '3px' }}>{getDomain(l.url)}</div>
                  {/* 메모 인라인 수정 */}
                  <input
                    value={l.memo || ''}
                    onChange={e => updateLink(li, 'memo', e.target.value)}
                    placeholder="메모 추가..."
                    style={{ width: '100%', fontSize: '13px', color: '#555572', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'sans-serif', padding: 0 }}
                  />
                  {/* 태그 인라인 수정 */}
                  <input
                    value={l.tag || ''}
                    onChange={e => updateLink(li, 'tag', e.target.value)}
                    placeholder="태그..."
                    style={{ fontSize: '11px', color: '#3C3489', border: 'none', background: l.tag ? '#EEEDFE' : 'transparent', outline: 'none', fontFamily: 'sans-serif', padding: l.tag ? '2px 9px' : '0', borderRadius: '10px', marginTop: '4px' }}
                  />
                </div>
                <button onClick={() => delLink(li)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>
              {l.content && <div style={{ fontSize: '12px', color: '#9999b3', marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #E8E7F2' }}>📋 내용 {l.content.length}자 저장됨</div>}
            </div>
          ))}
        </div>
      )}

      {/* 노트 탭 */}
      {selTab === 'notes' && (
        <div>
          <button onClick={() => { setNoteForm({ title: '', body: '' }); setEditingNote(null); setNoteMode(true) }}
            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1.5px dashed #D0CEEA', background: 'transparent', color: '#7F77DD', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            ✏️ 새 노트 작성
          </button>
          {!(b.notes || []).length && <p style={{ fontSize: '14px', color: '#9999b3', textAlign: 'center', padding: '1.5rem 0' }}>노트를 추가해봐</p>}
          {(b.notes || []).map((n, ni) => (
            <div key={ni} onClick={() => openNoteEdit(ni)} style={{ background: '#fff', borderRadius: '12px', border: '1px solid #E8E7F2', padding: '0.9rem 1rem', marginBottom: '0.65rem', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' }}>{n.title || '(제목 없음)'}</div>
                  {n.body && <div style={{ fontSize: '13px', color: '#9999b3', lineHeight: '1.6', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{n.body}</div>}
                  <div style={{ fontSize: '11px', color: '#c0c0d8', marginTop: '6px' }}>{n.date}</div>
                </div>
                <button onClick={e => { e.stopPropagation(); delNote(ni) }}
                  style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer', flexShrink: 0 }}>×</button>
              </div>
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
            <textarea
              value={conceptForm.body}
              onChange={e => setConceptForm(prev => ({ ...prev, body: e.target.value }))}
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
                {/* 개념 제목 인라인 수정 */}
                <input
                  value={c.title}
                  onChange={e => updateConcept(ci, 'title', e.target.value)}
                  style={{ flex: 1, fontSize: '14px', fontWeight: '500', color: '#1a1a2e', border: 'none', background: 'transparent', outline: 'none', fontFamily: 'sans-serif', padding: 0 }}
                />
                <button onClick={() => delConcept(ci)} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1px solid #E8E7F2', background: 'transparent', color: '#9999b3', fontSize: '15px', cursor: 'pointer' }}>×</button>
              </div>
              {/* 개념 내용 인라인 수정 */}
              <textarea
                value={c.body || ''}
                onChange={e => updateConcept(ci, 'body', e.target.value)}
                placeholder="핵심 내용..."
                style={{ width: '100%', fontSize: '13px', color: '#555572', lineHeight: '1.7', marginBottom: '8px', border: 'none', background: 'transparent', outline: 'none', resize: 'none', fontFamily: 'sans-serif', padding: 0 }}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: '#9999b3' }}>이해도</span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[1, 2, 3, 4].map(n => (
                    <div key={n} onClick={() => setUnderstand(ci, n)} style={{
                      width: '16px', height: '16px', borderRadius: '50%', cursor: 'pointer',
                      border: `1.5px solid ${(c.understand || 0) >= n ? '#1D9E75' : '#E8E7F2'}`,
                      background: (c.understand || 0) >= n ? '#1D9E75' : 'transparent'
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