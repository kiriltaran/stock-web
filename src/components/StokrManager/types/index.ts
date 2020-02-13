export type Company = {
  symbol: string;
  name: string;
  change: number;
  change_percent: string;
};

export type Filters = {
  name: string;
  to: string;
  from: string;
};
