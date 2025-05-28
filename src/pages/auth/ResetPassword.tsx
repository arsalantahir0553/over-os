import { useResetPassword } from "@/utils/apis/auth.api";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import OverOsLogo from "../../assets/svgs/overos-ai-beta-auth-logo.svg";

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: resetPassword, isPending } = useResetPassword();

  const passwordsMatch = newPassword === confirmPassword;

  const handleReset = () => {
    if (!passwordsMatch) return;

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
          navigate("/signin");
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
    <>
      <Box pl={10} pt={10} bg="#f5f5f5">
        <Image
          src={OverOsLogo}
          onClick={() => navigate("/dashboard")}
          cursor={"pointer"}
        />
      </Box>

      <Flex minH="85vh" align="center" justify="center" bg="#f5f5f5">
        <VStack spacing={6} w="full" maxW="469px" px={6}>
          <Text fontSize="30px" fontWeight={700}>
            Set New Password
          </Text>

          <FormControl isInvalid={!passwordsMatch && confirmPassword !== ""}>
            <Input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              h="50px"
              px={4}
              borderRadius="10px"
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              fontSize="sm"
              boxShadow="sm"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
            />
          </FormControl>

          <FormControl isInvalid={!passwordsMatch && confirmPassword !== ""}>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              h="50px"
              px={4}
              borderRadius="10px"
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              fontSize="sm"
              boxShadow="sm"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
            />
            <FormErrorMessage>Passwords do not match.</FormErrorMessage>
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            h="55px"
            onClick={handleReset}
            isLoading={isPending}
            isDisabled={!newPassword || !confirmPassword || !token}
            borderRadius="md"
          >
            Reset Password
          </Button>
        </VStack>
      </Flex>
    </>
  );
};

export default ResetPasswordPage;
