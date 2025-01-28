// import { useState } from "react"
// import type { Dispositivo, TerminoPago } from "../../pages/types"
// import { Button } from "../../components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import axios from "../../axiosConfig"

// export function ModalTerminosPago({
//   dispositivo,
//   onCerrar,
//   onFirmarContrato,
// }: {
//   dispositivo: Dispositivo
//   onCerrar: () => void
//   onFirmarContrato: (termino: TerminoPago) => void
// }) {
//   const [plazo, setPlazo] = useState<number>(3)
//   const [loading, setLoading] = useState(false)
//   const [error, setError] = useState<string | null>(null)

//   const calcularPagos = () => {
//     const montoFinanciar = (dispositivo.precio || 0) - (termino.deposito || 0);
//     const pagoMensual = montoFinanciar / plazo;
//     const pagoSemanal = pagoMensual / 4;
  
//     return { pagoMensual, pagoSemanal };
//   };
  


//   const { pagoMensual, pagoSemanal } = calcularPagos()

//   const handleFirmarContrato = async () => {
//     setLoading(true)
//     setError(null)
//     try {
//       const response = await axios.post("/contracts", {
//         device_id: dispositivo.id,
//         months: plazo,
//         initial_amount: dispositivo.deposito,
//       })
//       const terminoPago: TerminoPago = {
//         id: response.data.id,
//         dispositivo,
//         plazo,
//         pagoMensual,
//         pagoSemanal,
//         costoTotal: dispositivo.precio,
//         fechaInicio: new Date(),
//         pagosPendientes: plazo,
//       }
//       onFirmarContrato(terminoPago)
//       onCerrar()
//     } catch (err) {
//       setError("Error al firmar el contrato. Por favor, intente de nuevo.")
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
//       <Card className="w-full max-w-md">
//         <CardHeader>
//           <CardTitle>Términos del Contrato</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <p>Marca: {dispositivo.marca}</p>
//           <p>Modelo: {dispositivo.modelo}</p>
//           <div className="my-4">
//             <label className="block mb-2">Plazo:</label>
//             <Select value={plazo.toString()} onValueChange={(value) => setPlazo(Number.parseInt(value))}>
//               <SelectTrigger>
//                 <SelectValue placeholder="Seleccione un plazo" />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="3">3 meses</SelectItem>
//                 <SelectItem value="6">6 meses</SelectItem>
//                 <SelectItem value="9">9 meses</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//           <p>Pago Mensual: ${pagoMensual.toFixed(2)}</p>
//           <p>Pago Semanal: ${pagoSemanal.toFixed(2)}</p>
//           <p>Costo Total: ${dispositivo.precio.toFixed(2)}</p>
//           {error && <p className="text-red-500 mt-2">{error}</p>}
//           <div className="flex justify-end space-x-2 mt-4">
//             <Button onClick={onCerrar} variant="outline">
//               Cancelar
//             </Button>
//             <Button onClick={handleFirmarContrato} disabled={loading}>
//               {loading ? "Procesando..." : "Firmar Contrato"}
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }

