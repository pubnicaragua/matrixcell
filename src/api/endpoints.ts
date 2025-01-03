import axios from "axios";

const supabaseUrl = "https://xqryrzcpcjkhunfhfzmr.supabase.co"; // Verifica esto

export const getAuthTokens = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      email,
      password,
    }, {
      headers: {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY",
      },
    });

    const { access_token, refresh_token, expires_in } = response.data;
    return { access_token, refresh_token, expires_in };
  } catch (error) {
    console.error("Error al obtener los tokens de autenticación:", error);
    throw error;
  }
};

export const getUsers = async (accessToken: string) => {
  try {
    const { data } = await axios.get(`${supabaseUrl}/rest/v1/usuarios`, {
      headers: {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY",
        Authorization: `Bearer ${accessToken}`, // Usa el token que obtuviste
      },
    });
    return data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

export const addUser = async (newUser: any, accessToken: string) => {
  try {
    await axios.post(`${supabaseUrl}/rest/v1/usuarios`, newUser, {
      headers: {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY", // Verifica que sea correcta
        Authorization: `Bearer ${accessToken}`, // Verifica esto también
      },
    });
  } catch (error) {
    console.error("Error al agregar el usuario:", error);
    throw error;
  }
}

export const updateUser = async (id: string, updatedData: any, accessToken: string) => {
  try {
    await axios.patch(`${supabaseUrl}/rest/v1/usuarios?id=eq.${id}`, updatedData, {
      headers: {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY", // Verifica que sea correcta
        Authorization: `Bearer ${accessToken}`, // Verifica esto también
      },
    });
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
    throw error;
  }
}

export const deleteUser = async (id: string, accessToken: string) => {
  try {
    await axios.delete(`${supabaseUrl}/rest/v1/usuarios?id=eq.${id}`, {
      headers: {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhxcnlyemNwY2praHVuZmhmem1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzUyNTM2ODEsImV4cCI6MjA1MDgyOTY4MX0.UPQKYkIdATVRxPQyXtklOzrXSR_touHP9WoKq_oJQWY", // Verifica que sea correcta
        Authorization: `Bearer ${accessToken}`, // Verifica esto también
      },
    });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error);
    throw error;
  }
}