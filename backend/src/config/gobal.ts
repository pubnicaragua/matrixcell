import dotenv from 'dotenv';
dotenv.config(); 
export const {
    PORT = 5000,
    ALLOWED_ORIGIN = '',
    SUPABASE_URL = '',
    SUPABASE_API_KEY = '',
    SUPABASE_SERVICE_ROLE='',
    URL_RESET_PASSWORD=''
} = process.env;
  
  export const config = {
    port: Number(PORT),
    allowedOrigin: ALLOWED_ORIGIN.split(','),  // Convertir la cadena en un array
    db: {
      host: SUPABASE_URL,
      apiKey: SUPABASE_API_KEY,
      secretKey:SUPABASE_SERVICE_ROLE
    },
  };
  