import { Device } from "../models/device.model";

export const DeviceResource = {
    formatDevice(device: Device) {
        return {
            id: device.id,
            imei: device.imei,
            status: device.status,
            owner: device.owner,
           /* brand: device.brand, 
            model: device.model, 
            price: device.price, */
            store_id: device.store_id,
            cliente: device.cliente,
            unlock_code: device.unlock_code,
            marca: device.marca,
            modelo: device.modelo,
            price: device.price,
        };
    },

    formatDevices(devices: Device[]) {
        return devices.map(device => DeviceResource.formatDevice(device));
    }
};
