import { Device } from "../models/device.model";

export const DeviceResource = {
    formatDevice(device: Device) {
        return {
            id: device.id,
            imei: device.imei,
            status: device.status,
            owner: device.owner,
            store_id: device.store_id
        };
    },

    formatDevices(devices: Device[]) {
        return devices.map(device => DeviceResource.formatDevice(device));
    }
};