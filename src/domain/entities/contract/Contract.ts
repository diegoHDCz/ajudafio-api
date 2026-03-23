export class Contract {
  constructor(
    public id: string,
    public userId: string,
    public professionalId: string,
    public startDate: Date,
    public endDate: Date,
    public status: 'active' | 'terminated' | 'pending',
    public hourRate: number,
    public totalHours: number,
    public totalAmount: number,
    public shift: 'day' | 'night',
    public discountPercentage: number,
    public minimumHoursToAvailableDiscount: number,
  ) {}
}
