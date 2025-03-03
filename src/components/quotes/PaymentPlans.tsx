"use client"

import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Calendar, DollarSign, Clock, CreditCard } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"

interface PaymentPlanProps {
  productId: number
  price: number
  marca: string
  modelo: string
  onSavePlan: (plan: {
    product_id: number
    months: number
    weekly_payment: number
    monthly_payment: number
    total_cost: number
    monthlyPayment: number
  }) => void
}

const PaymentPlan: React.FC<PaymentPlanProps> = ({ productId, price, marca, modelo, onSavePlan }) => {
  const [selectedMonths, setSelectedMonths] = useState<number | null>(null)
  const [paymentDetails, setPaymentDetails] = useState({
    weekly: 200,
    monthly: 0,
    total: 0,
  })
  const [taxPercentage, setTaxPercentage] = useState<number>(0)

  const calculatePaymentPlan = (months: number) => {
    const totalCost = price * (1 + taxPercentage / 100)
    const monthlyPayment = totalCost / months
    const weeklyPayment = monthlyPayment / 4 // Aproximado a 4 semanas por mes

    setPaymentDetails({
      weekly: weeklyPayment,
      monthly: monthlyPayment,
      total: totalCost,
    })
    setSelectedMonths(months)
  }

  const savePaymentPlan = () => {
    if (!selectedMonths) {
      alert("Seleccione un plazo de meses antes de guardar el plan.")
      return
    }

    // En lugar de guardar en la base de datos, solo pasamos los datos al componente padre
    onSavePlan({
      product_id: productId,
      months: selectedMonths,
      weekly_payment: paymentDetails.weekly,
      monthly_payment: paymentDetails.monthly,
      total_cost: paymentDetails.total,
      monthlyPayment: paymentDetails.monthly, // Para mantener compatibilidad con el código existente
    })
  }

  const planOptions = [
    { months: 3, label: "3 Meses", description: "Plan a corto plazo" },
    { months: 6, label: "6 Meses", description: "Plan a mediano plazo" },
    { months: 9, label: "9 Meses", description: "Plan a largo plazo" },
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Planes de Financiamiento
        </CardTitle>
        <CardDescription>Seleccione el plazo que mejor se adapte a sus necesidades</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planOptions.map((plan) => (
            <button key={plan.months} className="w-full text-left" onClick={() => calculatePaymentPlan(plan.months)}>
              <Card
                className={`transition-all hover:shadow-md ${
                  selectedMonths === plan.months ? "border-primary ring-2 ring-primary" : ""
                }`}
              >
                <CardHeader className="p-4">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {plan.label}
                  </CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
              </Card>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label htmlFor="taxPercentage" className="block text-sm font-medium text-gray-700">
            Porcentaje de impuesto
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <Input
              type="number"
              name="taxPercentage"
              id="taxPercentage"
              className="block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
              placeholder="12"
              min={0}
              value={taxPercentage}
              onChange={(e) => {
                const value = Number.parseFloat(e.target.value) || 0
                setTaxPercentage(value)
                if (selectedMonths) {
                  calculatePaymentPlan(selectedMonths)
                }
              }}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">%</span>
            </div>
          </div>
        </div>

        {selectedMonths && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Resumen del Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Concepto</TableHead>
                    <TableHead className="text-right">Monto</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Dispositivo</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">
                        {marca} - {modelo}
                      </Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Precio Base</TableCell>
                    <TableCell className="text-right font-medium">${price.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Plazo</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="secondary">{selectedMonths} meses</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pago Semanal</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        step="0.01"
                        value={paymentDetails.weekly.toFixed(2)} // Mostrar siempre con dos decimales
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          setPaymentDetails({ ...paymentDetails, weekly: value })
                        }}
                        className="text-right"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Pago Mensual</TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        step="0.01"
                        value={paymentDetails.monthly.toFixed(2)} // Mostrar siempre con dos decimales
                        onChange={(e) => {
                          const value = Number.parseFloat(e.target.value) || 0
                          setPaymentDetails({ ...paymentDetails, monthly: value })
                        }}
                        className="text-right"
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Costo Total (Impuesto incluido)</TableCell>
                    <TableCell className="text-right font-bold">
                      ${paymentDetails.total.toFixed(2)} (Impuesto: {taxPercentage}%)
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </CardContent>

      {selectedMonths && (
        <CardFooter>
          <Button onClick={savePaymentPlan} className="w-full" size="lg">
            <DollarSign className="h-4 w-4 mr-2" />
            Seleccionar Plan
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}

export default PaymentPlan

