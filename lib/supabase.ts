import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://rauwxzrrvbusrgezabbr.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhdXd4enJydmJ1c3JnZXphYmJyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzEyODkxOTAsImV4cCI6MjA0Njg2NTE5MH0.z1doR7C04dRCHau1LtW-5oU32RCwCZg6ifTEYybVXQE"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})