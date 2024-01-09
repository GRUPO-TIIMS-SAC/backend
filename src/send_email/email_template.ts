export function generateHtml(code: string) {
  return `
  <div style="padding: 55px">
  <div style="margin-bottom: 34px;">
    <img src="./assets/images/HOLA_ CORREO ELECTRONICO.png" style="height: 32px" />
  </div>
  <div style="display: grid; margin-bottom: 34px;font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <span style="font-size: 14px;">Su código de verificación es:</span>
    <span style="font-size: 36px;"><strong>${code}</strong></span>
    <span style="font-size: 14px;">
      Este código caducara en 15 minutos. <br> 
      Si no solicitó este código puede omitir este correo electrónico.
    </span>
  </div>
  <div style="display: grid; font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;">
    <span><strong>Muchas gracias.</strong></span>
    <span>Tiims</span>
  </div>
</div>
    `;
}
