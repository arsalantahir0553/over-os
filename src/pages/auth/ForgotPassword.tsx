import { useForgotPassword } from "@/utils/apis/auth.api";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Image,
  Input,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import OverOsLogo from "../../assets/svgs/overos-ai-beta-auth-logo.svg";

const ResetPasswordRequestPage = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(() => searchParams.get("email") || "");
  const toast = useToast();
  const navigate = useNavigate();
  const { mutate: sendResetEmail, isPending } = useForgotPassword();

  useEffect(() => {
    const emailFromUrl = searchParams.get("email") || "";
    setEmail(emailFromUrl);
  }, [searchParams]);

  const handleReset = () => {
    sendResetEmail(email, {
      onSuccess: (data) => {
        toast({
          title: "OTP sent",
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
          description: error?.response?.data?.message || "Failed to send OTP",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
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
          <Text
            fontSize="30px"
            fontWeight={400}
            letterSpacing={"8%"}
            color={"black"}
            fontFamily={"Joan"}
          >
            Reset Your Password
          </Text>
          <FormControl id="email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@gmail.com"
              h="50px"
              px={4}
              borderRadius="10px"
              border="1px solid"
              borderColor="gray.300"
              bg="white"
              color={"black"}
              fontSize="sm"
              boxShadow="sm"
              _placeholder={{ color: "gray.400" }}
              _focus={{
                borderColor: "blue.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-blue-500)",
              }}
            />
          </FormControl>

          <Button
            colorScheme="blue"
            w="full"
            h="55px"
            onClick={handleReset}
            isLoading={isPending}
            isDisabled={!email}
            borderRadius="md"
          >
            Send OTP
          </Button>
        </VStack>
      </Flex>
    </>
  );
};

export default ResetPasswordRequestPage;
