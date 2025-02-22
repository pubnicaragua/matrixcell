"use client"

import { useState, useEffect } from "react"
import api from "../axiosConfig"
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js"
import { PendingInvoicesChart } from "../components/dashboard/pending-invoices-chart"
import { InvoiceStatusChart } from "../components/dashboard/invoice-status-chart"
import { DelinquencyChart } from "../components/dashboard/delinquency-chart"
import { BlockedDevices } from "../components/dashboard/blocked-devices"
import { ActivityTable } from "../components/dashboard/activity-table"
import { QuickActions } from "../components/dashboard/quick-actions"
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface Operation {
  amount_due: number
  due_date: string
  days_overdue: number
}

interface Device {
  id: number
  imei: string
  status: string
}

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [barChartData, setBarChartData] = useState<any>(null)
  const [pieChartData, setPieChartData] = useState<any>(null)
  const [morosityChartData, setMorosityChartData] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])

  const activities = [
    { id: 1, action: "Bloqueo", device: "Dispositivo 1", date: "2024-12-20" },
    { id: 2, action: "Pago", device: "Cliente 2", date: "2024-12-22" },
    { id: 3, action: "Desbloqueo", device: "Dispositivo 3", date: "2024-12-23" },
    { id: 4, action: "Cambio de pantalla", device: "Dispositivo 4", date: "2024-12-24" },
    { id: 5, action: "Mantenimiento", device: "Dispositivo 5", date: "2024-12-25" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [operationsResponse, devicesResponse] = await Promise.all([api.get("/operations"), api.get("/devices")])

        const operations: Operation[] = operationsResponse.data
        const devices: Device[] = devicesResponse.data
        setDevices(devices)

        // Process data for charts
        processChartData(operations)
      } catch (err: any) {
        setError(err.message || "Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const processChartData = (operations: Operation[]) => {
    // Pending operations by month (using amount_due and due_date)
    const pendingOperations = operations.filter((operation) => operation.amount_due > 0)
    const operationsByMonth = Array(12).fill(0)

    pendingOperations.forEach((operation) => {
      const month = new Date(operation.due_date).getMonth()
      operationsByMonth[month] += operation.amount_due
    })

    setBarChartData({
      labels: [
        "Enero",
        "Febrero",
        "Marzo",
        "Abril",
        "Mayo",
        "Junio",
        "Julio",
        "Agosto",
        "Septiembre",
        "Octubre",
        "Noviembre",
        "Diciembre",
      ],
      datasets: [
        {
          label: "Monto por Vencer ($)",
          data: operationsByMonth,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    })

    // Operation status (using amount_due)
    const paidCount = operations.filter((operation) => operation.amount_due === 0).length
    const pendingCount = operations.filter((operation) => operation.amount_due > 0).length

    setPieChartData({
      labels: ["Pagadas", "Pendientes"],
      datasets: [
        {
          data: [paidCount, pendingCount],
          backgroundColor: ["#4caf50", "#f44336"],
          hoverBackgroundColor: ["#45a049", "#e53935"],
        },
      ],
    })

    // Delinquency (using days_overdue in ranges of 100 days)
    const morosityBuckets = Array(6).fill(0) // 0-100, 101-200, 201-300, 301-400, 401-500, >500

    operations.forEach((operation) => {
      if (operation.days_overdue <= 0) return // Skip if not overdue

      const bucket = Math.min(Math.floor(operation.days_overdue / 100), 5)
      morosityBuckets[bucket]++
    })

    setMorosityChartData({
      labels: ["0-100 días", "101-200 días", "201-300 días", "301-400 días", "401-500 días", ">500 días"],
      datasets: [
        {
          label: "Operaciones por Días de Retraso",
          data: morosityBuckets,
          backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF", "#FF9F40"],
        },
      ],
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <Skeleton className="h-8 w-48 mx-auto mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[400px] w-full" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Card className="bg-destructive/10">
          <CardContent className="p-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>
      <p className="text-center text-blue-600">
        <a href="/apk">Descarga nuestra app</a>
      </p>

      {/* QR Code with proper sizing and aspect ratio */}
      <Card className="w-full max-w-xs mx-auto">
        <CardContent className="p-6">
          <div className="relative aspect-square">
            <img
              src="/assets/newqr.jpg"
              alt="QR Code"
              className="absolute inset-0 w-full h-full object-contain rounded-lg"
            />
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PendingInvoicesChart data={barChartData} />
        <InvoiceStatusChart data={pieChartData} />
        <BlockedDevices devices={devices} />
        <DelinquencyChart data={morosityChartData} />
      </div>

      {/* Activity Table */}
      <ActivityTable activities={activities} />

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}

export default Dashboard

