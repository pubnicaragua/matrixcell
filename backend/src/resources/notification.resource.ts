import { Notification } from "../models/notification.model";

export const NotificationResource = {
    formatNotification(notification: Notification) {
        return {
            id: notification.id,
            created_at: notification.created_at,
            message: notification.message,
            user_id: notification.user_id,
            invoice_id: notification.invoice_id,
            status: notification.status
        };
    },

    formatNotifications(notifications: Notification[]) {
        return notifications.map(notification => NotificationResource.formatNotification(notification));
    }
};