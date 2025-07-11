import ChatLoadingDots from "@/components/DotsLoading";
import { useUserInput } from "@/context/useChatContext";
import {
  Box,
  Flex,
  IconButton,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

type Message = {
  id: number;
  text: string | JSX.Element;
  from: "me" | "other";
};

const TempChatResponse = () => {
  const { userInput } = useUserInput();
  const [input, setInput] = useState("");
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.700", "accent");
  const [isTyping, setIsTyping] = useState(true);

  const initialMessages: Message[] = [
    {
      id: 1,
      text: userInput,
      from: "me",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          from: "other",
          text: (
            <Box
              p={{ base: 3, md: 4 }}
              bg="blue.800"
              border="1px solid"
              borderColor="blue.500"
              borderRadius="xl"
              color="white"
              fontSize={{ base: "14px", md: "16px" }}
            >
              <Text mb={2}>
                🚀 In our beta, we’ve launched a powerful LinkedIn AI Agent to
                help you create engaging posts and grow faster.
              </Text>
              <Link to="/workflow/linkedin">
                <Box
                  as="button"
                  fontWeight="semibold"
                  bg="blue.500"
                  px={4}
                  py={2}
                  borderRadius="md"
                  _hover={{ bg: "blue.400" }}
                  transition="all 0.2s"
                  fontSize="sm"
                >
                  Try LinkedIn AI Agent →
                </Box>
              </Link>
            </Box>
          ),
        },
      ]);
      setIsTyping(false);
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), text: input, from: "me" }]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (isTyping) {
    return (
      <Flex
        direction="column"
        h="81.5vh"
        maxW="100%"
        mx="auto"
        px={{ base: 0, md: 4 }}
        pt={2}
        color="text"
      >
        <VStack flex={1} spacing={3} w="full">
          <Flex
            key={messages[0].id}
            w="100%"
            justify={messages[0].from === "me" ? "flex-end" : "flex-start"}
          >
            <Box
              maxW="80%"
              px={4}
              py={2}
              borderRadius="20px"
              bg={messages[0].from === "me" ? "surface2" : "transparent"}
              color="text"
              border={messages[0].from === "me" ? "1px solid" : "none"}
              borderColor={messages[0].from === "me" ? "border" : "transparent"}
            >
              <Text fontFamily="body" fontSize="16px">
                {messages[0].text}
              </Text>
            </Box>
          </Flex>

          <Flex w="100%" justify="flex-start">
            <Box maxW="80%">
              <ChatLoadingDots />
            </Box>
          </Flex>
        </VStack>
      </Flex>
    );
  }

  return (
    <Flex
      direction="column"
      h="calc(100vh - 135px)"
      maxW="100%"
      mx="auto"
      px={{ base: 0, md: 4 }}
      pt={2}
      color="text"
    >
      <VStack
        flex={1}
        w="full"
        overflowY="auto"
        pb={4}
        pr={1}
        sx={{
          "&::-webkit-scrollbar": { width: "6px" },
          "&::-webkit-scrollbar-thumb": { borderRadius: "8px" },
        }}
      >
        {messages.map((msg) => (
          <Flex
            key={msg.id}
            w="100%"
            justify={msg.from === "me" ? "flex-end" : "flex-start"}
          >
            <Box
              maxW={{ md: "80%", base: "full" }}
              py={2}
              px={4}
              borderRadius="20px"
              bg={msg.from === "me" ? "whiteAlpha.100" : "transparent"}
              color="text"
              border={msg.from === "me" ? "1px solid" : ""}
              borderColor="border"
            >
              {typeof msg.text === "string" ? (
                msg.text
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => (
                    <Text key={idx} fontFamily="body" fontSize="16px" mb={1}>
                      {line}
                    </Text>
                  ))
              ) : (
                <>{msg.text}</>
              )}
            </Box>
          </Flex>
        ))}
      </VStack>

      <Box mt={4}>
        <InputGroup>
          <Textarea
            placeholder="Ask Anything..."
            fontFamily="body"
            fontSize="16px"
            fontWeight="400"
            h="52px"
            resize="none"
            px={4}
            pt={3}
            pr="3rem"
            borderRadius="xl"
            bg="surface2"
            color="text"
            border="1px solid"
            borderColor="border"
            _placeholder={{ color: "mutedText" }}
            _focus={{
              borderColor: "primary",
              boxShadow: "0 0 0 1px var(--chakra-colors-primary)",
            }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement top="28px" right="10px">
            <Tooltip label="Upload" hasArrow placement="top">
              <IconButton
                icon={<Upload width="16px" />}
                aria-label="Upload"
                size="sm"
                borderRadius="full"
                bg={iconBg}
                color={iconColor}
                _hover={{ bg: iconHoverBg }}
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>

        <Flex justify="space-between" mt={2}>
          <IconButton
            icon={<PlusIcon color="currentColor" size="16px" />}
            aria-label="Add"
            variant="ghost"
            size="sm"
            borderRadius="full"
            bg={iconBg}
            color={iconColor}
            _hover={{ bg: iconHoverBg }}
          />
          <Tooltip label="Schedule" hasArrow placement="top">
            <IconButton
              icon={<Clock10Icon width="16px" />}
              aria-label="Schedule"
              variant="ghost"
              size="sm"
              borderRadius="full"
              bg={iconBg}
              color={iconColor}
              _hover={{ bg: iconHoverBg }}
              mr={2}
            />
          </Tooltip>
        </Flex>
      </Box>
    </Flex>
  );
};

export default TempChatResponse;
