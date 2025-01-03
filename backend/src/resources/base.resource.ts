export const BaseResource = {
    format<T>(entity: T): T {
        return entity; // En la implementación específica se pueden agregar campos adicionales o formateos específicos
    },

    formatMany<T>(entities: T[]): T[] {
        return entities.map(entity => BaseResource.format(entity));
    }
};