import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const WhatsappChannel = new ChannelCreator()
  .withName('whatsapp', 'WhatsApp')
  .withTemplates(
    z.object({
      whatsapp_body: z.string().min(1, 'Corpo da mensagem é obrigatório'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    if (!to.phone) return;
    console.log(`💬 [${channel.label} para ${to.phone}] Msg: "${channel.templates.whatsapp_body}"`);
  })
  .create();
