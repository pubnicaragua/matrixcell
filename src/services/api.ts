import supabase from '../api/supabase';
// import api from '../api/endpoints';
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://xqryrzcpcjkhunfhfzmr.supabase.co',
  headers: {
      apiKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY',
      // Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNTI1MzY4MSwiZXhwIjoyMDUwODI5NjgxfQ.zPIQl-V0XBau1klqwOo_HUDlPmO0W8BgXCLtdEeIC_M'
  },
});

export default api;