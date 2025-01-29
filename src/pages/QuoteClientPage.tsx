// import React, { useState } from "react";
// import DeviceSelector from "../components/quotes/FormularioDispositivo";
// import PaymentPlan from "../components/quotes/PaymentPlans";
// import SignContract from "../components/quotes/SignContract";
// import ContractList from "../components/quotes/ContractList";

// const QuoteClientPage: React.FC = () => {
//   const [activeTab, setActiveTab] = useState<string>("quote-process");
//   const [currentStep, setCurrentStep] = useState<number>(0);
//   const [selectedDevice, setSelectedDevice] = useState<{ id: number; price: number } | null>(null);
//   const [paymentPlan, setPaymentPlan] = useState<{ id: number; monthlyPayment: number } | null>(null);

//   const handleDeviceSelect = (device: { id: number; price: number }) => {
//     setSelectedDevice(device);
//     setCurrentStep(1);
//   };

//   const handleSavePlan = (plan: { id: number; monthlyPayment: number }) => {
//     setPaymentPlan(plan);
//     setCurrentStep(2);
//   };

//   const handleContractSigned = () => {
//     setCurrentStep(3);
//   };

//   const renderStepContent = () => {
//     switch (currentStep) {
//       case 0:
//         return <DeviceSelector onDeviceSelect={handleDeviceSelect} />;
//       case 1:
//         return (
//           selectedDevice && (
//             <PaymentPlan deviceId={selectedDevice.id} price={selectedDevice.price} onSavePlan={handleSavePlan} />
//           )
//         );
//       case 2:
//         return paymentPlan && selectedDevice && <SignContract onContractSigned={handleContractSigned} />;
//       case 3:
//         return <p className="text-center text-green-600">Contrato firmado exitosamente.</p>;
//       default:
//         return <p>Paso no válido</p>;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <h1 className="text-2xl font-bold mb-4">Cotizador de Financiamiento</h1>
//       <div className="flex space-x-4 mb-6">
//         <button
//           onClick={() => setActiveTab("quote-process")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "quote-process" ? "bg-blue-500 text-white" : "bg-gray-200"
//           }`}
//         >
//           Cotización
//         </button>
//         <button
//           onClick={() => setActiveTab("contract-list")}
//           className={`px-4 py-2 rounded ${
//             activeTab === "contract-list" ? "bg-blue-500 text-white" : "bg-gray-200"
//           }`}
//         >
//           Lista de Contratos
//         </button>
//       </div>

//       <div className="bg-white p-6 rounded shadow-md">
//         {activeTab === "quote-process" ? (
//           <div>
//             <div className="flex flex-col space-y-6">
//               {renderStepContent()}
//               <div className="flex justify-between mt-4">
//                 <button
//                   onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
//                   disabled={currentStep === 0}
//                   className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//                 >
//                   Anterior
//                 </button>
//                 <button
//                   onClick={() => setCurrentStep((prev) => Math.min(3, prev + 1))}
//                   disabled={
//                     (currentStep === 0 && !selectedDevice) ||
//                     (currentStep === 1 && !paymentPlan) ||
//                     currentStep === 3
//                   }
//                   className="px-4 py-2 bg-blue-500 text-white rounded"
//                 >
//                   {currentStep === 3 ? "Finalizar" : "Siguiente"}
//                 </button>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <ContractList />
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuoteClientPage;
