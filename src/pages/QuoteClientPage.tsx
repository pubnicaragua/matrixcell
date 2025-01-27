import React, { useState } from "react";
import axios from "axios";


interface Device {
  brand: string;
  model: string;
  price: number;
  downPayment: number;
}


interface PaymentPlan {
  months: number;
  weeklyPayment: number;
  monthlyPayment: number;
  totalCost: number;
}


const QuoteClientPage: React.FC = () => {
  const [device, setDevice] = useState<Device>({
    brand: "",
    model: "",
    price: 0,
    downPayment: 0,
  });


  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState<number>(0);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>("2025-02-01");
  const [nextPaymentAmount, setNextPaymentAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
 
  const calculatePaymentPlans = async () => {
    if (device.price <= 0 || device.downPayment < 0) {
      setErrorMessage("Por favor, ingrese valores válidos para el precio y depósito.");
      return;
    }


    try {
      const response = await axios.post("/api/payment-plans", {
        price: device.price,
        downPayment: device.downPayment,
      });


      setPaymentPlans(response.data);
      setErrorMessage(""); // Limpiar cualquier mensaje de error
    } catch (error) {
      console.error("Error al calcular términos de pago:", error);
      setErrorMessage("Hubo un problema al calcular los planes. Inténtalo nuevamente.");
    }
  };


  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cotizador de Financiamiento</h1>


      {/* Formulario de Entrada */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Detalles del Dispositivo</h2>


        <label className="block mb-4">
          <span className="text-gray-700">Marca del Equipo:</span>
          <input
            type="text"
            value={device.brand}
            onChange={(e) => setDevice({ ...device, brand: e.target.value })}
            className="block w-full p-2 border rounded"
            placeholder="Ej: Samsung"
          />
        </label>


        <label className="block mb-4">
          <span className="text-gray-700">Modelo del Equipo:</span>
          <input
            type="text"
            value={device.model}
            onChange={(e) => setDevice({ ...device, model: e.target.value })}
            className="block w-full p-2 border rounded"
            placeholder="Ej: Galaxy A03s"
          />
        </label>


        <label className="block mb-4">
          <span className="text-gray-700">Precio (IVA Incluido):</span>
          <input
            type="number"
            value={device.price}
            onChange={(e) =>
              setDevice({ ...device, price: Number(e.target.value) })
            }
            className="block w-full p-2 border rounded"
          />
        </label>


        <label className="block mb-4">
          <span className="text-gray-700">Depósito Inicial:</span>
          <input
            type="number"
            value={device.downPayment}
            onChange={(e) =>
              setDevice({ ...device, downPayment: Number(e.target.value) })
            }
            className="block w-full p-2 border rounded"
          />
        </label>


        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}


        <button
          onClick={calculatePaymentPlans}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Calcular Términos de Pago
        </button>
      </div>


      {/* Mostrar Términos de Pago */}
      {paymentPlans.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Términos de Pago</h2>


          {paymentPlans.map((plan, index) => (
            <div
              key={index}
              className={`p-4 border mb-4 rounded-lg ${
                selectedPlan === plan ? "bg-green-100" : "bg-gray-100"
              }`}
            >
              <p>
                <strong>Plazo:</strong> {plan.months} meses
              </p>
              <p>
                <strong>Pago Semanal:</strong> ${plan.weeklyPayment.toFixed(2)}
              </p>
              <p>
                <strong>Pago Mensual:</strong> ${plan.monthlyPayment.toFixed(2)}
              </p>
              <p>
                <strong>Costo Total:</strong> ${plan.totalCost.toFixed(2)}
              </p>
              <button
                onClick={() => setSelectedPlan(plan)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
              >
                Seleccionar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};


export default QuoteClientPage;
