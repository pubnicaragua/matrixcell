"use client"

import type React from "react"
import { useEffect, useState } from "react"
import axios from "../../axiosConfig"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Loader2, Eye, FileText } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"
import * as XLSX from "xlsx"
import ContactActions from "./ContractActions"
import { Progress } from "../../components/ui/progress"
import PaymentProgressModal from "./PaymentProgressModal"
import PDFVoucher from "./PDFVoucher"

interface Contract {
  id: number
  device_id: number
  payment_plan_id: number
  down_payment: number | null
  next_payment_amount: number | null
  next_payment_date: string
  payment_progress: number | null
  status: string | null
  nombre_cliente: string | null
  devices: {
    marca: string
    modelo: string
    price: number
  }
  payment_plans: {
    weekly_payment: number | null
    monthly_payment: number | null
    total_cost: number | null
  }
}

const generatePDF = (contract: Contract) => {
  PDFVoucher.generate(contract)
}

const ContractList: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get<Contract[]>("/contracts")
        setContracts(response.data)
      } catch (error) {
        console.error("Error fetching contracts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchContracts()
  }, [])

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "ACTIVE":
        return <Badge variant="default">Activo</Badge>
      case "PENDING":
        return <Badge variant="secondary">Pendiente</Badge>
      case "COMPLETED":
        return <Badge variant="destructive">Completado</Badge>
      default:
        return <Badge variant="outline">N/A</Badge>
    }
  }

  const handleOpenModal = (contract: Contract) => {
    setSelectedContract(contract)
    setIsModalOpen(true)
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Lista de Contratos</CardTitle>
        <CardDescription>Visualiza y gestiona todos los contratos activos</CardDescription>
      </CardHeader>
      <CardContent>
        {contracts.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Dispositivo</TableHead>
                <TableHead>Pago Inicial</TableHead>
                <TableHead>Pago Semanal</TableHead>
                <TableHead>Pago Mensual</TableHead>
                <TableHead>Costo Total (+12%)</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  {/* Nueva columna para mostrar el cliente */}
                  <TableCell>
                    {contract.nombre_cliente ? (
                      <span>{contract.nombre_cliente}</span>
                    ) : (
                      <span className="text-muted-foreground">Cliente no asignado</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">{contract.devices.marca}</div>
                      <div className="text-sm text-muted-foreground">{contract.devices.modelo}</div>
                    </div>
                  </TableCell>
                  <TableCell>${contract.down_payment?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>${contract.payment_plans.weekly_payment?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>${contract.payment_plans.monthly_payment?.toFixed(2) || "N/A"}</TableCell>
                  <TableCell>
                    ${(contract.payment_plans.total_cost ? contract.payment_plans.total_cost : 0).toFixed(2)}
                  </TableCell>
                  <TableCell>{getStatusBadge(contract.status)}</TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(contract)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver Progreso
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => generatePDF(contract)}>
                          <FileText className="mr-2 h-4 w-4" />
                          Generar PDF
                        </Button>
                      </div>
                      <ContactActions contractId={contract.id} />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <p className="text-center py-4 text-muted-foreground">No hay contratos disponibles.</p>
        )}
      </CardContent>
      {selectedContract && (
        <PaymentProgressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} contract={selectedContract} />
      )}
    </Card>
  )
}

export default ContractList

