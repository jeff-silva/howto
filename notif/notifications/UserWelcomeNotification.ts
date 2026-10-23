import { z } from 'zod';
import { NotificationCreator } from '../core.ts';
import { EmailChannel } from '../channels/EmailChannel.ts';
import { SmsChannel } from '../channels/SmsChannel.ts';
import { WhatsappChannel } from '../channels/WhatsappChannel.ts';
import { InAppChannel } from '../channels/InAppChannel.ts';

export const UserWelcomeNotification = new NotificationCreator()
  .withPayload(
    z.object({
      user_id: z.number(),
      user_name: z.string().min(1, 'Nome é obrigatório'),
      user_email: z.string().email('E-mail inválido'),
    }).strict()
  )
  .withChannel(EmailChannel, {
    email_subject: 'Bem-vindo ao sistema, {{user_name}}!',
    email_body: 'Olá {{user_name}}, sua conta foi criada com sucesso.',
  })
  .withChannel(SmsChannel, {
    sms_body: 'Bem-vindo {{user_name}}! Sua conta foi ativada.',
  })
  .withChannel(WhatsappChannel, {
    whatsapp_body: 'Olá *{{user_name}}*! Seu acesso está liberado.',
  })
  .withChannel(InAppChannel, {
    inapp_title: 'Boas-vindas!',
    inapp_body: 'Olá {{user_name}}, seja bem-vindo à nossa plataforma.',
  })
  .create();
