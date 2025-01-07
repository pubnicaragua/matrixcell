import { DeviceLog } from "../models/deviceLog.model";

export const DeviceLogResource = {
    formatDeviceLog(devicelog: DeviceLog) {
        return {
            id: devicelog.id,
            device_id: devicelog.device_id,
            action_id: devicelog.action_id,
            perform_user_id: devicelog.perform_user_id,
            created_at: devicelog.created_at,
        };
    },

    formatDeviceLogs(devicelogs: DeviceLog[]) {
        return devicelogs.map(devicelog => DeviceLogResource.formatDeviceLog(devicelog));
    }
};