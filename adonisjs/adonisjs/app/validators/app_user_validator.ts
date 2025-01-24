import vine from '@vinejs/vine'

export const appUserSave = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        const user = await db.from('app_user').where('email', value).first()
        if (!user) return true
        if (!!field.data.id && +user.id === +field.data.id) return true
        return false
      }),
  })
)
