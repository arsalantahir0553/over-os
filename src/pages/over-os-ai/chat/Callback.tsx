import { useGetUserId } from "@/utils/apis/overos.api";
import { Box, Center, Heading, Spinner, Text, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: getUserId } = useGetUserId();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const realmId = searchParams.get("realmId");

    if (code && state && realmId) {
      getUserId(
        { code, state, realmId }, // optional
        {
          onSuccess: (data) => {
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("realm_id", data.realm_id);
            navigate("/chat");
          },
          onError: (error) => {
            console.error("OAuth callback failed:", error);
            alert("Authentication failed. Please try again.");
          },
        }
      );
    }
  }, [searchParams, getUserId, navigate]);

  return (
    <Center minH="100vh" bg="gray.50" px={4}>
      <Box
        maxW="md"
        w="full"
        p={8}
        bg="white"
        boxShadow="lg"
        rounded="xl"
        textAlign="center"
      >
        <VStack spacing={6}>
          <Spinner size="xl" color="blue.500" />
          <Heading size="md">Authenticating with QuickBooks...</Heading>
          <Text color="gray.600" fontSize="sm">
            Please wait while we finalize your login.
          </Text>
        </VStack>
      </Box>
    </Center>
  );
};

export default Callback;
