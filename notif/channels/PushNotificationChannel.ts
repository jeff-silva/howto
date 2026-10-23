import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const PushNotificationChannel = new ChannelCreator()
  .withName('push', 'Push Notification')
  .withTemplates(
    z.object({
      push_title: z.string().min(1, 'Título do push obrigatório'),
      push_body: z.string().min(1, 'Mensagem do push obrigatória'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    const token = to.push_token || to.fcm_token || to.device_token;

    if (!token) return;

    console.log(
      `📲 [${channel.label} para dispositivo ${token}] Título: "${channel.templates.push_title}" | Msg: "${channel.templates.push_body}"`
    );
  })
  .create();
