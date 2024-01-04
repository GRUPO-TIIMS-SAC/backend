export function generateHtml(code: string) {
  return `
    <div style="display: flex; justify-content: center">
        <h1>Código de verificación</h1>
    </div>
    <p style="font-size: 18px;">Hola, este es tu código de verificación:</p>
    <div style="display: flex; justify-content: center">
      <div
        style="
          width: 200px;
          height: 55px;
          background-color: #ed820e;
          display: grid;
          justify-items: center;
          align-items: center;
        "
      >
        <h3
          style="
            color: white;
            letter-spacing: 0.35em;
          "
        >
        ${code}
        </h3>
      </div>    
    </div>
    <p style="color: gray; font-size: 12px;">El código de verificación tiene una validez de 15 minutos.</p>
    `;
}
