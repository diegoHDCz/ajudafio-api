export class Booking {
  constructor(
    public id: string,
    public contractId: string,
    public professionalId: string,
    public status: 'pending' | 'confirmed' | 'rejected',
  ) {}
}
