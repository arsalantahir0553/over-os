import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useBreakpointValue,
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
  width?: string | number;
  isLoading?: boolean;
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
  width = "400px",
  isLoading,
}: CustomModalProps) => {
  const responsiveWidth = useBreakpointValue({
    base: "90%", // mobile
    sm: "90%",
    md: width, // default from props
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent
        maxW={responsiveWidth}
        mx={{ base: 2, sm: 4 }} // side padding for smaller screens
        borderRadius="lg"
      >
        <ModalHeader color="text" fontSize={{ base: "md", md: "lg" }}>
          {headerText}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody px={{ base: 3, md: 6 }} py={2}>
          {children}
        </ModalBody>
        <ModalFooter
          display="flex"
          flexDirection={{ base: "column-reverse", sm: "row" }}
          gap={{ base: 3, sm: 2 }}
          alignItems="stretch"
          px={{ md: 6, base: 3 }}
        >
          <Button
            variant="ghost"
            bg={"gray.900"}
            onClick={onClose}
            width={{ base: "100%", sm: "auto" }}
          >
            {cancelButtonText}
          </Button>
          <Button
            isLoading={isLoading}
            bg={submitButtonColor}
            color="text"
            onClick={onSubmit}
            width={{ base: "100%", sm: "auto" }}
          >
            {submitButtonText}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
