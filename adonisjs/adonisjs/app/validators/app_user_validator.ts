import vine from '@vinejs/vine'

export const appUserSave = vine.compile(
  vine.object({
    name: vine.string(),
    email: vine.string().email(),
  })
)
