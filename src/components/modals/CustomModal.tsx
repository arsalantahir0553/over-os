import {
  Button,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import type { ReactNode } from "react";
import { AiOutlineClose } from "react-icons/ai";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: () => void;
  onCancel?: () => void;
  header: string;
  submitText?: string;
  cancelText?: string;
  submitButtonColor?: string;
  children: ReactNode;
}

const CustomModal = ({
  isOpen,
  onClose,
  onSubmit,
  onCancel,
  header,
  submitText = "Submit",
  cancelText = "Cancel",
  submitButtonColor = "blue",
  children,
}: CustomModalProps) => {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleSubmit = () => {
    onSubmit?.();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered size="md">
      <ModalOverlay />
      <ModalContent bg="surface" borderRadius="xl">
        <Flex justify="space-between" align="center" px={6} pt={4}>
          <Text fontSize="xl" fontWeight="bold" color="text">
            {header}
          </Text>
          <IconButton
            variant="ghost"
            color="mutedText"
            aria-label="Close modal"
            icon={<AiOutlineClose />}
            onClick={onClose}
            size="sm"
          />
        </Flex>

        <ModalBody px={6} py={4}>
          {children}
        </ModalBody>

        <ModalFooter px={6} pb={4}>
          <Button
            variant="ghost"
            colorScheme="gray"
            mr={3}
            onClick={handleCancel}
            color="mutedText"
          >
            {cancelText}
          </Button>
          <Button bg={submitButtonColor} color={"white"} onClick={handleSubmit}>
            {submitText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CustomModal;
