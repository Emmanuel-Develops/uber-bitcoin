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
  Text,
} from "@chakra-ui/react";
import React from "react";
import QRCode from "react-qr-code";
import { OrderState } from "./UberPay";

const OrderModal = ({ order, closeModal }: { order: OrderState, closeModal: () => void }) => {
  const isOpen = Boolean(order?.orderId && order?.status === "PENDING");

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="flex justify-center items-center">
          Pay Invoice
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
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

        <ModalFooter>
          <Button onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default OrderModal;
