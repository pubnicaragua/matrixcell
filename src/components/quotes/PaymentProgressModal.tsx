import type React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../../components/ui/dialog"
import { Progress } from "../../components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { CalendarIcon, DollarSignIcon } from "lucide-react"

interface PaymentProgressModalProps {
  isOpen: boolean
  onClose: () => void
  contract: {
    id: number
    payment_progress: number | null
    next_payment_amount: number | null
    next_payment_date: string | null
    products: {
      article: string
      price: number
    }
    payment_plans: {
      total_cost: number | null
    }
  }
}

const PaymentProgressModal: React.FC<PaymentProgressModalProps> = ({ isOpen, onClose, contract }) => {
  const formattedNextPaymentDate = contract.next_payment_date
    ? new Date(contract.next_payment_date).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "No disponible"

  const paymentProgress = contract.payment_progress ?? 0
  const totalCost = contract.payment_plans.total_cost ?? 0
  const amountPaid = (paymentProgress / 100) * totalCost
  const remainingAmount = totalCost - amountPaid

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Progreso de Pago</DialogTitle>
          <DialogDescription>
            {contract.products.article} - Contrato #{contract.id}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Card>
            <CardHeader>
              <CardTitle>Progreso de Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Progreso</span>
                <span>{paymentProgress.toFixed(2)}%</span>
              </div>
              <Progress value={paymentProgress} className="w-full" />
              <div className="mt-2 text-sm text-muted-foreground">
                <div>Pagado: ${amountPaid.toFixed(2)}</div>
                <div>Restante: ${remainingAmount.toFixed(2)}</div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Próximo Pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span>{formattedNextPaymentDate}</span>
              </div>
              <div className="mt-2 flex items-center space-x-2">
                <DollarSignIcon className="h-4 w-4 text-muted-foreground" />
                <span>${contract.next_payment_amount?.toFixed(2) ?? "No disponible"}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PaymentProgressModal

