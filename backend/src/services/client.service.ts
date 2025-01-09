
export function extractFirstNumber(input: string| null): number | null {
    const match = input?.match(/\d+/); // Busca el primer número
    return match ? Number(match[0]) : null;
}