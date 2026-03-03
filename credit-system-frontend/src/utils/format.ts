export const getTwoCapitalLetter = (entrada: string): string => {
  // Quitar espacios al inicio y final, y reemplazar múltiples espacios por uno solo
  const textoLimpio = entrada.trim().replace(/\s+/g, " ");
  const palabras = textoLimpio.split(" ");
  const primeraLetra = palabras[0]?.[0] || "";
  const segundaLetra =
    palabras.length > 1 ? palabras[1]?.[0] : palabras[0]?.[1] || "";

  if (!segundaLetra) {
    return primeraLetra.toUpperCase();
  }

  return (primeraLetra + segundaLetra).toUpperCase();
};
