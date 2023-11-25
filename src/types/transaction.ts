import { AccountStatusType, PaymentMethodType } from "../../types";
import { WalletCurrencyType } from "./wallet";

export type Transaction = {
  id: string;
  ref?: string;
  hash?: string;
  amount: number;
  fees: number;
  currency: WalletCurrencyType;
  type: TransactionType;
  status: TransactionStatus;
  transactionMetadata: TransactionMetadata[];
};

export type TransactionType = "DEPOSIT" | "WITHDRAWAL";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAILED";

export type TransactionMetadata = {
  id: string;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  order: {
    id: string;
    amount: number;
    currency: WalletCurrencyType;
    paymentMethod: PaymentMethodType;
    status: any;
    quote: {
      id: string;
      exchangeRate: number;
      transactionFeesInSourceCurrency: number;
      transactionFeesInTargetCurrency: number;
      paymentBtcDetail: string;
      paymentMethod: PaymentMethodType;
      totalAmount: number;
      equivalentAmount: number;
      expiry: string;
      sourceCurrency: string;
      targetCurrency: string;
    };
  };
};
