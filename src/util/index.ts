import { WalletCurrencyType, precisionByExchangeUnit } from "@/types/wallet";

export function currencyUnitConversion(
  value: number,
  type: WalletCurrencyType,
  unit: boolean = false,
) {
  if (unit) {
    return value * precisionByExchangeUnit[type];
  } else {
    return value / precisionByExchangeUnit[type];
  }
}

export const currencyUnitFormat = (
  number: number,
  currency: WalletCurrencyType,
) => {
  return `${new Intl.NumberFormat("en-NG", {
    minimumFractionDigits:
      precisionByExchangeUnit[currency].toString().length - 1,
  }).format(number)} ${currency}`;
};
