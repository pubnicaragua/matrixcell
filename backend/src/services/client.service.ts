
export function extractFirstNumber(input: string| null): number | null {
    const match = input?.match(/\d+/); // Busca el primer número
    return match ? Number(match[0]) : null;
}
export function generarCodigoDesbloqueo(): string {
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const codigoLetras = Array.from({ length: 4 }, () => letras[Math.floor(Math.random() * letras.length)]).join('');
    const codigoNumeros = Array.from({ length: 4 }, () => numeros[Math.floor(Math.random() * numeros.length)]).join('');
    return `${codigoLetras}${codigoNumeros}`;
}