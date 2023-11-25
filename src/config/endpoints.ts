import { API_BASE_URL } from "./process";

const USER = {
  GET_USER: () => `user`,
  UPDATE_USER: () => `user`,
  GEN_APIKEY: () => `user/apikey`,
};

const AUTH = {
  LOGIN: () => `auth/signin`,
  REGISTER_INDIVIDUAL: () => `auth/signup/individual`,
  REGISTER_BUSINESS: () => `auth/signup/business`,
  LOGOUT: () => `logout`,
  VERIFY: (token: string) => `verify/email?token=${token}`,
};

const PRICE = {
  GET_PRICE: (ticker: string) => `price?currency=${ticker}`,
};
const TRANSACTION = {
  GET_RECENT: () => `transactions?page=1&limit=15`,
  GET_TRANSACTIONS: (page: number, limit: number) =>
    `transactions?page=${page}&limit=${limit}`,
};

const WEBHOOK = {
  UPDATE_WEBHOOK: () => `webhook/register`,
};

const WALLET = {
  GETWALLET: () => "wallet",
};

const endpoints = {
  USER,
  AUTH,
  PRICE,
  WEBHOOK,
  TRANSACTION,
  WALLET,
};

export default endpoints;
