import { z } from 'zod';
import { NotificationCreator } from '../core.ts';
import { EmailChannel } from '../channels/EmailChannel.ts';
import { SmsChannel } from '../channels/SmsChannel.ts';
import { WhatsappChannel } from '../channels/WhatsappChannel.ts';
import { InAppChannel } from '../channels/InAppChannel.ts';

export const UserPasswordChangedNotification = new NotificationCreator()
  .withPayload(
    z.object({
      user_id: z.number(),
      user_name: z.string().min(1, 'Nome é obrigatório'),
      user_email: z.string().email('E-mail inválido'),
      changed_at: z.string(),
    }).strict()
  )
  .withChannel(EmailChannel, {
    email_subject: 'Sua senha foi alterada com sucesso',
    email_body: `
      Olá {{user_name}}.
      Confirmamos que a senha da sua conta foi alterada em {{{changed_at}}}.
      Se você não reconhece esta atividade, entre em contato com nosso suporte imediatamente.
    `,
  })
  .withChannel(SmsChannel, {
    sms_body: 'Sua senha foi alterada em {{{changed_at}}}. Se não foi você, contate o suporte.',
  })
  .withChannel(WhatsappChannel, {
    whatsapp_body: 'Olá *{{user_name}}*! Informamos que a sua senha foi alterada com sucesso em {{{changed_at}}}.',
  })
  .withChannel(InAppChannel, {
    inapp_title: 'Senha alterada',
    inapp_body: 'A senha da sua conta foi alterada com sucesso em {{{changed_at}}}.',
  })
  .create();
