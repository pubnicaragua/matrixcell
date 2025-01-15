import { TechnicalService } from "../models/technicalServicemodel";
export const TechnicalServiceResource = {
    formatTechnicalService(technicalservice: TechnicalService) {
        return {
            id: technicalservice.id,
            client: technicalservice.client,
            service_type: technicalservice.service_type,
            description: technicalservice.description,
            status: technicalservice.status,
            cost: technicalservice.cost,
            store_id: technicalservice.store_id,
            product_id: technicalservice.product_id,
            quantity: technicalservice.quantity
        };
    },

    formatTechnicalServices(technicalservices: TechnicalService[]) {
        return technicalservices.map(technicalservice => TechnicalServiceResource.formatTechnicalService(technicalservice));
    }
};