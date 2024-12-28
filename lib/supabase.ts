import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://oqeremhdtpbqwkwzuwkq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9xZXJlbWhkdHBicXdrd3p1d2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxMTY1NTksImV4cCI6MjA1MDY5MjU1OX0.lbCgOgzZBRSGPUvs77-qLUs-dLTrZGqA64jqtVteQB4"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})