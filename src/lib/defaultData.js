// 신규 유저에게 보여줄 예시 데이터
export const ONBOARDING_DATA = {
  goals: [
    {
      title: '올해 목표 세워보기',
      pct: 30,
      milestones: [
        { text: '목표 3가지 작성하기', done: true },
        { text: '월별 계획 세우기', done: false },
        { text: '첫 번째 목표 실행하기', done: false },
      ],
      _open: false
    },
    {
      title: '새로운 스킬 배우기',
      pct: 0,
      milestones: [
        { text: '배우고 싶은 스킬 정하기', done: false },
        { text: '학습 자료 찾기', done: false },
      ],
      _open: false
    }
  ],
  habits: [
    { name: '매일 30분 독서', done: [] },
    { name: '운동', done: [] },
  ],
  ideas: [
    {
      text: '💡 오늘 떠오른 아이디어를 여기에 적어봐!\n어떤 생각이든 바로 캡처해두면 나중에 도움이 돼.',
      tags: ['other'],
      date: new Date().toISOString().split('T')[0],
      ts: Date.now()
    }
  ],
  binders: [
    {
      name: '관심 분야',
      icon: '🌍',
      type: 'general',
      links: [
        {
          url: 'https://www.notion.so',
          title: '참고할 만한 링크를 여기 저장해봐',
          memo: '링크 + 메모 + AI 요약 가능!',
          tag: '예시',
          content: '',
          summary: ''
        }
      ],
      concepts: []
    }
  ],
  vocab: [
    {
      expr: 'by the way',
      example: 'By the way, did you finish the report?',
      nuance: '대화 주제를 바꾸거나 추가할 때 자연스럽게 쓰는 표현',
      cat: 'casual',
      remembered: false,
      similar: ''
    },
    {
      expr: 'touch base',
      example: "Let's touch base next week to discuss the project.",
      nuance: '잠깐 연락하거나 확인할 때 — 이메일/미팅에서 자주 쓰임',
      cat: 'meeting',
      remembered: false,
      similar: ''
    }
  ],
  career: [
    {
      title: '목표 직무/회사 정해보기',
      desc: '관심 있는 회사나 직무를 조사해보자',
      date: '',
      type: 'job',
      status: 'planned'
    }
  ],
  skills: [
    { name: '관심 있는 스킬 추가해봐', level: 1, cat: '기타' }
  ],
  tasks: {},
  journal: {},
  notes: [],
  _isOnboarding: true  // 예시 데이터임을 표시
}