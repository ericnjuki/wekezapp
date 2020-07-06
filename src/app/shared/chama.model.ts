export class Chama {
  public chamaId: number;
  public chamaName: string;
  public balance?: number;
  public LatePaymentFineRate?: number;
  public minimumContribution?: number;
  public period?: number;
  public LoanInterestRate?: number;
  public mgrOrder?: number[];
  public mgrAmount?: number;
  public nextMgrReceiverIndex?: number;
  public nextMgrDate?;
  public setupComplete?: boolean;
}
