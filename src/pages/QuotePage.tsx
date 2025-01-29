"use client"

import type React from "react"
import { useState } from "react"
import DeviceSelector from "../components/quotes/FormularioDispositivo"
import PaymentPlan from "../components/quotes/PaymentPlans"
import SignContract from "../components/quotes/SignContract"
import ContractList from "../components/quotes/ContractList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Separator } from "../components/ui/separator"
import { Check, ChevronRight } from "lucide-react"

const steps = [
  { id: "device-list", title: "Seleccionar Dispositivo" },
  { id: "payment-plan", title: "Planes de Pago" },
  { id: "sign-contract", title: "Firmar Contrato" },
]

const QuoteClientPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("create-quote")
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedDevice, setSelectedDevice] = useState<{
    id: number
    price: number
    marca: string
    modelo: string
  } | null>(null)
  const [paymentPlan, setPaymentPlan] = useState<{ id: number; monthlyPayment: number } | null>(null)

  const handleDeviceSelect = (device: { id: number; price: number; marca: string; modelo: string }) => {
    setSelectedDevice(device)
    setCurrentStep(1)
  }

  const handleSavePlan = (plan: { id: number; monthlyPayment: number }) => {
    setPaymentPlan(plan)
    setCurrentStep(2)
  }

  const handleContractSigned = () => {
    setCurrentStep(0)
    setSelectedDevice(null)
    setPaymentPlan(null)
    setActiveTab("contract-list")
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <DeviceSelector onDeviceSelect={handleDeviceSelect} />
      case 1:
        return (
          selectedDevice && (
            <PaymentPlan
              deviceId={selectedDevice.id}
              price={selectedDevice.price}
              marca={selectedDevice.marca}
              modelo={selectedDevice.modelo}
              onSavePlan={handleSavePlan}
            />
          )
        )
      case 2:
        return (
          paymentPlan &&
          selectedDevice && (
            <SignContract
              deviceId={selectedDevice.id}
              monthlyPayment={paymentPlan.monthlyPayment}
              onContractSigned={handleContractSigned}
            />
          )
        )
      default:
        return <p>Paso no válido</p>
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Cotizador de Financiamiento</CardTitle>
          <CardDescription>Cree una nueva cotización o vea los contratos existentes</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create-quote">Crear Cotización</TabsTrigger>
              <TabsTrigger value="contract-list">Lista de Contratos</TabsTrigger>
            </TabsList>
            <TabsContent value="create-quote">
              <div className="mb-8">
                <ol className="flex items-center w-full">
                  {steps.map((step, index) => (
                    <li key={step.id} className="flex w-full items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 ${
                          index <= currentStep ? "bg-blue-100" : "bg-gray-100"
                        }`}
                      >
                        {index < currentStep ? (
                          <Check className="w-5 h-5 text-blue-600" />
                        ) : (
                          <span className={`text-sm ${index === currentStep ? "text-blue-600" : "text-gray-500"}`}>
                            {index + 1}
                          </span>
                        )}
                      </div>
                      <span className={`ml-2 text-sm ${index <= currentStep ? "text-blue-600" : "text-gray-500"}`}>
                        {step.title}
                      </span>
                      {index < steps.length - 1 && <ChevronRight className="w-5 h-5 mx-2" />}
                    </li>
                  ))}
                </ol>
              </div>

              <Separator className="my-6" />

              {renderStepContent()}

              <Separator className="my-6" />

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(0, prev - 1))}
                  disabled={currentStep === 0}
                >
                  Anterior
                </Button>
                <Button
                  onClick={() => setCurrentStep((prev) => Math.min(steps.length - 1, prev + 1))}
                  disabled={
                    currentStep === steps.length - 1 ||
                    (currentStep === 0 && !selectedDevice) ||
                    (currentStep === 1 && !paymentPlan)
                  }
                >
                  {currentStep === steps.length - 1 ? "Finalizar" : "Siguiente"}
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="contract-list">
              <ContractList />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default QuoteClientPage

