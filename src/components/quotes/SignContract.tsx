"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "../../axiosConfig"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Button } from "../../components/ui/button"
import { Label } from "../../components/ui/label"
import { Loader2, DollarSign, FileText, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableRow } from "../../components/ui/table"
import { Progress } from "../../components/ui/progress"

interface PaymentPlanData {
  product_id: number
  months: number
  weekly_payment: number
  monthly_payment: number
  total_cost: number
}

interface ContractSummary {
  payment_plan: PaymentPlanData
  product_id: number
  down_payment: number | null
  next_payment_date: string | null
  next_payment_amount: number | null
  payment_progress: number | null
  status: string
  nombre_cliente: string
}

interface SignContractProps {
  productId: number
  paymentPlanData: PaymentPlanData
  onContractSigned: () => void
  marca: string
  modelo: string
}

const SignContract: React.FC<SignContractProps> = ({ productId, paymentPlanData, onContractSigned, marca, modelo }) => {
  const [downPayment, setDownPayment] = useState<number | null>(null)
  const [contractSummary, setContractSummary] = useState<ContractSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [nombreCliente, setNombreCliente] = useState("")
  const [productInventory, setProductInventory] = useState<{ id: number; store_id: number; stock: number } | null>(null)
  const [imei, setImei] = useState<string>("")

  console.log(productInventory)

  // Obtener información del inventario para el producto seleccionado
  useEffect(() => {
    const fetchProductInventory = async () => {
      if (productId) {
        try {
          // Obtener el inventario del producto
          const response = await axios.get(`/inventories?product_id=${productId}`)
          if (response.data && response.data.length > 0) {
            // Tomamos el primer registro que coincida con el producto
            setProductInventory(response.data[0])
          }
        } catch (error) {
          console.error("Error al obtener información del inventario:", error)
        }
      }
    }

    fetchProductInventory()
  }, [productId])

  const handleGenerateSummary = () => {
    if (!paymentPlanData || !downPayment || !nombreCliente) {
      console.error("Missing required information to generate contract summary.")
      return
    }

    const nextPaymentDate = new Date()
    nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1)

    const paymentProgress =
      paymentPlanData.total_cost && downPayment ? (downPayment / paymentPlanData.total_cost) * 100 : 0

    const summary: ContractSummary = {
      payment_plan: paymentPlanData,
      product_id: productId,
      down_payment: downPayment,
      next_payment_date: nextPaymentDate.toISOString(),
      next_payment_amount: paymentPlanData.monthly_payment,
      payment_progress: paymentProgress,
      status: "ACTIVE",
      nombre_cliente: nombreCliente,
    }

    setContractSummary(summary)
  }

  const updateInventory = async () => {
    if (!productInventory) {
      console.error("No se encontró información del inventario para este producto")
      return false
    }

    try {
      // Calcular el nuevo stock (restando 1 unidad)
      const updatedStock = productInventory.stock - 1

      if (updatedStock < 0) {
        alert("No hay suficiente stock disponible para este producto.")
        return false
      }

      // Actualizar el inventario
      await axios.put(`/inventories/${productInventory.id}`, {
        product_id: productId,
        stock: updatedStock,
        store_id: productInventory.store_id,
        imei: imei, // Si se está utilizando IMEI
      })

      console.log(`Producto ${productId} actualizado en inventario. Nuevo stock:`, updatedStock)
      return true
    } catch (error) {
      console.error("Error al actualizar el inventario:", error)
      return false
    }
  }

  const handleCreateContract = async () => {
    if (!contractSummary) return

    setIsLoading(true)
    try {
      // Primero guardamos el plan de pago
      const paymentPlanResponse = await axios.post("/payment-plans", contractSummary.payment_plan)
      const paymentPlanId = paymentPlanResponse.data.id

      // Luego guardamos el contrato con el ID del plan de pago
      await axios.post("/contracts", {
        payment_plan_id: paymentPlanId,
        product_id: contractSummary.product_id,
        down_payment: contractSummary.down_payment,
        next_payment_date: contractSummary.next_payment_date,
        next_payment_amount: contractSummary.next_payment_amount,
        payment_progress: contractSummary.payment_progress,
        status: contractSummary.status,
        nombre_cliente: contractSummary.nombre_cliente,
      })

      // Actualizar el inventario después de crear el contrato
      const inventoryUpdated = await updateInventory()

      if (!inventoryUpdated) {
        alert("El contrato se creó pero hubo un problema al actualizar el inventario.")
      } else {
        alert("Contrato creado exitosamente y el inventario ha sido actualizado")
      }

      onContractSigned()
    } catch (error) {
      console.error("Error creando contrato:", error)
      alert("Error al crear el contrato. Por favor, intente de nuevo.")
    } finally {
      setIsLoading(false)
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
        {paymentPlanData ? (
          <>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Plan de Pago Seleccionado</h3>
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
                    <TableCell>${paymentPlanData.total_cost.toFixed(2)}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Plazo</TableCell>
                    <TableCell>{paymentPlanData.months} meses</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Pago Mensual</TableCell>
                    <TableCell>${paymentPlanData.monthly_payment.toFixed(2)}</TableCell>
                  </TableRow>
                  {productInventory && (
                    <TableRow>
                      <TableCell className="font-medium">Stock Disponible</TableCell>
                      <TableCell>{productInventory.stock} unidades</TableCell>
                    </TableRow>
                  )}
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
            {/* <div className="space-y-2">
              <Label htmlFor="imei">IMEI (opcional)</Label>
              <Input
                id="imei"
                type="text"
                value={imei}
                onChange={(e) => setImei(e.target.value)}
                placeholder="Ingrese el IMEI del dispositivo"
                maxLength={15}
              />
            </div> */}
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
          <p>No se ha seleccionado ningún plan de pago.</p>
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
              <Button
                onClick={handleCreateContract}
                className="w-full"
                disabled={isLoading || (productInventory?.stock ?? 0) <= 0}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Confirmar y Crear Contrato
                  </>
                )}
              </Button>
              {productInventory && productInventory.stock <= 0 && (
                <p className="text-red-500 text-sm mt-2">No hay stock disponible para este producto</p>
              )}
            </CardFooter>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default SignContract

