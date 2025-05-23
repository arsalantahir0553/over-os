import { useResetPassword } from "@/utils/apis/auth.api";
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
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const handleReset = () => {
    resetPassword(
      { token, newPassword },
      {
        onSuccess: (data) => {
          toast({
            title: "Success",
            description: data.message,
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          navigate("/signin"); // redirect after success
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          toast({
            title: "Error",
            description:
              error?.response?.data?.message || "Failed to reset password",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white">
      <VStack spacing={6} w="full" maxW="469px" px={6}>
        <Text fontSize="30px" fontWeight={700}>
          Set New Password
        </Text>

        <FormControl id="new-password">
          <FormLabel>New Password</FormLabel>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
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
          isDisabled={!newPassword || !token}
        >
          Reset Password
        </Button>
      </VStack>
    </Flex>
  );
};

export default ResetPasswordPage;
