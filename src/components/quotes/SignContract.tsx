"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Loader2, DollarSign, FileText, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Progress } from "../../components/ui/progress"

interface PaymentPlan {
  id: number
  device_id: number | null
  created_at: string
  months: number | null
  weekly_payment: number | null
  monthly_payment: number | null
  total_cost: number | null
}

interface ContractSummary {
  payment_plan_id: number
  device_id: number | null
  down_payment: number | null
  next_payment_date: string | null
  next_payment_amount: number | null
  payment_progress: number | null
  status: string
  nombre_cliente: string
}

interface SignContractProps {
  deviceId: number
  monthlyPayment: number
  onContractSigned: () => void
  marca: string
  modelo: string
}

const SignContract: React.FC<SignContractProps> = ({ deviceId, monthlyPayment, onContractSigned, marca, modelo }) => {
  const [latestPaymentPlan, setLatestPaymentPlan] = useState<PaymentPlan | null>(null)
  const [downPayment, setDownPayment] = useState<number | null>(null)
  const [contractSummary, setContractSummary] = useState<ContractSummary | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [nombreCliente, setNombreCliente] = useState("")

  useEffect(() => {
    const fetchLatestPaymentPlan = async () => {
      try {
        const paymentPlansResponse = await axios.get<PaymentPlan[]>("/payment-plans")
        const paymentPlans = paymentPlansResponse.data

        if (paymentPlans.length > 0) {
          const latestPlan = paymentPlans[paymentPlans.length - 1]
          setLatestPaymentPlan(latestPlan)
          console.log("Payment Plan ID:", latestPlan.id)
          console.log("Device ID:", latestPlan.device_id)
        }
      } catch (error) {
        console.error("Error fetching payment plans:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestPaymentPlan()
  }, [])

  const handleGenerateSummary = () => {
    if (!latestPaymentPlan || !downPayment || !nombreCliente) {
      console.error("Missing required information to generate contract summary.")
      return
    }

    const nextPaymentDate = new Date()
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)

    const paymentProgress =
      latestPaymentPlan.total_cost && downPayment ? (downPayment / latestPaymentPlan.total_cost) * 100 : 0

    const summary: ContractSummary = {
      payment_plan_id: latestPaymentPlan.id,
      device_id: latestPaymentPlan.device_id,
      down_payment: downPayment,
      next_payment_date: nextPaymentDate.toISOString(),
      next_payment_amount: latestPaymentPlan.monthly_payment,
      payment_progress: paymentProgress,
      status: "ACTIVE",
      nombre_cliente: nombreCliente,
    }

    setContractSummary(summary)
  }

  const handleCreateContract = async () => {
    try {
      await axios.post("/contracts", contractSummary)
      alert("Contrato creado exitosamente")
      onContractSigned()
    } catch (error) {
      console.error("Error creando contrato:", error)
    }
  }

  if (isLoading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Planes de Pago y Contratos</CardTitle>
        <CardDescription>Genere y confirme su contrato de financiamiento</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {latestPaymentPlan ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Último Plan de Pago</h3>
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Dispositivo</TableCell>
                    <TableCell>
                      {marca} - {modelo}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Costo Total</TableCell>
                    <TableCell>${latestPaymentPlan.total_cost?.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nombreCliente">Nombre del Cliente</Label>
              <Input
                id="nombreCliente"
                type="text"
                value={nombreCliente}
                onChange={(e) => setNombreCliente(e.target.value)}
                placeholder="Ingrese el nombre del cliente"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="downPayment">Depósito Inicial</Label>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <Input
                  id="downPayment"
                  type="number"
                  value={downPayment || ""}
                  onChange={(e) => setDownPayment(Number(e.target.value))}
                  placeholder="Ingrese el depósito inicial"
                />
              </div>
            </div>
            <Button onClick={handleGenerateSummary} className="w-full">
              <FileText className="mr-2 h-4 w-4" />
              Generar Resumen del Carrito
            </Button>
          </>
        ) : (
          <p>No se encontró ningún plan de pago reciente.</p>
        )}
        {contractSummary && (
          <Card>
            <CardHeader>
              <CardTitle>Resumen del Carrito</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Nombre del Cliente</TableCell>
                    <TableCell>{contractSummary.nombre_cliente}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Dispositivo</TableCell>
                    <TableCell>
                      {marca} - {modelo}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Depósito Inicial</TableCell>
                    <TableCell>${contractSummary.down_payment?.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Fecha del Próximo Pago</TableCell>
                    <TableCell>{new Date(contractSummary.next_payment_date!).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Monto del Próximo Pago</TableCell>
                    <TableCell>${contractSummary.next_payment_amount?.toFixed(2)}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Progreso del Pago</span>
                  <span className="text-sm font-medium">{contractSummary.payment_progress?.toFixed(2)}%</span>
                </div>
                <Progress value={contractSummary.payment_progress || 0} className="w-full" />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCreateContract} className="w-full">
                <CheckCircle className="mr-2 h-4 w-4" />
                Confirmar y Crear Contrato
              </Button>
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default SignContract

