// src/infrastructure/repositories/drizzle-account-repository.ts
import { AccountRepository } from '../../domain/repositories/account.repository'
import { AccountEntity } from '../../domain/entities/account'
import { db } from '../db/drizzle'
import { accounts } from '../db/schema'
import { eq, and, InferSelectModel } from 'drizzle-orm'

export type Account = InferSelectModel<typeof accounts>

export class DrizzleAccountRepository implements AccountRepository {
  async findByUserId(userId: string): Promise<AccountEntity[]> {
    const rows = await db
      .select()
      .from(accounts)
      .where(eq(accounts.userId, userId))
    return rows.map(this.mapToEntity)
  }

  async findByProvider(
    providerId: string,
    accountId: string,
  ): Promise<AccountEntity | null> {
    const [row] = await db
      .select()
      .from(accounts)
      .where(
        and(
          eq(accounts.providerId, providerId),
          eq(accounts.accountId, accountId),
        ),
      )

    return row ? this.mapToEntity(row) : null
  }

  async save(account: AccountEntity): Promise<void> {
    await db.insert(accounts).values({
      ...account,
      password: account.password ?? null,
      accessToken: account.accessToken ?? null,
      refreshToken: account.refreshToken ?? null,
      idToken: account.idToken ?? null,
    })
  }

  async update(id: string, data: Partial<AccountEntity>): Promise<void> {
    await db
      .update(accounts)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(accounts.id, id))
  }

  async deleteByUserId(userId: string): Promise<void> {
    await db.delete(accounts).where(eq(accounts.userId, userId))
  }

  // Mapeador para resolver o conflito de null vs undefined
  private mapToEntity(row: Account): AccountEntity {
    return {
      ...row,
      password: row.password ?? undefined,
      accessToken: row.accessToken ?? undefined,
      refreshToken: row.refreshToken ?? undefined,
      idToken: row.idToken ?? undefined,
      expiresAt: row.accessTokenExpiresAt ?? undefined,
      refreshTokenExpiresAt: row.refreshTokenExpiresAt ?? undefined,
      scope: row.scope ?? undefined,
    } as AccountEntity
  }
}
