export class ProfessionalLocation {
  constructor(
    public id: string,
    public professionalId: string,
    public city: string,
    public state: string,
    public type: 'home' | 'hospital' | 'nursing_home',
  ) {}
}
