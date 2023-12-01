import { Quote } from "@/types";
import { WalletCurrency } from "@/types/wallet";
import { currencyUnitFormat } from "@/util";
import { Skeleton } from "@chakra-ui/react";
import React from "react";

const QuoteInfo = ({
  quote,
  loading,
}: {
  quote: Quote | null;
  loading: boolean;
}) => {
  if (quote === null && !loading) {
    return <p>Enter an amount to generate Quote</p>;
  }
  if ((!quote?.success || !quote.data?.id) && !loading) {
    return (
      <p>
        {quote?.message ??
          `Unable to get quote at this time please try again by editing the amount
        field`}
      </p>
    );
  }

  const SkeletonWrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Skeleton height="20px" isLoaded={!loading}>
        <p className="font-semibold test-[#070A21CC]">{children}</p>
      </Skeleton>
    );
  };

  const totalAmount = (parseInt(quote?.data?.amountInTargetCurrency ?? "0") + parseInt(quote?.data?.transactionFeesInTargetCurrency ?? "0"))

  return (
    <div className="flex flex-col gap-2 text-lg">
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Fee</p>
        <SkeletonWrapper>
        {currencyUnitFormat(Number(quote?.data?.transactionFeesInTargetCurrency), WalletCurrency.Ngn)}
        </SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Total to pay</p>
        <SkeletonWrapper>
          {currencyUnitFormat(totalAmount, WalletCurrency.Ngn)}
        </SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Rate (1 BTC to NGN)</p>
        <SkeletonWrapper>~ {quote?.data?.exchangeRate.toLocaleString()} NGN</SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Appr. amount in BTC</p>
        <SkeletonWrapper>
          {Number(quote?.data?.transactionFeesInSourceCurrency) ?? 0 +
            Number(quote?.data?.amountInSourceCurrency) ?? 0}{" "}
          Sat
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default QuoteInfo;
