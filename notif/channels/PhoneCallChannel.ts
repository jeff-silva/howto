import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const PhoneCallChannel = new ChannelCreator()
  .withName('phonecall', 'Phone Call')
  .withTemplates(
    z.object({
      phonecall_text: z.string().min(1, 'Mensagem da ligação'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    if (!to.phone) return;
    console.log(`📞 [${channel.label} para ${to.phone}] Texto: "${channel.templates.phonecall_text}"`);
  })
  .create();
