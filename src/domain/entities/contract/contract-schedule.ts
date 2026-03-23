export class ContractSchedule {
  constructor(
    public id: string,
    public contractId: string,
    public dayOfWeek: string,
    public startHour: string,
    public endHour: string,
  ) {}
}
