import { Quote } from '@/types';
import { Skeleton } from '@chakra-ui/react';
import React from 'react'

const QuoteInfo = ({
  quote,
  loading,
}: {
  quote: Quote | null;
  loading: boolean;
}) => {
  if (quote === null) {
    return <p>Enter an amount to generate Quote</p>;
  }
  if (!quote?.success || !quote.data?.id) {
    return (
      <p>
        Unable to get quote at this time please try again by editing the amount
        field
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
  return (
    <div className="flex flex-col gap-2 text-lg">
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Fee</p>
        <SkeletonWrapper>
          {quote.data.transactionFeesInTargetCurrency} NGN
        </SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Total to pay</p>
        <SkeletonWrapper>
          {Number(quote.data.transactionFeesInTargetCurrency) +
            Number(quote.data.amountInTargetCurrency)}{" "}
          NGN
        </SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Rate (1 BTC to NGN)</p>
        <SkeletonWrapper>~ {quote.data.exchangeRate} NGN</SkeletonWrapper>
      </div>
      <div className="flex gap-4 justify-between">
        <p className="text-[#070A21CC]">Appr. amount in BTC</p>
        <SkeletonWrapper>
          {quote.data.transactionFeesInSourceCurrency +
            quote.data.amountInSourceCurrency}{" "}
          Sat
        </SkeletonWrapper>
      </div>
    </div>
  );
};

export default QuoteInfo