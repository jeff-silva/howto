import { db } from '../database'
import { resumasResume } from '../database/schema'
import { asc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  try {
    const resumes = await db
      .select()
      .from(resumasResume)
      .orderBy(asc(resumasResume.id))

    return resumes
  } catch (error: any) {
    console.error('[Drizzle Error]', error)
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Erro ao consultar banco do Odoo com Drizzle',
    })
  }
})
