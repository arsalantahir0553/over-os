import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import type { ReactNode } from "react";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  headerText: string;
  children: ReactNode;
  submitButtonText?: string;
  cancelButtonText?: string;
  submitButtonColor?: string;
}

export const CustomModal = ({
  isOpen,
  onClose,
  onSubmit,
  headerText,
  children,
  submitButtonText = "Submit",
  cancelButtonText = "Cancel",
  submitButtonColor = "brand.900",
}: CustomModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{headerText}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button colorScheme="brand" bg={submitButtonColor} onClick={onSubmit}>
            {submitButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
