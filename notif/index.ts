import { UserWelcomeNotification } from './notifications/UserWelcomeNotification.ts';
import { UserPasswordCodeNotification } from './notifications/UserPasswordCodeNotification.ts';
import { UserPasswordChangedNotification } from './notifications/UserPasswordChangedNotification.ts';

// await UserWelcomeNotification.send({
//   to: {
//     id: 123,
//     email: 'johndoe@grr.la',
//     phone: '+5531987654321',
//   },
//   payload: {
//     user_id: 123,
//     user_name: 'John Doe',
//     user_email: 'johndoe@grr.la',
//   },
// });

await UserPasswordCodeNotification.send({
  to: {
    id: 123,
    email: 'johndoe@grr.la',
    phone: '+5531987654321',
  },
  payload: {
    user_id: 123,
    user_name: 'John Doe',
    user_email: 'johndoe@grr.la',
    code: crypto.randomUUID().slice(-4).toUpperCase(),
  },
});

// await UserPasswordChangedNotification.send({
//   to: {
//     id: 123,
//     email: 'johndoe@grr.la',
//     phone: '+5531987654321',
//   },
//   payload: {
//     user_id: 123,
//     user_name: 'John Doe',
//     user_email: 'johndoe@grr.la',
//     changed_at: new Date().toLocaleString('pt-BR'),
//   },
//   templates: {
//     email_body: 'AVISO URGENTE: {{user_name}}, sua senha foi alterada em {{{changed_at}}}!',
//   },
// });
