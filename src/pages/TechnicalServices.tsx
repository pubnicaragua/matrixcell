import React, { useState } from "react";
import TechnicalServices from "../components/technicalservices/Services";
import ServiceListPage from "../components/technicalservices/ServiceList";

const TechnicalServicesTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState("add-service");

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
      </div>

      {/* Contenido dinámico basado en el tab activo */}
      <div className="bg-white p-6 rounded-lg shadow">
        {activeTab === "add-service" && <TechnicalServices />}
        {activeTab === "service-list" && <ServiceListPage />}
      </div>
    </div>
  );
};

export default TechnicalServicesTabs;
