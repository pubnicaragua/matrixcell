// src/types/supabase.d.ts
declare module '../api/supabase' {
    import { SupabaseClient } from '@supabase/supabase-js';
    const supabase: SupabaseClient;
    export default supabase;
  }
  