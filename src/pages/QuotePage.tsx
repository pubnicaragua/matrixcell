import React, { useState } from "react";
import DeviceSelector from "../components/quotes/FormularioDispositivo";
import PaymentPlan from "../components/quotes/PaymentPlans";
import SignContract from "../components/quotes/SignContract";

const QuotePage: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<{ id: number; price: number } | null>(null);
  const [selectedPaymentPlan, setSelectedPaymentPlan] = useState<{
    id: number;
    monthlyPayment: number;
  } | null>(null);

  const handleDeviceSelection = (device: { id: number; price: number }) => {
    setSelectedDevice(device);
    setSelectedPaymentPlan(null); // Resetea el plan de pago al cambiar de dispositivo
  };

  const handlePaymentPlanSelection = (plan: { id: number; monthlyPayment: number }) => {
    console.log("Plan seleccionado:", plan); // Debug: Verifica que el plan tiene ID
    setSelectedPaymentPlan(plan);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Selección de Dispositivo */}
      <DeviceSelector onDeviceSelect={handleDeviceSelection} />

      {/* Selección de Plan de Pago */}
      {selectedDevice && !selectedPaymentPlan && (
        <div className="mt-4">
          <PaymentPlan
            deviceId={selectedDevice.id}
            price={selectedDevice.price}
            onSavePlan={handlePaymentPlanSelection} // Pasa la función para guardar el plan
          />
        </div>
      )}

      {/* Firma de Contrato */}
      {selectedDevice && selectedPaymentPlan && (
        <div className="mt-4">
          <SignContract
            deviceId={selectedDevice.id}
            monthlyPayment={selectedPaymentPlan.monthlyPayment}
          />
        </div>
      )}
    </div>
  );
};

export default QuotePage;
