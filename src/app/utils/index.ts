import { WalletCurrencyType, precisionByExchangeUnit } from "@/types/wallet";

export const currencyUnitFormat = (
  number: number,
  currency: WalletCurrencyType,
) => {
  return `${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits:
      precisionByExchangeUnit[currency].toString().length - 1,
  }).format(number)} ${currency}`;
};
