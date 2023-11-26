import { WalletCurrencyType } from "./types/wallet";

export type Quote = {
  success: boolean;
  message?: string;
  data?: {
    id: "string";
    exchangeRate: "number";
    sourceCurrency: "string";
    targetCurrency: "string";
    transactionFeesInSourceCurrency: "number";
    transactionFeesInTargetCurrency: "string";
    amountInSourceCurrency: "number";
    amountInTargetCurrency: "string";
    paymentMethod: "string";
    expiry: "string";
    isValid: "boolean";
  };
};

export type Order = {
  createdAt: string;
  currency: WalletCurrencyType;
  displayAmount: string;
  isValid: true;
  orderId: string;
  paymentBtcDetail: string;
  paymentCollectionMethod: string;
  quoteId: string;
  status: string;
};

export type PaymentStatus = "INACTIVE" | "PENDING" | "PAID" | "EXPIRED"
