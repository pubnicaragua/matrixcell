import { Contract } from "../models/contract.model";

export const ContractResource = {
    formatResource(contract: Contract) {
        return {
            id: contract.id,
            created_at: contract.created_at,
            device_id: contract.device_id,
            payment_plan_id: contract.payment_plan_id,
            down_payment: contract.down_payment,
            next_payment_date: contract.next_payment_date,
            next_payment_amount: contract.next_payment_amount,
            payment_progress: contract.payment_progress,
            status: contract.status,
            nombre_cliente: contract.nombre_cliente,
        };
    },

    formatContracts(contracts: Contract[]) {
        return contracts.map(contract => ContractResource.formatResource(contract));
    }
};
