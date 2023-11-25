export type Wallet = {
  id: string;
  currency: WalletCurrencyType;
  balance: number;
  transactions: any[];
};

export const WalletCurrency = {
  Ngn: "NGN",
  Usd: "USD",
  Btc: "BTC",
} as const;

export const precisionByExchangeUnit = {
  [WalletCurrency.Ngn]: 1e2,
  [WalletCurrency.Usd]: 1e2,
  [WalletCurrency.Btc]: 1e8,
} as const;

export type WalletCurrencyType =
  (typeof WalletCurrency)[keyof typeof WalletCurrency];
