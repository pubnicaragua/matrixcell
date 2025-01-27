'use client'

import { useState, useEffect } from 'react'
import api from '../axiosConfig'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { PendingInvoicesChart } from '../components/dashboard/pending-invoices-chart'
import { InvoiceStatusChart } from '../components/dashboard/invoice-status-chart'
import { DelinquencyChart } from '../components/dashboard/delinquency-chart'
import { BlockedDevices } from '../components/dashboard/blocked-devices'
import { ActivityTable } from '../components/dashboard/activity-table'
import { QuickActions } from '../components/dashboard/quick-actions'
import { Card, CardContent } from "../components/ui/card"
import { Skeleton } from "../components/ui/skeleton"

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend)

interface Invoice {
  status: string
  created_at: string
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
    { id: 1, action: 'Bloqueo', device: 'Dispositivo 1', date: '2024-12-20' },
    { id: 2, action: 'Pago', device: 'Cliente 2', date: '2024-12-22' },
    { id: 3, action: 'Desbloqueo', device: 'Dispositivo 3', date: '2024-12-23' },
    { id: 4, action: 'Cambio de pantalla', device: 'Dispositivo 4', date: '2024-12-24' },
    { id: 5, action: 'Mantenimiento', device: 'Dispositivo 5', date: '2024-12-25' },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [invoicesResponse, devicesResponse] = await Promise.all([
          api.get('/invoices'),
          api.get('/devices'),
        ])
        
        const invoices: Invoice[] = invoicesResponse.data
        const devices: Device[] = devicesResponse.data
        setDevices(devices)

        // Process data for charts
        processChartData(invoices)
      } catch (err: any) {
        setError(err.message || 'Error fetching data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const processChartData = (invoices: Invoice[]) => {
    // Pending invoices by month
    const pendingInvoices = invoices.filter(invoice => invoice.status === 'Pendiente')
    const invoicesByMonth = Array(12).fill(0)
    pendingInvoices.forEach(invoice => {
      const month = new Date(invoice.created_at).getMonth()
      invoicesByMonth[month]++
    })

    setBarChartData({
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets: [{
        label: 'Facturas Pendientes',
        data: invoicesByMonth,
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      }],
    })

    // Invoice status
    const paidCount = invoices.filter(invoice => invoice.status === 'Pagada').length
    const pendingCount = invoices.filter(invoice => invoice.status === 'Pendiente').length

    setPieChartData({
      labels: ['Pagadas', 'Pendientes'],
      datasets: [{
        data: [paidCount, pendingCount],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverBackgroundColor: ['#45a049', '#e53935'],
      }],
    })

    // Delinquency
    const currentDate = new Date()
    const morosityBuckets = [0, 0, 0, 0]

    pendingInvoices.forEach(invoice => {
      const diffInDays = Math.floor(
        (currentDate.getTime() - new Date(invoice.created_at).getTime()) / (1000 * 60 * 60 * 24)
      )

      if (diffInDays <= 30) morosityBuckets[0]++
      else if (diffInDays <= 60) morosityBuckets[1]++
      else if (diffInDays <= 90) morosityBuckets[2]++
      else morosityBuckets[3]++
    })

    setMorosityChartData({
      labels: ['0-30 días', '31-60 días', '61-90 días', '>90 días'],
      datasets: [{
        label: 'Morosidad de Facturas',
        data: morosityBuckets,
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      }],
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
      <p className="text-center text-blue-600"><a href="/apk">Descarga nuestra app</a></p>

      {/* QR Code with proper sizing and aspect ratio */}
      <Card className="w-full max-w-xs mx-auto">
        <CardContent className="p-6">
          <div className="relative aspect-square">
            <img
              src="/assets/qrcode.jpg"
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

