import { createClient } from '@supabase/supabase-js';
import { config } from './gobal';

const { db } = config;

// Sustituye estos valores con tus credenciales de Supabase
const supabaseAdmin = createClient(db.host, db.secretKey);
export default supabaseAdmin; // Exportación como ES Module

