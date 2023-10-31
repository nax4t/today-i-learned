import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://efrrngxjnwrfpbwimstt.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVmcnJuZ3hqbndyZnBid2ltc3R0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg1NDgyNzgsImV4cCI6MjAxNDEyNDI3OH0.QUuBr-57KUExO-2vXUFBuS7VOTGpKwhTVHi9LG1rkH4'
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
