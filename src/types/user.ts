import { AccountTypes } from "@/config/default";
import { AccountStatusType, AccountType } from "../../types";
import { Wallet } from "./wallet";

export type Profile = {
  id: string;
  name: string;
  businessname?: string;
  email: string;
  phone: string;
  kycInfo: KycInfo;
  account: Account;
};

export type Account = {
  id: string;
  type: AccountType;
  status: AccountStatusType;
  apiKey?: string;
  ownerId: string;
  webhooks: Webhook[];
  WalletDetails: Wallet[];
  totalSatsExchanged: number;
};

export type Webhook = {
  url: string;
  secret: string;
};

export type KycInfo = {
  address: string;
  phone: string;
  businessName: string;
  nationality: string;
  status: KycInfoStatus;
};

export type KycInfoStatus = "PENDING" | "ACTIVE" | "INACTIVE";
