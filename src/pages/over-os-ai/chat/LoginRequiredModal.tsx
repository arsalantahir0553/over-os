import { CustomModal } from "@/components/CustomModal";
import { Text } from "@chakra-ui/react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

export const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLogin,
}: LoginRequiredModalProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onLogin}
      headerText="Please Login"
      submitButtonText="Login"
      cancelButtonText="Cancel"
      submitButtonColor="brand.500"
    >
      <Text>This action requires you to login to your QuickBooks account.</Text>
    </CustomModal>
  );
};
