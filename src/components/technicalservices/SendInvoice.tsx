// Componente SendOptions para enviar por correo o WhatsApp
import React, { useState } from "react";

const SendOptions: React.FC = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleSendEmail = () => {
    const mailtoLink = `mailto:${email}?subject=Consulta&body=Hola, por favor revisa esto.`;
    window.open(mailtoLink, "_blank");
  };

  const handleSendWhatsApp = () => {
    const whatsappLink = `https://wa.me/${phone}?text=Hola, por favor revisa esto.`;
    window.open(whatsappLink, "_blank");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Enviar Información</h2>

      {/* Formulario para correo electrónico */}
      <div className="mb-4">
        <label className="block text-gray-700 font-medium mb-2">Correo Electrónico</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="ejemplo@correo.com"
        />
        <button
          onClick={handleSendEmail}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Enviar por Correo
        </button>
      </div>

      {/* Formulario para número de WhatsApp */}
      <div>
        <label className="block text-gray-700 font-medium mb-2">Número de WhatsApp</label>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
          placeholder="+123456789"
        />
        <button
          onClick={handleSendWhatsApp}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Enviar por WhatsApp
        </button>
      </div>
    </div>
  );
};

export default SendOptions;
