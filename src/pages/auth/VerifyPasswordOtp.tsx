import { useVerifyPasswordOtp } from "@/utils/apis/auth.api";
import {
  Button,
  Container,
  Heading,
  HStack,
  Icon,
  PinInput,
  PinInputField,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { MdEmail } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";

const VerifyPasswordOtp = () => {
  const navigate = useNavigate();
  const { email } = useParams();
  const toast = useToast();

  const [otp, setOtp] = useState(""); // Store as string here
  const verifyOtpMutation = useVerifyPasswordOtp();

  const handleVerify = async () => {
    if (otp.length !== 6 || isNaN(Number(otp))) {
      toast({
        title: "Invalid OTP",
        description: "Please enter a valid 6-digit numeric code.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      await verifyOtpMutation.mutateAsync({
        email: email || "",
        otp: Number(otp), // Cast to number here
      });

      toast({
        title: "Email Verified",
        description: "Your account has been activated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });

      navigate(`/reset-password?email=${email}&otp=${otp}`);
    } catch (err) {
      toast({
        title: "Verification Failed",
        description: "Please make sure your OTP is correct.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="md" centerContent py={20}>
      <VStack spacing={6} textAlign="center">
        <Icon as={MdEmail} boxSize={16} color="blue.400" />
        <Heading as="h2" size="xl">
          Verify Your Email Address
        </Heading>
        <Text fontSize="lg" color="gray.600">
          We have sent a verification link and OTP to your email. Please enter
          the 6-digit OTP below to activate your account.
        </Text>

        <HStack>
          <PinInput otp onChange={setOtp} value={otp}>
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
            <PinInputField />
          </PinInput>
        </HStack>

        <Button
          colorScheme="blue"
          isLoading={verifyOtpMutation.isPending}
          onClick={handleVerify}
        >
          Verify OTP
        </Button>

        <Button
          variant="link"
          colorScheme="blue"
          onClick={() => navigate("/signin")}
        >
          Back to Login
        </Button>
      </VStack>
    </Container>
  );
};

export default VerifyPasswordOtp;
