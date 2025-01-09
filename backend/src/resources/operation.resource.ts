import { Operation } from "../models/operation.model";

export const OperationResource = {
    formatOperation(operation: Operation) {
        return {
            id: operation.id,
            operation_number: operation.operation_number,
            operation_value: operation.operation_value,
            prox_due_date: operation.prox_due_date,
            due_date: operation.due_date,
            amount_due: operation.amount_due,
            amount_paid: operation.amount_paid,
            days_overdue: operation.days_overdue,   
            judicial_action: operation.judicial_action,
            updated_at: operation.updated_at,
            created_at: operation.created_at
        };
    },

    formatOperations(operations: Operation[]) {
        return operations.map(operation => OperationResource.formatOperation(operation));
    }
};