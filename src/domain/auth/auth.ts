export class Auth {
  private constructor(
    public readonly email: string,
    private readonly password: string,
  ) {}

  static create(email: string, password: string): Auth {
    if (!email) {
      throw new Error('Email is required')
    }

    if (!password) {
      throw new Error('Password is required')
    }

    return new Auth(email, password)
  }

  public getPassword(): string {
    return this.password
  }
  public getEmail(): string {
    return this.email
  }
}
