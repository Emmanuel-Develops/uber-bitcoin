
const BANK = {
  GET_BANK_CODE: () => `bank/bankcode`,
  NAME_ENQUIRY: (bankCode: string, accountNumber: string) => `bank/name-enquiry?bankCode=${bankCode}&accountNumber=${accountNumber}`,
}

const endpoints = {
  BANK
};

export default endpoints;
