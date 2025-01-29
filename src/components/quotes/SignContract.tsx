import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";

interface PaymentPlan {
  id: number;
  device_id: number | null;
  created_at: string;
  months: number | null;
  weekly_payment: number | null;
  monthly_payment: number | null;
  total_cost: number | null;
}

interface ContractSummary {
  payment_plan_id: number;
  device_id: number | null;
  down_payment: number | null;
  next_payment_date: string | null;
  next_payment_amount: number | null;
  payment_progress: number | null;
  status: string;
}

const PaymentPlanContracts = () => {
  const [latestPaymentPlan, setLatestPaymentPlan] = useState<PaymentPlan | null>(null);
  const [downPayment, setDownPayment] = useState<number | null>(null);
  const [contractSummary, setContractSummary] = useState<ContractSummary | null>(null);

  useEffect(() => {
    // Fetch the most recent payment plan
    const fetchLatestPaymentPlan = async () => {
      try {
        const paymentPlansResponse = await axios.get<PaymentPlan[]>("/payment-plans");
        const paymentPlans = paymentPlansResponse.data;

        if (paymentPlans.length > 0) {
          const latestPlan = paymentPlans[paymentPlans.length - 1]; // Get the most recent record
          setLatestPaymentPlan(latestPlan);
        }
      } catch (error) {
        console.error("Error fetching payment plans:", error);
      }
    };

    fetchLatestPaymentPlan();
  }, []);

  const handleGenerateSummary = () => {
    if (!latestPaymentPlan || !downPayment) {
      console.error("Missing required information to generate contract summary.");
      return;
    }

    // Calculate next payment date (current month + 1)
    const nextPaymentDate = new Date();
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

    // Calculate payment progress
    const paymentProgress =
      latestPaymentPlan.total_cost && downPayment
        ? (downPayment / latestPaymentPlan.total_cost) * 100
        : 0;

    // Generate contract summary
    const summary: ContractSummary = {
      payment_plan_id: latestPaymentPlan.id,
      device_id: latestPaymentPlan.device_id,
      down_payment: downPayment,
      next_payment_date: nextPaymentDate.toISOString(),
      next_payment_amount: latestPaymentPlan.monthly_payment,
      payment_progress: paymentProgress,
      status: "ACTIVE",
    };

    setContractSummary(summary);
  };

  const handleCreateContract = async () => {
    if (!contractSummary) {
      console.error("No contract summary available to create a contract.");
      return;
    }

    try {
      const response = await axios.post("/contracts", contractSummary);
      alert("Contrato creado exitosamente");
    } catch (error) {
      console.error("Error creating contract:", error);
    }
  };

  return (
    <div>
      <h1>Payment Plans & Contracts</h1>
      {latestPaymentPlan ? (
        <div>
          <p>
            <strong>Latest Payment Plan:</strong>
          </p>
          <p>ID: {latestPaymentPlan.id}</p>
          <p>Device ID: {latestPaymentPlan.device_id}</p>
          <div>
            <label htmlFor="downPayment">Depósito Inicial:</label>
            <input
              id="downPayment"
              type="number"
              value={downPayment || ""}
              onChange={(e) => setDownPayment(Number(e.target.value))}
              className="border rounded p-2 ml-2"
              placeholder="Ingrese el depósito inicial"
            />
          </div>
          <button
            onClick={handleGenerateSummary}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Generar Resumen del Contrato
          </button>
        </div>
      ) : (
        <p>Loading payment plan...</p>
      )}
      {contractSummary && (
        <div className="mt-4">
          <h3>Resumen del Contrato</h3>
          <p>ID del Plan de Pago: {contractSummary.payment_plan_id}</p>
          <p>ID del Dispositivo: {contractSummary.device_id}</p>
          <p>Depósito Inicial: {contractSummary.down_payment}</p>
          <p>Fecha del Próximo Pago: {contractSummary.next_payment_date}</p>
          <p>Monto del Próximo Pago: {contractSummary.next_payment_amount}</p>
          {/* <p>Progreso del Pago: {contractSummary.payment_progress.toFixed(2)}%</p> */}
          <button
            onClick={handleCreateContract}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Confirmar y Crear Contrato
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentPlanContracts;
