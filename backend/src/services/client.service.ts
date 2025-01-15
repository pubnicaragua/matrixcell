
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
export function generarCedulaEcuatoriana(): string {
    // Paso 1: Generar los primeros 9 dígitos de la cédula
    const provincia = Math.floor(Math.random() * 24) + 1; // Provincia entre 01 y 24
    const tercerDigito = Math.floor(Math.random() * 7); // Tercer dígito entre 0 y 6
    const aleatorios = Array.from({ length: 6 }, () => Math.floor(Math.random() * 10)); // Seis dígitos aleatorios

    // Construir la base de la cédula
    const cedulaBase: number[] = [
        ...`${provincia}`.padStart(2, "0").split("").map(Number), // Provincia con dos dígitos
        tercerDigito,
        ...aleatorios,
    ];

    // Paso 2: Calcular el dígito verificador
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]; // Coeficientes alternados
    let suma = 0;

    cedulaBase.forEach((num, index) => {
        const producto = num * coeficientes[index];
        suma += producto > 9 ? producto - 9 : producto;
    });

    const digitoVerificador = (10 - (suma % 10)) % 10;

    // Paso 3: Formar la cédula completa
    return [...cedulaBase, digitoVerificador].join("");
}
