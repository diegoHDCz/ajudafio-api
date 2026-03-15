export enum Role {
  HEALTH_PROFESSIONAL = 'health_professional',
  CLIENT = 'client',
  ADMIN = 'admin',
}

export namespace Role {
  export function create(role: string): Role {
    switch (role) {
      case 'health_professional':
        return Role.HEALTH_PROFESSIONAL
      case 'client':
        return Role.CLIENT
      case 'admin':
        return Role.ADMIN
      default:
        throw new Error(`Invalid role: ${role}`)
    }
  }
}
