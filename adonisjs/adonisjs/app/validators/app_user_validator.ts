import vine from '@vinejs/vine'

export const appUserSave = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine
      .string()
      .email()
      .unique(async (db, value, field) => {
        return !(await db
          .from('app_user')
          .whereNot('id', field.data.id || null)
          .where('email', value)
          .first())
      }),
  })
)
