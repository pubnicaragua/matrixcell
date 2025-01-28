// PaymentPlan.tsx
import React, { useState } from "react";
import axios from "../../axiosConfig";

interface PaymentPlanProps {
    deviceId: number;
    price: number;
    onSavePlan: (plan: { id: number; monthlyPayment: number }) => void;
  }

const PaymentPlan: React.FC<PaymentPlanProps> = ({ deviceId, price, onSavePlan }) => {
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null);
  const [paymentDetails, setPaymentDetails] = useState({
    weekly: 0,
    monthly: 0,
    total: 0,
  });

  const calculatePaymentPlan = (months: number) => {
    const totalCost = price * 1.12; // Precio + IVA (12%)
    const monthlyPayment = totalCost / months;
    const weeklyPayment = monthlyPayment / 4; // Aproximado a 4 semanas por mes

    setPaymentDetails({
      weekly: weeklyPayment,
      monthly: monthlyPayment,
      total: totalCost,
    });
    setSelectedMonths(months);
  };

  const savePaymentPlan = async () => {
    if (!selectedMonths) {
      alert("Seleccione un plazo de meses antes de guardar el plan.");
      return;
    }

    try {
      const response = await axios.post("/payment-plans", {
        device_id: deviceId,
        months: selectedMonths,
        weekly_payment: paymentDetails.weekly,
        monthly_payment: paymentDetails.monthly,
        total_cost: paymentDetails.total,
      });

      alert("Plan de financiamiento guardado exitosamente.");
      onSavePlan({
        id: response.data.id,
        monthlyPayment: paymentDetails.monthly,
      });
    } catch (error) {
      console.error("Error al guardar el plan de financiamiento:", error);
    }
  };

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-2">Planes de Financiamiento</h2>
      <div className="mb-4">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => calculatePaymentPlan(3)}
        >
          3 Meses
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
          onClick={() => calculatePaymentPlan(6)}
        >
          6 Meses
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => calculatePaymentPlan(9)}
        >
          9 Meses
        </button>
      </div>

      {selectedMonths && (
        <div className="mb-4">
          <h3 className="font-bold">Resumen del Plan</h3>
          <p>Meses: {selectedMonths}</p>
          <p>Pago Semanal: ${paymentDetails.weekly.toFixed(2)}</p>
          <p>Pago Mensual: ${paymentDetails.monthly.toFixed(2)}</p>
          <p>Costo Total: ${paymentDetails.total.toFixed(2)}</p>
        </div>
      )}

      {selectedMonths && (
        <button
          className="bg-green-500 text-white px-4 py-2 rounded"
          onClick={savePaymentPlan}
        >
          Guardar Plan
        </button>
      )}
    </div>
  );
};

export default PaymentPlan;
