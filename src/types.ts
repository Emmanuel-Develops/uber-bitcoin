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

export type PaymentStatus = "INACTIVE" | "PENDING" | "PAID" | "EXPIRED";

export type Transaction = {
  amount: number;
  autopayout: boolean;
  createdAt: string;
  currency: WalletCurrencyType;
  fees: number;
  hash: string;
  id: string;
  ref: string;
  status: PaymentStatus;
  transactionMetadata: TransactionMetadata;
  type: "DEPOSIT" | "WITHDRAWAL";
  updatedAt: string;
};

type TransactionMetadata = {
  id: string;
  orderId: string;
  tyrusRef: null;
  bankCode: string;
  bankName: string;
};
