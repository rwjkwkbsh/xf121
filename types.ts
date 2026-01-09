
export interface DesignScheme {
  style: string;
  dimensions: string;
  friendlyDesign: string;
  modelingKeys: string;
  printParams: string;
  failureRisks: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  prompt: string;
  scheme: DesignScheme;
}
