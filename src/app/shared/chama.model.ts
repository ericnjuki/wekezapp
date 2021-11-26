export class Chama {
  public id: number;
  public chamaId: number;
  public chamaName: string;
  public balance?: number;
  public LoanInterestRate?: number;
  public LatePaymentFineRate?: number;
  public minimumContribution?: number;
  public period?: number;
  public mgrOrder?: number[];
  public mgrAmount?: any;
  public nextMgrDate?;
  public nextMgrReceiverIndex?: number;
  public setupComplete?: boolean;
  public totalOwed?: number;
}
