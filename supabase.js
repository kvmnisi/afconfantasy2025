// supabase.js
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://hpihwsyawxoebzgsfenp.supabase.co' // Replace with your URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhwaWh3c3lhd3hvZWJ6Z3NmZW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ2OTUxMDQsImV4cCI6MjA4MDI3MTEwNH0.uFie6H5EfeJMZQWK7ziKBKO8Mfo83j9oBhsnwk73nro' // Replace with your key

export const supabase = createClient(supabaseUrl, supabaseAnonKey)