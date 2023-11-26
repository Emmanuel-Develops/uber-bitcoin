import { Order, PaymentStatus } from "@/types";
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
import { NameEnquiry, OrderState } from "./UberPay";

const PayoutModal = ({ status, nameEnquiry, closeModal }: { status: PaymentStatus, nameEnquiry: NameEnquiry,  closeModal: () => void }) => {
  const isOpen = status === "PAID"

  return (
    <Modal isOpen={isOpen} onClose={closeModal}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader className="flex justify-center items-center">
          Bank Transfer
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <p className="text-center font-medium text-lg">Payment Confirmed</p>
          <div>Processing payout to <span className="font-medium text-gray-800">{nameEnquiry.name}</span> please wait</div>
          {/* <Spinner /> */}
        </ModalBody>

        <ModalFooter>
          <Button onClick={closeModal}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PayoutModal;
