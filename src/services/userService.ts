// src/services/userService.ts
import { supabase } from "../api/supabase";

export const fetchUsers = async () => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, nombre, email, rol, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const createUser = async (nombre: string, email: string, rol: number) => {
  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, email, rol }])
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const updateUser = async (id: number, nombre: string, email: string, rol: number) => {
  const { data, error } = await supabase
    .from('usuarios')
    .update({ nombre, email, rol })
    .eq('id', id)
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const deleteUser = async (id: number) => {
  const { error } = await supabase
    .from('usuarios')
    .delete()
    .eq('id', id);

  if (error) {
    throw new Error(error.message);
  }
};
