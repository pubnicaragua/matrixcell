import { createClient, SupabaseClient } from '@supabase/supabase-js';
import PDFDocument from 'pdfkit-table';
import { Buffer } from 'buffer';

// Configuración de Supabase (asegúrate de tener un archivo supabaseClient.ts configurado correctamente)
import supabase from '../config/supabaseClient';

/**
 * Generar un reporte en PDF de cualquier tabla de Supabase.
 * 
 * @param {string} tableName - Nombre de la tabla.
 * @param {Array<string>} columns - Columnas a incluir en el reporte.
 * @param {boolean} [isLandscape=false] - Si es true, el PDF será en formato horizontal (landscape).
 * @param {Record<string, any>} [where={}] - Condiciones para el filtro WHERE en la consulta.
 * @returns {Promise<string>} - El archivo PDF en formato base64.
 */
export async function generarReporteGenericoPDF<T extends Record<string, any>>(
  tableName: string, 
  columns: string[],
  isLandscape: boolean = false,
  where: Record<string, any> = {} // Filtro opcional
): Promise<string> {
  return new Promise<string>(async (resolve, reject) => {
    try {
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
        return resolve(''); // Si no hay datos, devolvemos una cadena vacía.
      }

      // Crear documento PDF
      const doc = new PDFDocument({
        size: 'letter', // Tamaño de papel por defecto
        layout: isLandscape ? 'landscape' : 'portrait' // Establecer orientación
      });
      const buffers: Buffer[] = [];

      // Configurar el documento para que se guarde en un buffer en memoria
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        // Convertir el buffer a base64 una vez que el documento haya sido generado
        const base64 = Buffer.concat(buffers).toString('base64');
        resolve(base64); // Resolvemos la promesa con el base64 generado.
      });

      // Agregar título al PDF
      doc
        .fontSize(18)
        .text(`Reporte de la tabla: ${tableName}`, { align: 'center' })
        .moveDown(1);

      // Preparar datos para la tabla
      const tableData = {
        headers: columns.map((col) => col.toUpperCase()),
        rows: data.map((row: T) => columns.map((col) => row[col] ?? 'N/A'))
      };

      // Agregar la tabla al documento
      await doc.table(tableData, {
        prepareHeader: () => doc.fontSize(12).fillColor('black'),
        prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => {
          // Asegurarse de que indexRow no sea undefined
          const rowColor = (indexRow !== undefined && indexRow % 2 === 0) ? 'gray' : 'black';
          doc.fontSize(10).fillColor(rowColor);
          return doc; // Aseguramos que la función devuelva el documento
        }
      });

      // Finalizar el documento
      doc.end();
    } catch (error) {
      console.error('Error al generar el reporte:', error);
      reject(''); // Rechazamos la promesa en caso de error.
    }
  });
}
