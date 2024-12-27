import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://xqryrzcpcjkhunfhfzmr.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY';

// Inicializar el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseKey);
