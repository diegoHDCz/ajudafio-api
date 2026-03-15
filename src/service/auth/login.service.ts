import { Clerk } from '@clerk/clerk-sdk-node'
import { env } from '../../config/env'
import { GetUserService } from '../user/get-user.service'

interface LoginServiceDeps {
  getUserService: GetUserService
}

interface LoginRequest {
  email: string
  password: string
}

interface LoginResponse {
  token: string
}

export class LoginService {
  private deps: LoginServiceDeps
  private clerk: ReturnType<typeof Clerk>
  constructor(deps: LoginServiceDeps) {
    this.deps = deps
    this.clerk = Clerk({
      secretKey: env.CLERK_SECRET_KEY!,
    })
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    const { email, password } = request

    try {
      const user = await this.deps.getUserService.executeByEmail(email)
      if (!user || !user.authId) {
        throw new Error('User not found or missing auth ID')
      }
      const userId = user.authId as string

      const verified = await this.clerk.users.verifyPassword({
        userId,
        password,
      })
      if (!verified) {
        throw new Error('Invalid credentials')
      }
      const { token } = await this.clerk.signInTokens.createSignInToken({
        userId,
        expiresInSeconds: 3600,
      })

      return { token }
    } catch (error) {
      throw new Error(
        'Login failed: ' +
          (error instanceof Error ? error.message : String(error)),
      )
    }
  }
}
