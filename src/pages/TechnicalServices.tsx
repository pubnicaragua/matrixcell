import React, { useState } from "react";
import TechnicalServices from "../components/technicalservices/Services";
import ServiceListPage from "../components/technicalservices/ServiceList";
import SendInvoice from "../components/technicalservices/SendInvoice";

const TechnicalServicesTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("add-service");
   const [selectedService, setSelectedService] = useState(null); // Estado para el servicio seleccionado

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl text-center text-blue-500 font-bold mb-6">
        Gestión de Servicios Técnicos
      </h1>

      {/* Botones para alternar tabs */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("add-service")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "add-service"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Agregar Servicio
        </button>
        <button
          onClick={() => setActiveTab("service-list")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "service-list"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Lista de Servicios
        </button>
        <button
          onClick={() => setActiveTab("send-invoice")}
          className={`px-4 py-2 rounded-lg ${
            activeTab === "send-invoice"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 hover:bg-gray-300"
          }`}
        >
          Enviar factura
        </button>
      </div>

      {/* Contenido dinámico basado en el tab activo */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "add-service" && <TechnicalServices />}
        {activeTab === "service-list" && <ServiceListPage />}
        {activeTab === "send-invoice" && <SendInvoice />}
      </div>
    </div>
  );
};

export default TechnicalServicesTabs;