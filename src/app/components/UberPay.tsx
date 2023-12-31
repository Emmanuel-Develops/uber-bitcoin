"use client";
import React, { useRef, useState } from "react";
import { BankCode, BankEnquiryResponse } from "@/types/bank";
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import { useDebouncedCallback } from "use-debounce";
import {
  DEBOUNCE_DELAY,
  DEBOUNCE_DELAY_QUOTE,
  POLLING_INTERVAL,
} from "@/config/default";
import axiosInstance from "@/services/axios";
import endpoints from "@/config/endpoints";
import Image from "next/image";
import { getOrderProps } from "../page";
import { Order, PaymentStatus, Quote } from "@/types";
import QuoteInfo from "./QuoteInfo";
import OrderModal from "./OrderModal";
import { getOrderById, getTxnByOrderId } from "../services/quote";

type UberPayProps = {
  bankCodes: BankCode[];
  getQuote: ({
    amount,
  }: {
    amount: string;
  }) => Promise<{ success: boolean; data?: any; message?: string }>;
  getOrder: (
    props: getOrderProps
  ) => Promise<{ success: boolean; data?: Order; message?: string }>;
  getOrderById: (orderId: string) => Promise<{
    success: boolean;
    data?: any;
    message?: string;
  }>;
};

export type OrderState = (Order & { quote: Quote["data"] }) | null;

export type NameEnquiry = {
  loading: boolean;
  name: string;
  data: any;
  error: string;
};

export type ModalState = {
  isOpen: boolean;
  step: "ORDER" | "PAYOUT";
  state: "PENDING" | "PAID" | "FAILED";
};

const defaultModalState: ModalState = {
  isOpen: false,
  step: "ORDER",
  state: "PENDING",
};

export const UberPay = ({ bankCodes, getQuote, getOrder }: UberPayProps) => {
  const [bankCode, setBankCode] = useState<string | null>(null);
  const [nameEnquiry, setNameEnquiry] = useState({
    loading: false,
    name: "",
    data: {},
    error: "",
  });
  const [bankError, setBankError] = useState({
    bankCode: "",
  });
  const [quote, setQuote] = useState<{
    loading: boolean;
    quoteInfo: Quote | null;
  }>({
    loading: false,
    quoteInfo: null,
  });

  const [order, setOrder] = useState<OrderState>(null);

  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("INACTIVE");
  const [payoutStatus, setPayoutStatus] = useState<PaymentStatus>("PENDING");
  const [modalState, setModalState] = useState<ModalState>(defaultModalState);

  const toast = useToast();

  const amountRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const accountNumberRef = useRef<HTMLInputElement>(null);

  const enquireName = async (bankCode: string, accountNumber: string) => {
    setNameEnquiry((prev) => ({ ...prev, loading: true }));
    try {
      const res = await axiosInstance.get<BankEnquiryResponse>(
        endpoints.BANK.NAME_ENQUIRY(bankCode, accountNumber)
      );
      const acctName = res.data.data?.accountName;
      if (acctName) {
        setNameEnquiry({ loading: false, name: acctName, data: "", error: "" });
      } else {
        throw new Error("Name not found for this account");
      }
    } catch (err: any) {
      // const errMessage = err?.response?.data?.message ?? "Unable to find account"
      const errMessage = "Unable to find account"
      setNameEnquiry({
        name: "",
        data: {},
        error: errMessage,
        loading: false,
      });
    }
  };

  const calculateQuote = async (amount: string) => {
    setQuote({ ...quote, loading: true });
    try {
      const res = await getQuote({ amount });
      if (res.success) {
        const quote = res;
        setQuote({ loading: false, quoteInfo: quote });
      } else {
        setQuote({
          loading: false,
          quoteInfo: {
            success: false,
            message: res.message ?? "something went wrong",
            data: undefined,
          },
        });
        toast({
          position: "top",
          title: "Generate Quote",
          description: res?.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error: any) {
      setQuote({
        loading: false,
        quoteInfo: {
          success: false,
          message: error.message ?? "something went wrong",
        },
      });
      toast({
        position: "top",
        title: "Generate Quote",
        description: error.message,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const debounceCalculateQuote = useDebouncedCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const amount = e.target.value;
      if (amount) {
        if (parseInt(amount) < 60) {
          setQuote({loading: false, quoteInfo: {success: false, data: undefined, message: "Amount cannot be less than 60"}})
          return
        }
        calculateQuote(amount);
      } else {
        setQuote({loading: false, quoteInfo: null})
      }
    },
    DEBOUNCE_DELAY_QUOTE
  );

  const debouncedEnquiry = useDebouncedCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      const acctNumberLength = e.target.value?.length ?? 0;
      if (acctNumberLength !== 10) {
        setNameEnquiry({ ...nameEnquiry, name: "", error: "Invalid account number", loading: false });
        return;
      }
      if (!value) {
        setBankError((prev) => ({
          ...prev,
          bankCode: "",
        }));
        setNameEnquiry({ ...nameEnquiry, name: "", error: "", loading: false });
        return;
      }
      if (!bankCode) {
        setBankError((prev) => ({
          ...prev,
          bankCode: "Please select a bank first",
        }));
        setNameEnquiry({ ...nameEnquiry, name: "", error: "" });
        return;
      }
      setBankError((prev) => ({
        ...prev,
        bankCode: "",
      }));
      await enquireName(bankCode, value);
    },
    DEBOUNCE_DELAY
  );

  const handleBankSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const bankCode = e.target.value
    if (bankCode) {
      setBankError({
        bankCode: ""
      })
    }
    setBankCode(e.target.value);
  };

  const handleAcceptQuote = async (formData: FormData) => {
    const id = quote.quoteInfo?.data?.id;
    const accountNumber = formData?.get("accountNumber") as string;
    if (!id || !accountNumber) {
      console.error("missing cred");
      return;
    }
    await getOrder({
      id,
      bankAccountName: nameEnquiry.name,
      bankAccountNumber: accountNumber,
      bankCode: bankCode ?? "",
    })
      .then((res) => {
        if (res.success && res.data) {
          const orderData = { ...res.data, quote: quote.quoteInfo?.data };
          setOrder(orderData);
          setModalState({
            isOpen: true,
            state: "PENDING",
            step: "ORDER",
          });
          localStorage.setItem(
            "order",
            JSON.stringify({ ...orderData, quote: quote.quoteInfo?.data })
          );
          checkForPayment(orderData.orderId);
        } else {
          throw new Error(res.message ?? "Failed to create Order");
        }
      })
      .catch((err: any) => {
        toast({
          position: "top",
          title: "Create Invoice",
          description: err.message ?? "Failed to create Order",
          status: "error",
          duration: 6000,
          isClosable: true,
        });
      });
  };

  const updateOrderStatus = (status: Order["status"]) => {
    const orderString = localStorage.getItem("order");
    if (orderString) {
      try {
        const order = JSON.parse(orderString) as Order & {
          quote: Quote["data"];
        };
        setOrder({ ...order, status });
      } catch (err) {}
    }
    setPaymentStatus("PAID");
    setModalState({
      isOpen: true,
      state: "PENDING",
      step: "PAYOUT",
    });
  };

  const checkForPayout = async (orderId: string, expiryTime?: string) => {
    let shouldCheckForPayment = true;
    try {
      const res = await getTxnByOrderId(orderId);
      if (res.success && res.data) {
        const withdrawal = res.data.find((txn) => txn.type === "WITHDRAWAL");
        if (!withdrawal) {
          shouldCheckForPayment = true;
        } else {
          const withdrawalMatchOrder =
            withdrawal.transactionMetadata.orderId == orderId;
          if (withdrawalMatchOrder) {
            shouldCheckForPayment = false;
            setModalState({
              isOpen: true,
              state: "PAID",
              step: "PAYOUT",
            });
          } else {
            shouldCheckForPayment = false;
            // setPaymentStatus("EXPIRED")
            setModalState({
              isOpen: true,
              state: "FAILED",
              step: "PAYOUT",
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
      shouldCheckForPayment = true;
    }
    shouldCheckForPayment &&
      setTimeout(() => {
        checkForPayout(orderId);
      }, POLLING_INTERVAL);
  };

  const checkForPayment = async (orderId: string, expiryTime?: string) => {
    let shouldCheckForPayment = true;
    try {
      const res = await getOrderById(orderId);
      if (res.success && res.data) {
        if (res.data.status === "PAID") {
          shouldCheckForPayment = false;
          updateOrderStatus("PAID");
          checkForPayout(orderId);
          return;
        }
        if (res.data.status !== "PENDING") {
          shouldCheckForPayment = false;
          // setPaymentStatus("EXPIRED")
          setModalState({
            isOpen: true,
            state: "FAILED",
            step: "ORDER",
          });
        }
      }
    } catch (err) {
      console.error(err);
      shouldCheckForPayment = true;
    }
    shouldCheckForPayment &&
      setTimeout(() => {
        checkForPayment(orderId);
      }, POLLING_INTERVAL);
  };

  const reset = () => {
    formRef.current && formRef.current.reset();
    setBankCode(null);
    setNameEnquiry({
      loading: false,
      name: "",
      data: {},
      error: "",
    });
    setBankError({
      bankCode: "",
    });
    setOrder(null);
    setQuote({ loading: false, quoteInfo: null });
    setPaymentStatus("INACTIVE");
    setPayoutStatus("INACTIVE");
  };

  const closeOrderModal = () => {
    // const {step, state} = modalState
    setModalState(defaultModalState);
    reset();
  };

  return (
    <>
      <form
        ref={formRef}
        action={handleAcceptQuote}
        className="flex flex-col gap-4"
      >
        <FormControl isInvalid={Boolean(bankError.bankCode)}>
          <FormLabel className="text-base">Select Bank</FormLabel>
          <Select
            placeholder="Select a bank"
            onChange={handleBankSelect}
            value={bankCode ?? ""}
            h="55px"
            name="bankCode"
          >
            {bankCodes.map((bank) => (
              <option key={bank.nipBankCode} value={bank.nipBankCode}>
                {bank.bankName}
              </option>
            ))}
          </Select>
          <FormErrorMessage>{bankError.bankCode}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel className="text-base">Enter account number</FormLabel>
          <Input
            ref={accountNumberRef}
            py="25px"
            type="number"
            name="accountNumber"
            onChange={debouncedEnquiry}
            isRequired
          />
          <div className="text-right pt-[15px]">
            {nameEnquiry.loading ? (
              <Spinner size="sm" color="gray.500" mr={2} />
            ) : !!nameEnquiry.error ? (
              <p className="text-sm text-red-400">{nameEnquiry.error}</p>
            ) : !!nameEnquiry.name ? (
              <p className="text-[18px] text-[#070A21CC] uppercase font-semibold">
                {nameEnquiry.name}
              </p>
            ) : null}
          </div>
        </FormControl>
        <FormControl>
          <FormLabel className="text-base">Amount</FormLabel>
          <InputGroup>
            <Input
              py="25px"
              type="number"
              name="amount"
              ref={amountRef}
              onChange={debounceCalculateQuote}
              isRequired
              placeholder="Min amount 60 NGN"
            />
            <InputRightElement top="50%" className="translate-y-[-50%]">
              <Image src="naira.svg" width={18} height={18} alt="naira" />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <QuoteInfo loading={quote.loading} quote={quote.quoteInfo} />
        <Button
          type="submit"
          colorScheme="orange"
          w="100%"
          className="bg-[#F2B246]"
          isDisabled={!!bankError.bankCode || nameEnquiry.loading || !!nameEnquiry.error || !quote.quoteInfo?.success}
        >
          Pay
        </Button>
      </form>
      <OrderModal
        order={order}
        nameEnquiry={nameEnquiry}
        modalState={modalState}
        closeModal={closeOrderModal}
      />
    </>
  );
};
