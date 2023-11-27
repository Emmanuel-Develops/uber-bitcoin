import { Order } from "@/types";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React from "react";
import QRCode from "react-qr-code";
import type { ModalState, NameEnquiry, OrderState } from "./UberPay";
import Image from "next/image";

type OrderModalProps = {
  order: OrderState;
  nameEnquiry: NameEnquiry;
  modalState: ModalState;
  closeModal: () => void;
};

const OrderModal = ({
  order,
  nameEnquiry,
  modalState,
  closeModal,
}: OrderModalProps) => {
  const isOpen = modalState.isOpen;
  if (!isOpen) return;
  return (
    <Modal isOpen={isOpen} onClose={closeModal} closeOnEsc={false}>
      <ModalOverlay />
      <ModalContent>
        {modalState.step === "ORDER" ? (
          <OrderContent order={order} modalState={modalState} />
        ) : modalState.step === "PAYOUT" ? (
          <PayoutContent
            order={order}
            modalState={modalState}
            nameEnquiry={nameEnquiry}
          />
        ) : null}

        <ModalFooter>
          <Button onClick={closeModal}>{modalState.state==="PAID" ? "Close" : "Cancel"}</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;

const OrderContent = ({
  order,
  modalState,
}: {
  order: OrderState;
  modalState: ModalState;
}) => {
  return (
    <>
      <ModalHeader className="flex justify-center items-center">
        Pay Invoice
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={3}>
        <Box className="flex items-center justify-center mb-4">
          <Text>This Invoice expires in 5 minutes</Text>
        </Box>
        <Box className="flex items-center justify-center">
          <QRCode value={order?.paymentBtcDetail!} />
        </Box>

        <Box className="flex flex-col mt-4">
          <Box className="flex gap-x-16 justify-between items-center mt-2">
            <Text>Naira Amount:</Text>
            <Text>₦{order?.quote?.amountInTargetCurrency!}</Text>
          </Box>
          <Box className="flex gap-x-16 justify-between items-center mt-2">
            <Text>Total Sat Amount:</Text>
            <Text>{order?.quote?.amountInSourceCurrency!} SAT</Text>
          </Box>
          <Box className="flex gap-x-16 justify-between items-center mt-2">
            <Text>Fee: </Text>
            <Text>
              ₦{order?.quote?.transactionFeesInTargetCurrency!}{" "}
              {`(${order?.quote?.transactionFeesInSourceCurrency!} SAT)`}
            </Text>
          </Box>
          <Box className="flex gap-x-16 justify-between items-center mt-2">
            <Text>Exchange Rate:</Text>
            <Text>₦{order?.quote?.exchangeRate.toLocaleString()}</Text>
          </Box>
          <Box className="flex gap-x-16 justify-between items-center mt-2">
            <Text>Payment Method:</Text>
            <Text>{order?.paymentCollectionMethod}</Text>
          </Box>
        </Box>
      </ModalBody>
    </>
  );
};

const PayoutContent = ({
  order,
  nameEnquiry,
  modalState,
}: {
  order: OrderState;
  nameEnquiry: NameEnquiry;
  modalState: ModalState;
}) => {
  return (
    <>
      <ModalHeader className="flex justify-center items-center">
        Bank Transfer
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody pb={3}>
        {modalState.state === "PENDING" && (
          <>
            <p className="text-center font-semibold text-xl">Payment Confirmed</p>
            <div className="my-4 md:my-6">
              Processing payout to{" "}
              <span className="font-medium text-gray-800">
                {nameEnquiry.name}
              </span>{" "}
              please wait
            </div>
            <div className="flex items-center justify-center">
              <Spinner size="lg" color="gray.500" mx="auto" />
            </div>
          </>
        )}
        {modalState.state === "PAID" && (
          <>
            <div className="relative flex justify-center w-full py-4">
              <Image src="check.svg"width={50} height={50} alt="successful payment" />
            </div>
            <p className="text-center font-semibold text-xl">Payment Successful</p>
            <div className="my-4 md:my-6 text-center">
              Successful payout to{" "}
              <span className="font-medium text-gray-800">
                {nameEnquiry.name}
              </span>
            </div>
          </>
        )}
      </ModalBody>
    </>
  );
};
