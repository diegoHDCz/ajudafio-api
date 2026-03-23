export class ProfessionalAvailability {
  constructor(
    public id: string,
    public professionalId: string,
    public dayOfWeek: string,
    public startHour: string,
    public endHour: string,
    public shift: 'day' | 'night',
  ) {}
}
