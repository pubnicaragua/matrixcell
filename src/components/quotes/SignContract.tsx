import React, { useEffect, useState } from "react";
import axios from "../../axiosConfig";

interface PaymentPlan {
  id: number;
  device_id: number | null;
  created_at: string;
  months: number | null;
  weekly_payment: 100 ;
  monthly_payment: number | null;
  total_cost: number | null;
}

interface Contract {
  id: number;
  payment_plan_id: number;
  device_id: number | null;
  down_payment: number | null;
  next_payment_date: string | null;
  next_payment_amount: number | null;
  payment_progress: number | null;
  status: string | null;
}

const PaymentPlanContracts = () => {
  const [latestPaymentPlan, setLatestPaymentPlan] = useState<PaymentPlan | null>(null);
  const [contractResponse, setContractResponse] = useState<Contract | null>(null);
  const [downPayment, setDownPayment] = useState<number | null>(null);

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

  const handleCreateContract = async () => {
    if (!latestPaymentPlan) {
      console.error("No payment plan available to create a contract.");
      return;
    }

    try {
      // Calculate next payment date (current month + 1)
      const nextPaymentDate = new Date();
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      // Create contract
      const response = await axios.post<Contract>("/contracts", {
        payment_plan_id: latestPaymentPlan.id,
        device_id: latestPaymentPlan.device_id,
        down_payment: downPayment,
        next_payment_date: nextPaymentDate.toISOString(),
        next_payment_amount: latestPaymentPlan.monthly_payment,
        payment_progress: 0,
        status: "",
      });

      setContractResponse(response.data);
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
            onClick={handleCreateContract}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Crear Contrato
          </button>
        </div>
      ) : (
        <p>Loading payment plan...</p>
      )}
      {contractResponse ? (
        <div className="mt-4">
          <h3>Contrato Creado</h3>
          <p>ID del Contrato: {contractResponse.id}</p>
          <p>Fecha del Próximo Pago: {contractResponse.next_payment_date}</p>
          <p>Monto del Próximo Pago: {contractResponse.next_payment_amount}</p>
        </div>
      ) : (
        <p>Loading contract...</p>
      )}
    </div>
  );
};

export default PaymentPlanContracts;
