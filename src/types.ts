// types.ts
interface ClientListProps {
  clients: Client[];
  setSelectedClient: (client: Client | null) => void;
  setActiveTab: (tab: string) => void; // Asegúrate de incluir esto
  fetchClientsAndOperations: () => Promise<void>;
}


export interface Client {
    id?: number;
    name: string;
    phone: string;
    address: string;
    city: string;
    identity_number: string;
    identity_type: string;
    due_date: string; //fecha de corte
    grant_date: string; //fecha de concesión
    debt_type: string; //tipo de deudor
    deadline: number; //plazo
  }
  
  export interface Operation {
    id?: number;
    operation_number: string;
    operation_value: number;
    due_date: string;
    prox_due_date: string;
    amount_due: number;
    amount_paid: number;
    days_overdue: number;
    cart_value: number;
    refinanced_debt: number;
    judicial_action: string;
    client_id: number;
    client?: { // Agrega esta propiedad opcional
        id: number;
        name: string;
        phone: string;
    };
}
