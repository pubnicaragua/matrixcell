import { Store } from "../models/store.model";

export const StoreResource = {
    formatStore(store: Store) {
        return {
            id: store.id,
            name: store.name,
            address: store.address,
            phone: store.phone,
            active: store.active
        };
    },

    formatStores(stores: Store[]) {
        return stores.map(store => StoreResource.formatStore(store));
    }
};