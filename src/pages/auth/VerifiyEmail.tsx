import { useValidateEmail } from "@/utils/apis/auth.api";
import { Flex, Spinner, Text, useToast, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";
  const toast = useToast();
  const navigate = useNavigate();

  const validateEmail = useValidateEmail();
  const { isPending } = validateEmail;

  useEffect(() => {
    console.log("Effect running with token:", token, "and email:", email);

    if (!token || !email) {
      toast({
        title: "Missing token or email",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      navigate("/signin");
      return;
    }

    validateEmail.mutate(
      { token, email },
      {
        onSuccess: (data) => {
          toast({
            title: "Email Verified",
            description: data.message || "Your email has been verified.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setTimeout(() => {
            navigate("/signin");
          }, 3000);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          console.error("❌ Validation error:", error);
          toast({
            title: "Verification Failed",
            description:
              error?.response?.data?.message ||
              "Failed to verify email. Please try again.",
            status: "error",
            duration: 4000,
            isClosable: true,
          });
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, email, toast, navigate]);

  return (
    <Flex minH="100vh" align="center" justify="center" bg="white" px={6}>
      <VStack spacing={6} maxW="450px" w="full" textAlign="center">
        {isPending ? (
          <>
            <Spinner size="xl" />
            <Text fontSize="xl" fontWeight="semibold">
              Verifying your email...
            </Text>
          </>
        ) : (
          <Text fontSize="xl" fontWeight="semibold" color="green.500">
            Email verified successfully! Redirecting to signin...
          </Text>
        )}
      </VStack>
    </Flex>
  );
};

export default VerifyEmailPage;
