import { DeviceLog } from "../models/deviceLog.model";

export const DeviceLogResource = {
    formatDeviceLog(devicelog: DeviceLog) {
        return {
            id: devicelog.id,
            device_id: devicelog.device_id,
            action: devicelog.action,
            performed_by: devicelog.performed_by,
            timestamp: devicelog.performed_by,
        };
    },

    formatDeviceLogs(devicelogs: DeviceLog[]) {
        return devicelogs.map(devicelog => DeviceLogResource.formatDeviceLog(devicelog));
    }
};