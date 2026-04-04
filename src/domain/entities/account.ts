export interface AccountEntity {
  id: string
  userId: string
  accountId: string
  providerId: string
  password?: string
  accessToken?: string
  refreshToken?: string
  idToken?: string
  expiresAt?: Date
  refreshTokenExpiresAt?: Date
  scope?: string
  createdAt: Date
  updatedAt: Date
}
