import { useQBLogin } from "@/utils/apis/overos.api";
import {
  Box,
  Button,
  Flex,
  Image,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useState } from "react";
import Demo1 from "../../../assets/images/demo1.jpeg";
import Demo2 from "../../../assets/images/demo2.jpeg";
import { LoginRequiredModal } from "./LoginRequiredModal";

// Keyframe animation for bouncing dots
const bounce = keyframes`
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.3;
  } 
  40% {
    transform: scale(1);
    opacity: 1;
  }
`;

const LoadingDots = () => (
  <Flex align="center" gap={1} px={2}>
    {[0, 1, 2].map((i) => (
      <Box
        key={i}
        w="6px"
        h="6px"
        bg="gray.500"
        borderRadius="full"
        animation={`${bounce} 1.4s infinite`}
      />
    ))}
  </Flex>
);

const DemoChat = () => {
  const images = [Demo1, Demo2];
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: triggerLogin, isPending } = useQBLogin();

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Upload the following expenses into my QuickBooks. Categorize them correctly.",
      images,
      from: "me",
    },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: 2,
          text: "Sure. I've categorized these transactions and uploaded them to QuickBooks under the appropriate expense categories.",
          images: [],
          from: "other",
        },
      ]);
      setIsLoading(false);
      setShowButton(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, []);

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
            <Box
              px={4}
              py={2}
              borderRadius="20px"
              bg="gray.100"
              color="gray.600"
              fontSize="20px"
            >
              <LoadingDots />
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
              onClick={onOpen}
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
