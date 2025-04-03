"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Mail, Search } from "lucide-react"
import SendEmailModal from "./SendEmailModal"
import type { Client, Operation } from "../../types"

interface EmailClientListProps {
    clients: Client[]
    operations: Operation[]
    stores: { id: number; name: string }[]
}

const EmailClientList: React.FC<EmailClientListProps> = ({ clients, operations, stores }) => {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedClient, setSelectedClient] = useState<Client | null>(null)
    const [selectedOperation, setSelectedOperation] = useState<Operation | null>(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [userRole, setUserRole] = useState<number>(0)
    const [userStore, setUserStore] = useState<number | null>(null)

    useEffect(() => {
        const perfil = localStorage.getItem("perfil")
        if (perfil) {
            const parsedPerfil = JSON.parse(perfil)
            setUserRole(parsedPerfil.rol_id || 0)
            setUserStore(parsedPerfil.store_id || null)
        }
    }, [])

    // Combinar clientes y operaciones para mostrar todos los datos necesarios
    const clientsWithOperations = useMemo(() => {
        return clients
            .filter((client) => !client.deleted) // Solo clientes no eliminados
            .map((client) => {
                const clientOperations = operations.filter((op) => op.client_id === client.id)
                return {
                    ...client,
                    operations: clientOperations,
                }
            })
            .filter((client) => {
                // Filtrar por tienda si no es admin
                if (userRole === 1) return true
                return client.store_id === userStore
            })
    }, [clients, operations, userRole, userStore])

    // Filtrar por término de búsqueda
    const filteredClients = useMemo(() => {
        return clientsWithOperations.filter((client) => {
            const searchLower = searchTerm.toLowerCase()

            // Buscar en datos del cliente
            if (
                client.name?.toLowerCase().includes(searchLower) ||
                client.identity_number?.toLowerCase().includes(searchLower)
            ) {
                return true
            }

            // Buscar en operaciones del cliente
            return client.operations.some((op) => op.operation_number?.toLowerCase().includes(searchLower))
        })
    }, [clientsWithOperations, searchTerm])

    const getStoreName = (storeId: number) => {
        const store = stores.find((store) => store.id === storeId)
        return store ? store.name : "Desconocido"
    }

    const handleSendEmail = (client: Client, operation: Operation) => {
        setSelectedClient(client)
        setSelectedOperation(operation)
        setIsModalOpen(true)
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Enviar Facturas por Correo</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                    <div className="relative flex-grow">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <Input
                            type="text"
                            placeholder="Buscar por nombre, cédula o número de operación..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Cliente</TableHead>
                                <TableHead>Cédula</TableHead>
                                <TableHead>Operación</TableHead>
                                <TableHead>Deuda</TableHead>
                                <TableHead>Valor por Vencer</TableHead>
                                <TableHead>Valor Vencido</TableHead>
                                <TableHead>Días Vencidos</TableHead>
                                <TableHead>Fecha Vencimiento</TableHead>
                                <TableHead>Próximo Vencimiento</TableHead>
                                <TableHead>Tienda</TableHead>
                                <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredClients.length > 0 ? (
                                filteredClients.flatMap((client) =>
                                    client.operations.map((operation) => (
                                        <TableRow key={`${client.id}-${operation.id}`}>
                                            <TableCell className="font-medium">{client.name}</TableCell>
                                            <TableCell>{client.identity_number}</TableCell>
                                            <TableCell>{operation.operation_number}</TableCell>
                                            <TableCell>${operation.operation_value.toFixed(2)}</TableCell>
                                            <TableCell>${operation.amount_due.toFixed(2)}</TableCell>
                                            <TableCell>${operation.amount_paid.toFixed(2)}</TableCell>
                                            <TableCell>{operation.days_overdue}</TableCell>
                                            <TableCell>{new Date(operation.due_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{new Date(operation.prox_due_date).toLocaleDateString()}</TableCell>
                                            <TableCell>{getStoreName(client.store_id)}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => handleSendEmail(client, operation)}
                                                    disabled={!client.email}
                                                    title={client.email ? "Enviar factura por correo" : "Cliente sin correo electrónico"}
                                                >
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    Enviar
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    )),
                                )
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={11} className="text-center py-4 text-gray-500">
                                        No se encontraron clientes con los criterios de búsqueda
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>

            {selectedClient && selectedOperation && (
                <SendEmailModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    client={selectedClient}
                    operation={selectedOperation}
                    storeName={getStoreName(selectedClient.store_id)}
                />
            )}
        </Card>
    )
}

export default EmailClientList

