import { createClient } from '@supabase/supabase-js'

const supabase = await createClient("https://yjmozgravfjswlroekua.supabase.co", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlqbW96Z3JhdmZqc3dscm9la3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTM0NzE2NjgsImV4cCI6MjAwOTA0NzY2OH0.FcmlYyDeULNbRIpQaSZymEv_klOdL-3fdkw6OogtOb4");
export { supabase };