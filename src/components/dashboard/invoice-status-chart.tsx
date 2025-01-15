'use client'

import { Pie } from 'react-chartjs-2'
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

interface InvoiceStatusChartProps {
  data: {
    labels: string[]
    datasets: Array<{
      data: number[]
      backgroundColor: string[]
      hoverBackgroundColor: string[]
    }>
  }
}

export function InvoiceStatusChart({ data }: InvoiceStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado de las Facturas</CardTitle>
      </CardHeader>
      <CardContent>
        {data ? (
          <Pie
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

