import { request } from 'undici'

interface CreateSessionDTO {
  userId: string
}

interface ClerkTokenResponse {
  jwt: string
}

export class ClerkRepository {
  private baseUrl = 'https://api.clerk.com/v1'
  private secretKey = process.env.CLERK_SECRET_KEY!

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.secretKey}`,
      'Content-Type': 'application/json',
    }
  }

  /**
   * ⚠️ NÃO usar em produção
   */
  async createSession({ userId }: CreateSessionDTO) {
    const { body } = await request(`${this.baseUrl}/sessions`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        user_id: userId,
      }),
    })

    const data = await body.json()
    return data
  }

  /**
   * ✅ Gerar token com template
   */
  async getTokenByTemplate(
    sessionId: string,
    templateName: string,
  ): Promise<string> {
    const { body } = await request(
      `${this.baseUrl}/sessions/${sessionId}/tokens/${templateName}`,
      {
        method: 'POST',
        headers: this.getHeaders(),
      },
    )

    const data = (await body.json()) as ClerkTokenResponse

    return data.jwt
  }

  /**
   * ✅ Revogar sessão (logout)
   */
  async revokeSession(sessionId: string): Promise<void> {
    await request(`${this.baseUrl}/sessions/${sessionId}/revoke`, {
      method: 'POST',
      headers: this.getHeaders(),
    })
  }
}
