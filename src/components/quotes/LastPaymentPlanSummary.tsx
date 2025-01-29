import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

interface LastPaymentPlanSummaryProps {
  onSignContract: (paymentPlan: { id: number; monthlyPayment: number }) => void;
}

const LastPaymentPlanSummary: React.FC<LastPaymentPlanSummaryProps> = ({
  onSignContract,
}) => {
  const [lastPaymentPlan, setLastPaymentPlan] = useState<{
    id: number;
    device_id: number;
    months: number;
    weekly_payment: number;
    monthly_payment: number;
    total_cost: number;
  } | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLastPaymentPlan = async () => {
      try {
        const response = await axios.get("/payment-plans", {
          params: {
            order: "created_at.desc",
            limit: 1,
          },
        });
        if (response.data && response.data.length > 0) {
          setLastPaymentPlan(response.data[0]);
        } else {
          alert("No se encontró ningún plan de pago guardado.");
        }
      } catch (error) {
        console.error("Error al obtener el último plan de pago:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastPaymentPlan();
  }, []);

  if (loading) {
    return <p>Cargando el último plan de pago...</p>;
  }

  if (!lastPaymentPlan) {
    return <p>No hay planes de pago para mostrar.</p>;
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-4">Resumen del Último Plan de Pago</h2>
      <p>ID del Plan: {lastPaymentPlan.id}</p>
      <p>ID del Dispositivo: {lastPaymentPlan.device_id}</p>
      <p>Meses: {lastPaymentPlan.months}</p>
      <p>Pago Semanal: ${lastPaymentPlan.weekly_payment.toFixed(2)}</p>
      <p>Pago Mensual: ${lastPaymentPlan.monthly_payment.toFixed(2)}</p>
      <p>Costo Total: ${lastPaymentPlan.total_cost.toFixed(2)}</p>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
        onClick={() =>
          onSignContract({
            id: lastPaymentPlan.id,
            monthlyPayment: lastPaymentPlan.monthly_payment,
          })
        }
      >
        Firmar Contrato
      </button>
    </div>
  );
};

export default LastPaymentPlanSummary;
