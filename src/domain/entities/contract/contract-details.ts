export class ContractDetails {
  constructor(
    public id: string,
    public contractId: string,
    public city: string,
    public state: string,
    public attendsAtHome: boolean,
    public attendsHospital: boolean,
    public attendsNursingHome: boolean,
    public scheduledDays: string[],
    public startHour: string,
    public endHour: string,
  ) {}
}
