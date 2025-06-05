import { useQBLogin } from "@/utils/apis/overos.api";
import {
  Box,
  Button,
  Center,
  Flex,
  Image,
  Spinner,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LoginRequiredModal } from "./LoginRequiredModal";
import { useUserInput } from "@/context/useChatContext";
import { useNavigate, useParams } from "react-router-dom";
import ChatLoadingDots from "@/components/DotsLoading";
import { useGetWorkflowById } from "@/utils/apis/workflow.api";

const DemoChat = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: triggerLogin, isPending } = useQBLogin();
  const { setUserInput } = useUserInput();
  const { id } = useParams<{ id: string }>();
  const {
    data: workflow,
    isLoading: isApiLoading,
    isError,
  } = useGetWorkflowById(id!);

  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: workflow?.prompt,
      images: workflow?.sampleImages,
      from: "me",
    },
  ]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 2,
          text: "The QuickBooks API confirms a purchase transaction from June 3, 2025, with a total amount of $23.52, categorized under Meals and Entertainment, and paid by credit card.",
          images: [],
          from: "other",
        },
      ]);
      setIsLoading(false);
      setShowButton(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

  if (isApiLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || !workflow) {
    return (
      <Center py={20}>
        <Text color="red.500">Failed to load workflow details.</Text>
      </Center>
    );
  }

  const handleTryWorkflow = () => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setUserInput(
        "Upload the following expenses into my QuickBooks. Categorize them correctly."
      );
      navigate("/dashboard");
    } else {
      onOpen();
    }
  };

  const handleLogin = async () => {
    await triggerLogin(undefined, {
      onSuccess: (data) => {
        localStorage.setItem("from_demo", "true");
        window.location.href = data.auth_url;
      },
      onError: (error) => {
        console.error("❌ Login API call failed:", error);
      },
    });
  };

  return (
    <Flex
      direction="column"
      h="81.5vh"
      maxH="100vh"
      maxW={"90%"}
      mx={"auto"}
      px={4}
      pt={2}
      bg="gray.50"
    >
      <VStack flex={1} spacing={3} w="full" overflowY="auto" pb={4}>
        {messages.map((msg) => (
          <Flex
            key={msg.id}
            w="100%"
            justify={msg.from === "me" ? "flex-end" : "flex-start"}
          >
            <Box
              maxW="70%"
              px={4}
              py={2}
              borderRadius="20px"
              bg={msg.from === "me" ? "white" : "gray.100"}
              color="gray.800"
              border={msg.from === "me" ? "1px solid #D9D9D9" : "none"}
            >
              <Text
                fontFamily="Inter"
                fontSize="17px"
                mb={msg.images?.length ? 2 : 0}
              >
                {msg.text}
              </Text>

              {msg.images && msg.images.length > 0 && (
                <Flex gap={2} mt={2} flexWrap="wrap">
                  {msg.images.map((img, idx) => (
                    <Image
                      key={idx}
                      src={img}
                      alt={`img-${idx}`}
                      boxSize="60px"
                      borderRadius="md"
                      objectFit="cover"
                      border="1px solid #E2E8F0"
                    />
                  ))}
                </Flex>
              )}
            </Box>
          </Flex>
        ))}

        {isLoading && (
          <Flex w="100%" justify="flex-start" pl={2}>
            <Box px={4} borderRadius="20px" bg="gray.100" color="gray.600">
              <ChatLoadingDots />
            </Box>
          </Flex>
        )}

        {showButton && (
          <VStack spacing={3} mt={6}>
            <Text fontSize="md" color="gray.600">
              Want to see this in action with your real data?
            </Text>
            <Button
              borderRadius="full"
              px={6}
              fontWeight="medium"
              bg={"brand.900"}
              color={"white"}
              _hover={{
                bg: "brand.900",
              }}
              onClick={handleTryWorkflow}
            >
              Try This Workflow
            </Button>
          </VStack>
        )}
      </VStack>
      <LoginRequiredModal
        isOpen={isOpen}
        onClose={onClose}
        onLogin={handleLogin}
        isPending={isPending}
      />
    </Flex>
  );
};

export default DemoChat;
