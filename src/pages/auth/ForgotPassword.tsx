import { useRequestPasswordReset } from "@/utils/apis/auth.api";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const ResetPasswordRequestPage = () => {
  const [searchParams] = useSearchParams();
  // Initialize email state with the value from URL ?email=... or empty string if none
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const toast = useToast();

  const { mutate: sendResetEmail, isPending } = useRequestPasswordReset();

  // Optional: If URL changes, update email input too (only if you want that)
  useEffect(() => {
    const emailFromUrl = searchParams.get("email") || "";
    setEmail(emailFromUrl);
  }, [searchParams]);

  const handleReset = () => {
    sendResetEmail(email, {
      onSuccess: (data) => {
        toast({
          title: "Reset link sent",
          description: data.message,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        toast({
          title: "Error",
          description:
            error?.response?.data?.message || "Failed to send reset link",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white">
      <VStack spacing={6} w="full" maxW="469px" px={6}>
        <Text fontSize="30px" fontWeight={700}>
          Reset Password
        </Text>

        <FormControl id="email">
          <FormLabel>Email address</FormLabel>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            h="55px"
            pl={4}
            borderColor="blue.500"
            focusBorderColor="blue.600"
          />
        </FormControl>

        <Button
          colorScheme="blue"
          w="full"
          h="55px"
          onClick={handleReset}
          isLoading={isPending}
          isDisabled={!email}
        >
          Send Reset Link
        </Button>
      </VStack>
    </Flex>
  );
};

export default ResetPasswordRequestPage;
