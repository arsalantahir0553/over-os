import LinkedInLogo from "@/assets/svgs/LinkedLogo.svg"; // Replace with your actual SVG import
import { CustomModal } from "@/components/CustomModal";
import { Box, Flex, Image, Text } from "@chakra-ui/react";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  isPending?: boolean;
}

export const LinkedinLoginModal = ({
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
      headerText="Login with LinkedIn"
      submitButtonText="Login with LinkedIn"
      cancelButtonText="Cancel"
      submitButtonColor="blue.600"
      width="600px"
      isLoading={isPending}
    >
      <Flex direction="column" align="center" gap={4} textAlign="center">
        <Box boxSize="60px">
          <Image src={LinkedInLogo} />
          {/* Or use: <Image src="/path/to/linkedin-logo.svg" alt="LinkedIn" /> */}
        </Box>

        <Text fontSize="lg" fontWeight="medium" color="text">
          This action requires you to log in with your LinkedIn account.
        </Text>

        <Text fontSize="sm" color="gray.500">
          We use LinkedIn authentication to securely verify your identity.
        </Text>
      </Flex>
    </CustomModal>
  );
};
