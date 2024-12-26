import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = 'https://elnsqlogvbumukipeczr.supabase.co';
const supabaseKey: string =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVsbnNxbG9ndmJ1bXVraXBlY3pyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUxNDAxMTYsImV4cCI6MjA1MDcxNjExNn0.SpKnOB4EyfoK6k7gjIYB5Tctt7366m4YgnWn6TsrAaA';

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
