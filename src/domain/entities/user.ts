import { randomUUID } from 'crypto'
import { Role } from './role'

export class User {
  constructor(
    public id: string,
    public email: string,
    public authId: string | null,
    public createdAt: Date | null,
    public role: Role = Role.CLIENT,
    public username: string | null = null,
  ) {}

  static create(
    email: string,
    auth_id: string | null = null,
    username: string | null = null,
  ) {
    return new User(
      randomUUID(),
      email,
      auth_id,
      new Date(),
      Role.CLIENT,
      username,
    )
  }
}
