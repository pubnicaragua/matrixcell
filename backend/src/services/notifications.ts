import { Expo, ExpoPushMessage, ExpoPushTicket } from 'expo-server-sdk';

// Crea una instancia de Expo SDK
const expo = new Expo();

// Definición de la interfaz para el mensaje
interface PushMessage {
  body: string;
  data?: Record<string, any>;
}

// Función para enviar notificaciones
export const sendPushNotification = async (
  pushTokens: string[],
  message: PushMessage
): Promise<void> => {
  try {
    // Filtra tokens válidos y asegúrate de que sean strings
    const validPushTokens = pushTokens.filter((token) => Expo.isExpoPushToken(token));

    // Crea mensajes para cada token
    const messages: ExpoPushMessage[] = validPushTokens.map((pushToken) => ({
      to: pushToken, // Aquí se garantiza que `to` es un string
      sound: 'default',
      body: message.body,
      data: message.data || {},
    }));

    if (messages.length === 0) {
      console.warn('No hay mensajes válidos para enviar.');
      return;
    }

    // Envía notificaciones por lotes
    const chunks = expo.chunkPushNotifications(messages);
    const tickets: ExpoPushTicket[] = [];

    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    console.log('Notificaciones enviadas:', tickets);
  } catch (error) {
    console.error('Error enviando notificaciones:', error);
  }
};
