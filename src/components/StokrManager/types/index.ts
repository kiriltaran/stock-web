export type Company = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  change_percent: string;
};

export type Filters = {
  name: string;
  to: string;
  from: string;
};

export type Series = {
  name: string;
  series: {
    [key: string]: number;
  };
};
