import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const EmailChannel = new ChannelCreator()
  .withName('email', 'E-mail')
  .withTemplates(
    z.object({
      email_subject: z.string().min(1, 'Assunto é obrigatório'),
      email_body: z.string().min(1, 'Corpo do email é obrigatório'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    if (!to.email) return;
    console.log(
      `📧 [${channel.label.toUpperCase()} para ${to.email}] Assunto: "${channel.templates.email_subject}" | Msg: "${channel.templates.email_body}"`
    );
  })
  .create();
