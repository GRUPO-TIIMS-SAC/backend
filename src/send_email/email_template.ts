export function generateHtml(code: string) {
  return `
    <h1 style='text-center'>Código de verificación</h1>
        <div style='width:255px; height: 55px; background-color: #FF7F50'>
            <p style='color: white'>El código de verificación es: <strong>${code}</strong></p>
        </div>
    `;
}
