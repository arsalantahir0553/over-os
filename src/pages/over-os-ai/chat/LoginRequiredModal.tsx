import QuickBooksLogo from "@/assets/svgs/QuickBooksLogo";
import { CustomModal } from "@/components/CustomModal";
import { Box, Flex, Text } from "@chakra-ui/react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  isPending?: boolean;
}

export const LoginRequiredModal = ({
  isOpen,
  onClose,
  onLogin,
  isPending,
}: LoginRequiredModalProps) => {
  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onLogin}
      headerText="Login with QuickBooks"
      submitButtonText="Login with QuickBooks"
      cancelButtonText="Cancel"
      submitButtonColor="green.500"
      width={"600px"}
      isLoading={isPending}
    >
      <Flex direction="column" align="center" gap={4} textAlign="center">
        <Box boxSize="60px">
          <QuickBooksLogo />
          {/* Alternatively use: <Image src="/path/to/qb-icon.svg" alt="QuickBooks" /> */}
        </Box>

        <Text fontSize="lg" fontWeight="medium" color="gray.700">
          This action requires you to log in to your QuickBooks account.
        </Text>

        <Text fontSize="sm" color="gray.500">
          We use QuickBooks authentication to securely manage your workflow.
        </Text>
      </Flex>
    </CustomModal>
  );
};
