import React, { useState, useEffect } from "react";
import axios from "../../axiosConfig";

interface SignContractProps {
  deviceId: number;
  monthlyPayment: number;
}

const SignContract: React.FC<SignContractProps> = ({
  deviceId,
  monthlyPayment,
}) => {
  const [downPayment, setDownPayment] = useState<number | "">("");
  const [nextPaymentDate, setNextPaymentDate] = useState<string | null>(null);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [paymentPlanId, setPaymentPlanId] = useState<number | null>(null);

  const calculateNextPaymentDate = () => {
    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + 1); // Sumar un mes
    return currentDate.toISOString().split("T")[0]; // Formato YYYY-MM-DD
  };

  const fetchLastPaymentPlan = async () => {
    try {
      const response = await axios.get("/payment-plans", {
        params: {
          device_id: deviceId,
        },
      });
  
      if (response.data && response.data.length > 0) {
        // Ordenar los planes por fecha de creación si el backend no los devuelve ordenados
        const sortedPlans = response.data.sort(
          (a: { created_at: string }, b: { created_at: string }) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
  
        const lastPlan = sortedPlans[0]; // Obtener el más reciente
        setPaymentPlanId(lastPlan.id);
      } else {
        alert("No se encontró ningún plan de pago para este dispositivo.");
      }
    } catch (error) {
      console.error("Error al obtener el último plan de pago:", error);
    }
  };
  

  const handleSignContract = async () => {
    if (!downPayment || downPayment < 0) {
      alert("Por favor, ingrese un depósito inicial válido.");
      return;
    }

    if (!paymentPlanId) {
      alert("No se encontró un plan de pago válido.");
      return;
    }

    const nextPayment = monthlyPayment - downPayment;
    const nextPaymentDate = calculateNextPaymentDate();

    try {
      await axios.post("/contracts", {
        device_id: deviceId,
        payment_plan_id: paymentPlanId, // Usa el ID del plan de pago obtenido
        down_payment: downPayment,
        next_payment_date: nextPaymentDate,
        next_payment_amount: nextPayment,
        payment_progress: 0,
        status: "activo",
      });

      alert("Contrato firmado exitosamente.");
      setIsContractSigned(true);
      setNextPaymentDate(nextPaymentDate);
    } catch (error) {
      console.error("Error al firmar el contrato:", error);
      alert("Hubo un error al firmar el contrato.");
    }
  };

  useEffect(() => {
    fetchLastPaymentPlan();
  }, [deviceId]);

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-4">Firmar Contrato</h2>
      {!isContractSigned ? (
        <div>
          <div className="mb-4">
            <label className="block font-bold mb-2" htmlFor="downPayment">
              Depósito Inicial ($):
            </label>
            <input
              type="number"
              id="downPayment"
              value={downPayment}
              onChange={(e) => setDownPayment(parseFloat(e.target.value))}
              className="border p-2 rounded w-full"
              placeholder="Ingrese el depósito inicial"
            />
          </div>

          <button
            onClick={handleSignContract}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Firmar Contrato
          </button>
        </div>
      ) : (
        <div className="p-4 bg-green-100 rounded">
          <h3 className="font-bold text-green-700">Contrato firmado exitosamente</h3>
          <p>Próxima Fecha de Pago: {nextPaymentDate}</p>
          <p>Monto del Próximo Pago: ${monthlyPayment.toFixed(2)}</p>
        </div>
      )}
    </div>
  );
};

export default SignContract;
