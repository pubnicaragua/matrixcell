// services/base.service.js

import supabase from "../config/supabaseClient";


// Servicio genérico
export const BaseService = {
  async logAudit(event: string, userId: string, table: string, details: any) {
    const auditLog = {
      event,
      table_name: table,
      user_id: userId,
      details,
      timestamp: new Date().toISOString(),
    };

    const { error } = await supabase.from('audit_logs').insert([auditLog]);
    if (error) console.error("Error al registrar auditoría:", error.message);
  },
  // Obtener todos los registros
  async getAll<T>(tableName: string,  columns: string[],  where: Record<string, any> = {} // Filtro opcional

  ): Promise<T[]> {
    if (!columns.length) {
      throw new Error('Debes especificar al menos una columna para generar el reporte.');
    }

    // Formatear columnas para la consulta
    const columnQuery = columns.join(',');

    // Crear la consulta base
    let query = supabase.from(tableName).select(columnQuery);

    // Aplicar filtros WHERE si se pasan
    Object.keys(where).forEach((key) => {
      query = query.eq(key, where[key]);
    });

    // Consultar datos desde Supabase con el filtro aplicado
    const { data, error } = await query
      .order(columns[0], { ascending: true }).returns<T[]>(); // Ordenar por la primera columna

    if (error) {
      throw new Error(`Error al consultar la tabla '${tableName}': ${error.message}`);
    }

    if (!data || data.length === 0) {
      return[]; // Si no hay datos, devolvemos una cadena vacía.
    }
    return data;
  },

  // Obtener un registro por ID
  async getById<T>(table: string, id: number): Promise<T> {
    const { data, error } = await supabase.from(table).select('*').eq('id', id);
    if (error) throw new Error(error.message);
    return data[0];
  },

  // Crear un nuevo registro
  async create<T>(table: string, entity: T, userId?: string): Promise<T> {
    const { data, error } = await supabase.from(table).insert([entity]).select();
    if (error) throw new Error(error.message);
    if (userId) {
      await this.logAudit("CREATE", userId, table, { entity });
    }
    return data[0];
  },

  // Actualizar un registro
  async update<T>(table: string, id: number|string, entity: T,userId?: string): Promise<T> {
    const { data, error } = await supabase
      .from(table)
      .update(entity)
      .eq('id', id)
      .select();
    if (error) throw new Error(error.message);
    if (userId) {
      await this.logAudit("UPDATE", userId, table, { entity });
    }
    return data[0];
  },

  // Eliminar un registro
  async delete<T>(table: string, id: string,userId?:string): Promise<void> {
    const { data, error } = await supabase.from(table).delete().eq('id', id);
    if (error) throw new Error(error.message);
    if (userId) {
      await this.logAudit("Delete", userId, table, { id:id });
    }
    return;
  },
   /**
     * Encuentra un único registro en una tabla específica.
     * @param tableName - Nombre de la tabla.
     * @param conditions - Condiciones de búsqueda.
     * @returns El registro encontrado o null.
     */
 async findOne<T>(
    tableName: string,
    conditions: Record<string, any>
): Promise<T | null> {
    try {
        const { data, error } = await supabase
            .from(tableName)
            .select("*")
            .match(conditions)
            .single(); // Asegura que solo devuelva un registro

        if (error) {
            console.error(`Error en findOne para la tabla ${tableName}:`, error);
            throw new Error(`No se pudo encontrar el registro en la tabla ${tableName}.`);
        }

        return data || null;
    } catch (error) {
        console.error(`Error en findOne para la tabla ${tableName}:`, error);
        throw new Error("Ocurrió un error al buscar el registro.");
    }
}
};
