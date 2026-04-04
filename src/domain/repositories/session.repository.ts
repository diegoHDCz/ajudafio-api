// src/domain/repositories/session-repository.ts
import { SessionEntity } from '../entities/session'

export interface SessionRepository {
  findById(id: string): Promise<SessionEntity | null>
  findByToken(token: string): Promise<SessionEntity | null>
  findActiveSessionsByUserId(userId: string): Promise<SessionEntity[]>

  save(session: SessionEntity): Promise<void>
  delete(id: string): Promise<void>
  deleteAllExpired(): Promise<number> // Retorna quantidade removida
  invalidateAllUserSessions(userId: string): Promise<void>
}
