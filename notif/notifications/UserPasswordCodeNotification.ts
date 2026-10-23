import { z } from 'zod';
import { NotificationCreator } from '../core.ts';
import { EmailChannel } from '../channels/EmailChannel.ts';
import { SmsChannel } from '../channels/SmsChannel.ts';
import { WhatsappChannel } from '../channels/WhatsappChannel.ts';
import { InAppChannel } from '../channels/InAppChannel.ts';
import { PhoneCallChannel } from '../channels/PhoneCallChannel.ts';

export const UserPasswordCodeNotification = new NotificationCreator()
  .withPayload(
    z.object({
      user_id: z.number(),
      user_name: z.string().min(1, 'Nome é obrigatório'),
      user_email: z.string().email('E-mail inválido'),
      code: z.string(),
    }).strict()
  )
  .withChannel(EmailChannel, {
    email_subject: 'Alteração de senha requisitada',
    email_body: `
      Olá {{user_name}}.
      Uma alteração de senha foi requisitada. Caso não tenha sido você, ignore este e-mail.
      Seu código de confirmação: {{code}}
    `,
  })
  .withChannel(SmsChannel, {
    sms_body: 'Seu código: {{code}}. Não passe este código para ninguém.',
  })
  .withChannel(WhatsappChannel, {
    whatsapp_body: 'Olá *{{user_name}}*! Seu código para alteração de senha é *{{code}}*',
  })
  .withChannel(InAppChannel, {
    inapp_title: 'Código de Recuperação',
    inapp_body: 'Um código de recuperação de senha foi gerado: {{code}}',
  })
  .withChannel(PhoneCallChannel, {
    phonecall_text: 'Olá {{user_name}}, isto é uma ligação automática. Seu código para alteração de senha é {{code}}. Até mais.',
  })
  .create();
