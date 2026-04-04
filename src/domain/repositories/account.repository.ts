import { AccountEntity } from '../entities/account'

export interface AccountRepository {
  findByUserId(userId: string): Promise<AccountEntity[]>
  findByProvider(
    providerId: string,
    accountId: string,
  ): Promise<AccountEntity | null>

  save(account: AccountEntity): Promise<void>
  update(id: string, data: Partial<AccountEntity>): Promise<void>
  deleteByUserId(userId: string): Promise<void>
}
