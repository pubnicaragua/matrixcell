import React, { useState } from 'react';

interface SendInvoiceFormProps {
  defaultEmail?: string;
}

const SendInvoiceForm: React.FC<SendInvoiceFormProps> = ({ defaultEmail }) => {
  const [email, setEmail] = useState(defaultEmail || '');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files ? event.target.files[0] : null;
    setFile(selectedFile);
  };

  const handleSendEmail = () => {
    if (!email) {
      alert('Por favor, ingresa un correo electrónico.');
      return;
    }

    // Generar el enlace `mailto:`
    const subject = encodeURIComponent('Factura Adjunta');
    const body = file
      ? encodeURIComponent(`Te adjunto la factura: ${file.name}`)
      : encodeURIComponent('Te adjunto la factura.');
    const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

    // Abrir el cliente de correo
    window.location.href = mailtoLink;
  };

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Enviar Factura por Correo</h2>
      <div className="mb-4">
        <label className="block mb-2">Correo Electrónico:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="ejemplo@correo.com"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-2">Adjuntar Factura:</label>
        <input
          type="file"
          onChange={handleFileChange}
          className="block w-full"
          accept=".pdf,.doc,.docx"
        />
      </div>
      <button
        onClick={handleSendEmail}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Enviar por Correo
      </button>
    </div>
  );
};

export default SendInvoiceForm;
