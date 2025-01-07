import { createClient } from '@supabase/supabase-js';
import { config } from './gobal';

const { db } = config;

// Sustituye estos valores con tus credenciales de Supabase
const supabase = createClient(db.host, db.apiKey);
export default supabase; // Exportación como ES Module

