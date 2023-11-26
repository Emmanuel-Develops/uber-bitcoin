export type BankCode = { 
  nipBankCode: string; 
  bankName: string ;
};

export type BankEnquiryDataResponse = {
  "accountName": string,
  "accountNumber": string,
  "kycLevel": null | string,
  "nameInquiryReference": string,
  "channelCode": null | string,
}

export type BankEnquiryResponse = {
  "status": string,
  "message": string,
  "data": BankEnquiryDataResponse,
}