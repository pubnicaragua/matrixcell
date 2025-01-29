import React, { useState } from "react";
import DeviceSelector from "../components/quotes/FormularioDispositivo";
import PaymentPlan from "../components/quotes/PaymentPlans";
import SignContract from "../components/quotes/SignContract";

const QuoteClientPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("device-list");
  const [selectedDevice, setSelectedDevice] = useState<{ id: number; price: number } | null>(null);
  const [paymentPlan, setPaymentPlan] = useState<{ id: number; monthlyPayment: number } | null>(null);

  const handleDeviceSelect = (device: { id: number; price: number }) => {
    setSelectedDevice(device);
    setActiveTab("payment-plan");
  };

  const handleSavePlan = (plan: { id: number; monthlyPayment: number }) => {
    setPaymentPlan(plan);
    setActiveTab("sign-contract");
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "device-list":
        return <DeviceSelector onDeviceSelect={handleDeviceSelect} />;
      case "payment-plan":
        return (
          selectedDevice && (
            <PaymentPlan
              deviceId={selectedDevice.id}
              price={selectedDevice.price}
              onSavePlan={handleSavePlan}
            />
          )
        );
      case "sign-contract":
        return (
          paymentPlan &&
          selectedDevice && (
            <SignContract
              // // deviceId={selectedDevice.id}
              // monthlyPayment={paymentPlan.monthlyPayment}
            />
          )
        );
      default:
        return <p>Seleccione una opción</p>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">Cotizador de Financiamiento</h1>
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("device-list")}
          className={`px-4 py-2 rounded ${
            activeTab === "device-list" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
        >
          Seleccionar Dispositivo
        </button>
        <button
          onClick={() => setActiveTab("payment-plan")}
          className={`px-4 py-2 rounded ${
            activeTab === "payment-plan" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          disabled={!selectedDevice}
        >
          Planes de Pago
        </button>
        <button
          onClick={() => setActiveTab("sign-contract")}
          className={`px-4 py-2 rounded ${
            activeTab === "sign-contract" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          disabled={!paymentPlan}
        >
          Firmar Contrato
        </button>
      </div>
      <div className="bg-white p-6 rounded shadow-md">{renderTabContent()}</div>
    </div>
  );
};

export default QuoteClientPage;
