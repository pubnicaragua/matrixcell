import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://xqryrzcpcjkhunfhfzmr.supabase.co';
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
