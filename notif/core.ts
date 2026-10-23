import { z, ZodType } from 'zod';
import Mustache from 'mustache';

// ==========================================
// CONTRATOS E TIPOS DO CORE
// ==========================================

export interface ChannelContext<TSchema extends ZodType = any> {
  slug: string;
  label: string;
  templates: z.infer<TSchema>;
}

export interface NotificationContext<TPayload = any> {
  to: {
    id?: string | number;
    email?: string;
    phone?: string;
    discord_id?: string;
    push_token?: string;
    [key: string]: any;
  };
  payload: TPayload;
}

export interface ChannelInstance<TSchema extends ZodType = any> {
  slug: string;
  label: string;
  schema: TSchema;
  send: (channel: ChannelContext<TSchema>, notification: NotificationContext) => Promise<void> | void;
}

export type TemplateResolver<TChannelSchema extends ZodType, TPayload = any> =
  | z.input<TChannelSchema>
  | ((payload: TPayload) => z.input<TChannelSchema> | Promise<z.input<TChannelSchema>>);

export interface SendOptions<InputPayload> {
  to: {
    id?: string | number;
    email?: string;
    phone?: string;
    discord_id?: string;
    push_token?: string;
    [key: string]: any;
  };
  payload: InputPayload;
  via?: string[];
  templates?: Record<string, any>;
}

// ==========================================
// BUILDER DE CANAIS (ChannelCreator)
// ==========================================

export class ChannelCreator<TSchema extends ZodType = any> {
  private slug!: string;
  private label!: string;
  private schema!: TSchema;
  private sendFn!: (channel: ChannelContext<TSchema>, notification: NotificationContext) => Promise<void> | void;

  withName(slug: string, label?: string): this {
    this.slug = slug;
    this.label = label || (slug.charAt(0).toUpperCase() + slug.slice(1));
    return this;
  }

  withTemplates<S extends ZodType>(schema: S): ChannelCreator<S> {
    const creator = new ChannelCreator<S>();
    creator.slug = this.slug;
    creator.label = this.label;
    creator.schema = schema;
    creator.sendFn = this.sendFn as any;
    return creator;
  }

  withSendMethod(
    call: (channel: ChannelContext<TSchema>, notification: NotificationContext) => Promise<void> | void
  ): this {
    this.sendFn = call;
    return this;
  }

  create(): ChannelInstance<TSchema> {
    if (!this.slug) throw new Error('Slug do canal obrigatório (use .withName("slug", "Label"))');
    if (!this.schema) throw new Error('Schema de templates obrigatório');
    if (!this.sendFn) throw new Error('Método de envio obrigatório');

    return {
      slug: this.slug,
      label: this.label,
      schema: this.schema,
      send: this.sendFn,
    };
  }
}

// ==========================================
// BUILDER DE NOTIFICAÇÕES (NotificationCreator)
// ==========================================

export class NotificationCreator<TSchema extends ZodType = any> {
  private schema!: TSchema;
  private channelsToUse: Array<{ channel: ChannelInstance; templates: any }> = [];

  withPayload<T extends ZodType>(schema: T): NotificationCreator<T> {
    const builder = new NotificationCreator<T>();
    builder.schema = schema;
    return builder;
  }

  withChannel<TChannelSchema extends ZodType>(
    channel: ChannelInstance<TChannelSchema>,
    templates: TemplateResolver<TChannelSchema, z.infer<TSchema>>
  ): this {
    if (!channel || !channel.schema) {
      throw new Error(`Canal inválido passado para withChannel.`);
    }

    // Se já for objeto estático, valida na hora
    if (typeof templates === 'object' && templates !== null) {
      channel.schema.parse(templates);
    }

    this.channelsToUse.push({
      channel,
      templates,
    });

    return this;
  }

  create() {
    const schema = this.schema;
    const channels = this.channelsToUse;
    type Payload = z.infer<TSchema>;
    type InputPayload = z.input<TSchema>;

    return class ConcreteNotification {
      static async send(options: SendOptions<InputPayload>) {
        return new ConcreteNotification().send(options);
      }

      async send(options: SendOptions<InputPayload>) {
        const { to, payload, via } = options;
        const validatedPayload: Payload = schema.parse(payload);

        // Se via foi fornecido, filtra os canais pelo slug
        const channelsToRun = via && via.length > 0
          ? channels.filter((item) => via.includes(item.channel.slug))
          : channels;

        console.log('\n🚀 Disparando notificação...');

        for (const item of channelsToRun) {
          // 1. Resolve o template original: se for função (sync ou async), executa passando o payload
          let rawTemplates = typeof item.templates === 'function'
            ? await item.templates(validatedPayload)
            : item.templates;

          // Se templates foram passados em options, sobrescreve os atributos correspondentes deste canal
          if (options.templates) {
            const channelOverrides: Record<string, any> = {};
            for (const [key, val] of Object.entries(options.templates)) {
              const isKeyValid =
                key in rawTemplates ||
                ('shape' in item.channel.schema && key in (item.channel.schema as any).shape);

              if (isKeyValid) {
                channelOverrides[key] = typeof val === 'function' ? await val(validatedPayload) : val;
              }
            }
            rawTemplates = { ...rawTemplates, ...channelOverrides };
          }

          // 2. Valida o retorno com o schema do canal
          const validatedTemplates = item.channel.schema.parse(rawTemplates);

          // 3. Renderiza os valores com Mustache usando o payload
          const renderedTemplates: Record<string, any> = {};
          for (const [key, value] of Object.entries(validatedTemplates)) {
            if (typeof value === 'string') {
              renderedTemplates[key] = Mustache.render(value, validatedPayload);
            } else {
              renderedTemplates[key] = value;
            }
          }

          await item.channel.send(
            {
              slug: item.channel.slug,
              label: item.channel.label,
              templates: renderedTemplates,
            },
            {
              to,
              payload: validatedPayload,
            }
          );
        }
      }
    };
  }
}
