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
  VStack,
} from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaBrain, FaCogs, FaRobot, FaSearch, FaSpinner } from "react-icons/fa";
import { LoginRequiredModal } from "./LoginRequiredModal"; // Adjust path if needed
import { useQBLogin } from "@/utils/apis/overos.api";

const icons = [FaRobot, FaSearch, FaSpinner, FaBrain, FaCogs];
const ICON_SIZE = 60;
const GAP = 40;
const STEP = ICON_SIZE + GAP;

const Chat = () => {
  const [input, setInput] = useState("");
  const { userInput } = useUserInput();

  const initialMessages = [
    {
      id: 1,
      text:
        userInput ||
        "Analyse these receipts from the last month for my client Alex Dan, categorize each expense correctly and upload them to my quickbooks account.",
      from: "me",
    },
    {
      id: 2,
      text: "To process Alex Dan’s receipts from the last month, the system first gathers all receipt data and prepares the images for accurate text recognition. Using OCR, it extracts key details like vendor names, dates, and amounts.",
      from: "other",
    },
    {
      id: 3,
      text: "The data is then cleaned and standardized to ensure consistency. Each expense is automatically categorized based on accounting rules, followed by a validation step to confirm alignment with Alex Dan’s financial structure.",
      from: "other",
    },
    {
      id: 4,
      text: "Finally, the verified and categorized expenses are seamlessly uploaded into the appropriate sections of his QuickBooks account.",
      from: "other",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoginRequired, setIsLoginRequired] = useState(true);
  const [hasLoggedIn, setHasLoggedIn] = useState(false);
  const { mutate: triggerLogin } = useQBLogin();
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId) {
      setHasLoggedIn(true);
      setIsLoginRequired(false);
    }
  }, []);

  const x = useMotionValue(0);
  const iconRef = useRef([icons[icons.length - 1], ...icons.slice(0, 3)]);
  const [tick, setTick] = useState(0);

  const handleLogin = async () => {
    // Call the login API and log the response
    triggerLogin(undefined, {
      onSuccess: (data) => {
        console.log("✅ QuickBooks Auth URL response:", data);
        // Optionally redirect:
        // window.location.href = data.auth_url;
      },
      onError: (error) => {
        console.error("❌ Login API call failed:", error);
      },
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      animate(x, -STEP, {
        duration: 0.1,
        ease: "linear",
        onComplete: () => {
          const updated = iconRef.current;
          const first = updated.shift();
          if (first) updated.push(first);
          iconRef.current = updated;
          x.set(0);
          setTick((prev) => prev + 1);
        },
      });
    }, 500);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // Conditional rendering starts here
  if (!isLoading) {
    return (
      <Flex
        direction="column"
        h="81.5vh"
        maxW={"90%"}
        mx={"auto"}
        px={4}
        pt={2}
        bg="gray.50"
      >
        <VStack flex={1} spacing={3} w="full">
          <Flex
            key={messages[0].id}
            w="100%"
            justify={messages[0].from === "me" ? "flex-end" : "flex-start"}
          >
            <Box
              maxW="70%"
              px={4}
              py={2}
              borderRadius="20px"
              bg={messages[0].from === "me" ? "white" : "transparent"}
              color={messages[0].from === "me" ? "gray.800" : "white"}
              border={messages[0].from === "me" ? "1px solid #D9D9D9" : "none"}
            >
              <Text fontFamily={"Inter"} fontSize={"17px"}>
                {messages[0].text}
              </Text>
            </Box>
          </Flex>
          <Box w="100%" textAlign="center" py={6} flex={1}>
            <Text
              fontFamily={"Inter"}
              mb={6}
              fontWeight={400}
              color={"gray.500"}
            >
              Searching for the best LLM for your goal
            </Text>
            <Box
              maxW="240px"
              mx="auto"
              overflow="hidden"
              height="60px"
              position="relative"
            >
              <motion.div
                style={{
                  display: "flex",
                  gap: `${GAP}px`,
                  x,
                }}
              >
                {iconRef.current.map((IconComp, idx) => (
                  <Box
                    key={tick + "-" + idx}
                    fontSize="36px"
                    color="gray.400"
                    minW={`${ICON_SIZE}px`}
                    textAlign="center"
                  >
                    <IconComp />
                  </Box>
                ))}
              </motion.div>
            </Box>
          </Box>
        </VStack>
      </Flex>
    );
  }

  if (isLoginRequired && !hasLoggedIn) {
    return (
      <LoginRequiredModal
        isOpen={true}
        onClose={() => setIsLoginRequired(false)}
        onLogin={handleLogin}
      />
    );
  }

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
              bg={msg.from === "me" ? "white" : "transparent"}
              color={msg.from === "me" ? "gray.800" : "gray.800"}
              border={msg.from === "me" ? "1px solid #D9D9D9" : "none"}
            >
              <Text
                fontFamily={msg.from === "me" ? "Inter" : ""}
                fontSize={msg.from === "me" ? "17px" : "19px"}
              >
                {msg.text}
              </Text>
            </Box>
          </Flex>
        ))}
      </VStack>

      <Flex align="center" justify="space-between" mb={2}>
        <InputGroup flex="1" mt={6}>
          <Textarea
            placeholder="Ask Anything"
            _placeholder={{
              color: "gray.400",
              fontsize: "16px",
              fontFamily: "Inter",
              fontWeight: "400",
            }}
            size="lg"
            h="50px"
            borderRadius="2xl"
            bg="white"
            pr="3rem"
            fontSize={"16px"}
            fontFamily={"Inter"}
            pl={4}
            pt={4}
            color={"gray.600"}
            resize={"none"}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <InputRightElement top="36px" right="10px">
            <Tooltip
              label="Upload"
              aria-label="Upload Tooltip"
              rounded={"8px"}
              placement="top"
            >
              <IconButton
                icon={<Upload width="16px" />}
                aria-label="Add"
                variant="ghost"
                borderRadius="full"
                size="sm"
                bg="blue.50"
                colorScheme="blue"
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
      </Flex>

      <Flex w={"full"} justifyContent={"space-between"}>
        <IconButton
          icon={<PlusIcon color="gray" />}
          aria-label="Add"
          variant="ghost"
          borderRadius="full"
          size="sm"
          bg={"blue.50"}
          colorScheme="blue"
        />
        <Tooltip
          label="Schedule"
          aria-label="Schedule Tooltip"
          rounded={"8px"}
          placement="top"
        >
          <IconButton
            icon={<Clock10Icon width="16px" />}
            aria-label="Add"
            variant="ghost"
            borderRadius="full"
            size="sm"
            bg="blue.50"
            mr={3}
            colorScheme="blue"
          />
        </Tooltip>
      </Flex>
    </Flex>
  );
};

export default Chat;
