import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const InAppChannel = new ChannelCreator()
  .withName('in_app', 'Notificação In-App')
  .withTemplates(
    z.object({
      inapp_title: z.string().min(1, 'Título in-app obrigatório'),
      inapp_body: z.string().min(1, 'Mensagem in-app obrigatória'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    const userId = to.user_id || to.id;

    if (!userId) return;

    console.log(
      `🔔 [${channel.label} para Usuário #${userId}] Título: "${channel.templates.inapp_title}" | Msg: "${channel.templates.inapp_body}"`
    );
  })
  .create();
