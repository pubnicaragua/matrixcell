'use client'

import { Bar } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface PendingInvoicesChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      label: string
      data: number[]
      backgroundColor: string
      borderColor: string
      borderWidth: number
    }>
  }
}

export function PendingInvoicesChart({ data }: PendingInvoicesChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Facturas Pendientes por Mes</CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'top' as const },
                title: { display: false }
              },
            }}
            height={300}
          />
        ) : (
          <p className="text-muted-foreground">No hay datos para mostrar.</p>
        )}
      </CardContent>
    </Card>
  )
}

