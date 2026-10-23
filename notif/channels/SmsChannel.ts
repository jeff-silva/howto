import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const SmsChannel = new ChannelCreator()
  .withName('sms', 'SMS')
  .withTemplates(
    z.object({
      sms_body: z.string().min(1, 'Mensagem SMS obrigatória'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    if (!to.phone) return;
    console.log(`📱 [${channel.label} para ${to.phone}] Msg: "${channel.templates.sms_body}"`);
  })
  .create();
