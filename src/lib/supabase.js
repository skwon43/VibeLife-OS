// Supabase 클라이언트 설정 파일
// 모든 컴포넌트에서 이 파일을 import해서 DB에 접근

import { createClient } from '@supabase/supabase-js'

// .env 파일에서 환경변수 읽기 (VITE_ 접두사 필수)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Supabase 연결 객체 생성 후 export
// 다른 파일에서 import { supabase } from '../lib/supabase' 로 사용
export const supabase = createClient(supabaseUrl, supabaseKey)