export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  explanation?: string;
  timestamp: number;
}

export interface CalculationResponse {
  result: string;
  explanation: string;
  isError: boolean;
}

export enum CalculatorMode {
  STANDARD = 'STANDARD',
  SCIENTIFIC = 'SCIENTIFIC'
}