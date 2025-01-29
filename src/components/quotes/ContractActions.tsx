import type React from "react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Phone, Mail, Send } from "lucide-react"

interface ContactActionsProps {
  contractId: number
}

const ContactActions: React.FC<ContactActionsProps> = ({ contractId }) => {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")

  const handleWhatsApp = () => {
    if (phoneNumber) {
      const message = encodeURIComponent(`Hola, me gustaría hablar sobre el contrato ${contractId}.`)
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank")
    } else {
      alert("Por favor, ingrese un número de teléfono.")
    }
  }

  const handleEmail = () => {
    if (email) {
      const subject = encodeURIComponent(`Información sobre el contrato ${contractId}`)
      const body = encodeURIComponent(
        `Hola,\n\nMe gustaría obtener más información sobre el contrato ${contractId}.\n\nGracias.`,
      )
      window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    } else {
      alert("Por favor, ingrese una dirección de correo electrónico.")
    }
  }

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2">
        <Input
          type="tel"
          placeholder="Número de WhatsApp"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <Button onClick={handleWhatsApp} size="icon">
          <Phone className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Input type="email" placeholder="Correo electrónico" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button onClick={handleEmail} size="icon">
          <Mail className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ContactActions

