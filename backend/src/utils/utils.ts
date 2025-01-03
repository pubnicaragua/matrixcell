import supabase from "../config/supabaseClient";



/**
* Calcula un rango de fechas dado un intervalo de días.
* @param daysAgo - Número de días hacia atrás desde hoy para calcular la fecha de inicio.
* @returns Un objeto con las fechas de inicio y fin.
*/
export const calculateDateRange = (daysAgo: number): { startDate: Date; endDate: Date } => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - daysAgo);
    return { startDate, endDate };
};
 export const separarNumerosYLetras = (input: string) => {
    const numeros = input.match(/\d+/g)?.join('') || ''; // Coincide con uno o más dígitos
    const letras = input.match(/[a-zA-Z]+/g)?.join(' ') || ' '; // Une letras en un solo string
  
    return {
      numeros, // Convierte a números si existen
      letras, // Devuelve las letras como un string
    };
  };
  export function isValidDate(dateString: string): boolean {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date.getTime());
}