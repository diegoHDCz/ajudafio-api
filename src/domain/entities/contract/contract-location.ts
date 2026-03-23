export class ContractLocation {
  constructor(
    public id: string,
    public contractId: string,
    public city: string,
    public state: string,
    public type: 'home' | 'hospital' | 'nursing_home',
  ) {}
}
