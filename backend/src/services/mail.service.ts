import nodemailer from 'nodemailer';

export async function enviarCorreoConPDFBase64(base64PDF: string, destinatario: string) {
  try {
    // Crear un transportador de nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Usa el servicio de correo que prefieras (Gmail, Outlook, etc.)
      auth: {
        user: 'henvisi1994@gmail.com', // Tu correo electrónico
        pass: 'sphtlbunutyrupbx', // Tu contraseña (o app password si usas Gmail)
      },
    });

    // Configuración del correo
    const mailOptions = {
      from: 'henvisi1994@gmail.com', // Correo remitente
      to: destinatario, // Correo destinatario
      subject: 'Reporte PDF Generado', // Asunto del correo
      text: 'Adjunto el reporte generado en formato PDF.', // Cuerpo del correo
      attachments: [
        {
          filename: 'reporte_ventas.pdf', // Nombre del archivo adjunto
          content: base64PDF, // Contenido base64 del archivo PDF
          encoding: 'base64', // Especificamos que el contenido es base64
        },
      ],
    };

    // Enviar el correo
    const info = await transporter.sendMail(mailOptions);

    console.log('Correo enviado exitosamente:', info.response);
  } catch (error) {
    console.error('Error al enviar el correo:', error);
  }
}
