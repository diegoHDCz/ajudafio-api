import { SessionEntity } from '../../domain/entities/session'
import { SessionRepository } from '../../domain/repositories/session.repository'
import { db } from '../db/drizzle'
import { sessions } from '../db/schema'
import { eq, lt, InferSelectModel } from 'drizzle-orm'

// Tipagem interna do Drizzle baseada no seu schema
type SessionRow = InferSelectModel<typeof sessions>

export class DrizzleSessionRepository implements SessionRepository {
  async findById(id: string): Promise<SessionEntity | null> {
    const [row] = await db.select().from(sessions).where(eq(sessions.id, id))
    return row ? this.mapToEntity(row) : null
  }
  async findByToken(token: string): Promise<SessionEntity | null> {
    const [row] = await db
      .select()
      .from(sessions)
      .where(eq(sessions.token, token))
    return row ? this.mapToEntity(row) : null
  }

  async findActiveSessionsByUserId(userId: string): Promise<SessionEntity[]> {
    const rows = await db
      .select()
      .from(sessions)
      .where(eq(sessions.userId, userId))
    return rows.map(this.mapToEntity)
  }

  async save(session: SessionEntity): Promise<void> {
    await db.insert(sessions).values({
      ...session,
      ipAddress: session.ipAddress ?? null, // Converte undefined para null pro Postgres
      userAgent: session.userAgent ?? null,
    })
  }

  async delete(id: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, id))
  }

  async deleteAllExpired(): Promise<number> {
    // No Postgres, o retorno do delete não é o count direto sem returning
    const deletedRows = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()))
      .returning({ id: sessions.id })

    return deletedRows.length
  }

  async invalidateAllUserSessions(userId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.userId, userId))
  }

  // O Mapeador Mágico: Resolve o erro de string | null vs string | undefined
  private mapToEntity(row: SessionRow): SessionEntity {
    return {
      ...row,
      ipAddress: row.ipAddress ?? undefined,
      userAgent: row.userAgent ?? undefined,
    }
  }
}
