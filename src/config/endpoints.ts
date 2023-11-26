
const USER = {
  GET_USER: () => `user`,
  UPDATE_USER: () => `user`,
  GEN_APIKEY: () => `user/apikey`,
};

const BANK = {
  GET_BANK_CODE: () => `bank/bankcode`,
  NAME_ENQUIRY: (bankCode: string, accountNumber: string) => `bank/name-enquiry?bankCode=${bankCode}&accountNumber=${accountNumber}`,
}

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
  BANK,
  PRICE,
  WEBHOOK,
  TRANSACTION,
  WALLET,
};

export default endpoints;
