import { z } from 'zod';
import { ChannelCreator } from '../core.ts';

export const DiscordChannel = new ChannelCreator()
  .withName('discord', 'Discord')
  .withTemplates(
    z.object({
      discord_body: z.string().min(1, 'Corpo da mensagem'),
    })
  )
  .withSendMethod((channel, notification) => {
    const { to } = notification;
    if (!to.discord_id) return;
    console.log(`🟢 [${channel.label.toUpperCase()} para ${to.discord_id}] Msg: "${channel.templates.discord_body}"`);
  })
  .create();
