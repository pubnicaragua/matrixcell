import React, { useState } from "react";


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


const QuotePage: React.FC = () => {
  const [device, setDevice] = useState<Device>({
    brand: "Samsung",
    model: "Galaxy A03 Core",
    price: 300,
    downPayment: 50,
  });


  const [paymentPlans, setPaymentPlans] = useState<PaymentPlan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PaymentPlan | null>(null);
  const [isContractSigned, setIsContractSigned] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState<number>(0);
  const [nextPaymentDate, setNextPaymentDate] = useState<string>("2025-02-01");
  const [nextPaymentAmount, setNextPaymentAmount] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");


  const simulatePaymentPlans = () => {
    const remainingAmount = device.price - device.downPayment;


    const plans: PaymentPlan[] = [
      {
        months: 3,
        weeklyPayment: +(remainingAmount / 13).toFixed(2),
        monthlyPayment: +(remainingAmount / 3).toFixed(2),
        totalCost: +(remainingAmount * 1.05).toFixed(2),
      },
      {
        months: 6,
        weeklyPayment: +(remainingAmount / 26).toFixed(2),
        monthlyPayment: +(remainingAmount / 6).toFixed(2),
        totalCost: +(remainingAmount * 1.10).toFixed(2),
      },
      {
        months: 9,
        weeklyPayment: +(remainingAmount / 39).toFixed(2),
        monthlyPayment: +(remainingAmount / 9).toFixed(2),
        totalCost: +(remainingAmount * 1.15).toFixed(2),
      },
    ];


    setPaymentPlans(plans);
    setErrorMessage("");
  };


  const signContract = () => {
    if (!selectedPlan) {
      setErrorMessage("Debes seleccionar un plan antes de firmar el contrato.");
      return;
    }


    setIsContractSigned(true);
    setNextPaymentDate("2025-02-15"); // Simulación: Fecha fija
    setNextPaymentAmount(selectedPlan.weeklyPayment); // Monto del próximo pago
    setPaymentProgress(30); // Progreso inicial simulado
  };
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Cotizador de Financiamiento</h1>


      {/* Detalles del Dispositivo */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Detalles del Equipo</h2>
        <p><strong>Marca:</strong> {device.brand}</p>
        <p><strong>Modelo:</strong> {device.model}</p>
        <p><strong>Precio con IVA:</strong> ${device.price}</p>
        <p><strong>Depósito:</strong> ${device.downPayment}</p>
        <button
          onClick={simulatePaymentPlans}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-4"
        >
          Generar Términos de Pago
        </button>
      </div>


      {/* Opciones de Términos de Pago */}
      {paymentPlans.length > 0 && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Opciones de Términos de Pago</h2>
          {paymentPlans.map((plan, index) => (
            <div
              key={index}
              className={`p-4 border mb-4 rounded-lg ${
                selectedPlan === plan ? "border-green-500" : "border-gray-300"
              }`}
            >
              <p><strong>Plan de pagos a {plan.months} meses</strong></p>
              <p>Pago semanal: ${plan.weeklyPayment}</p>
              <p>Pago mensual: ${plan.monthlyPayment}</p>
              <p>Costo total: ${plan.totalCost}</p>
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


      {/* Resumen del Carrito */}
      {selectedPlan && !isContractSigned && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Resumen del Carrito</h2>
          <p><strong>Marca del Equipo:</strong> {device.brand}</p>
          <p><strong>Modelo del Equipo:</strong> {device.model}</p>
          <p><strong>Plazo Seleccionado:</strong> {selectedPlan.months} meses</p>
          <p><strong>Pago Semanal:</strong> ${selectedPlan.weeklyPayment}</p>
          <p><strong>Pago Mensual:</strong> ${selectedPlan.monthlyPayment}</p>
          <p><strong>Costo Total:</strong> ${selectedPlan.totalCost}</p>
          <button
            onClick={signContract}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-4"
          >
            Click para firmar contrato
          </button>
        </div>
      )}


      {/* Progreso de Pagos */}
      {isContractSigned && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Progreso de Pagos</h2>
          <p><strong>Tiempo Restante:</strong> 3 días</p>
          <p><strong>Fecha del Próximo Pago:</strong> {nextPaymentDate}</p>
          <p><strong>Monto del Próximo Pago:</strong> ${nextPaymentAmount}</p>
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${paymentProgress}%` }}
            ></div>
          </div>
          <button
            onClick={() => alert("Pago registrado con éxito.")}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Realizar Pago
          </button>
        </div>
      )}
    </div>
  );
};


export default QuotePage;
