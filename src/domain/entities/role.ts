export enum Role {
  PROFESSIONAL = 'PROFESSIONAL',
  CLIENT = 'CLIENT',
  ADMIN = 'ADMIN',
}

export namespace Role {
  export function create(role: string): Role {
    switch (role) {
      case 'PROFESSIONAL':
        return Role.PROFESSIONAL
      case 'CLIENT':
        return Role.CLIENT
      case 'ADMIN':
        return Role.ADMIN
      default:
        throw new Error(`Invalid role: ${role}`)
    }
  }
}
