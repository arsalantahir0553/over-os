import LinkedInLogo from "@/assets/svgs/LinkedLogo.svg";
import { CustomModal } from "@/components/CustomModal";
import { Box, Flex, Image, Text, useBreakpointValue } from "@chakra-ui/react";

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
  const modalWidth = useBreakpointValue({
    base: "90%",
    md: "500px",
    lg: "600px",
  });

  return (
    <CustomModal
      isOpen={isOpen}
      onClose={onClose}
      onSubmit={onLogin}
      headerText="Login with LinkedIn"
      submitButtonText="Login with LinkedIn"
      cancelButtonText="Cancel"
      submitButtonColor="blue.600"
      width={modalWidth}
      isLoading={isPending}
    >
      <Flex
        direction="column"
        align="center"
        gap={{ base: 3, md: 4 }}
        textAlign="center"
        px={{ base: 0, md: 4 }}
      >
        <Box boxSize={{ base: "40px", md: "60px" }}>
          <Image src={LinkedInLogo} alt="LinkedIn Logo" />
        </Box>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="medium"
          color="text"
        >
          This action requires you to log in with your LinkedIn account.
        </Text>

        <Text fontSize={{ base: "sm", md: "sm" }} color="gray.500">
          We use LinkedIn authentication to securely verify your identity.
        </Text>
      </Flex>
    </CustomModal>
  );
};
