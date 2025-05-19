import { useUserInput } from "@/context/useChatContext";
import { Box, Flex, Text, Textarea, VStack } from "@chakra-ui/react";
import { animate, motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaBrain, FaCogs, FaRobot, FaSearch, FaSpinner } from "react-icons/fa";

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

  // Delay transition into actual chat interface
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Animated icon carousel setup
  const x = useMotionValue(0);
  const iconRef = useRef([icons[icons.length - 1], ...icons.slice(0, 3)]);
  const [tick, setTick] = useState(0);

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

  return (
    <Flex
      direction="column"
      h="83.5vh"
      maxH="100vh"
      maxW={"90%"}
      mx={"auto"}
      px={4}
      py={2}
      bg="gray.50"
    >
      {!isLoading ? (
        <>
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
                borderRadius="lg"
                bg={messages[0].from === "me" ? "white" : "transparent"}
                color={messages[0].from === "me" ? "gray.800" : "white"}
                boxShadow="md"
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
        </>
      ) : (
        // CHAT VIEW
        <>
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
                  borderRadius="lg"
                  bg={msg.from === "me" ? "white" : "transparent"}
                  color={msg.from === "me" ? "gray.800" : "gray.800"}
                  boxShadow={msg.from === "me" ? "md" : "none"}
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

          <Box mt="auto" pt={2}>
            <Textarea
              placeholder="Ask Anything"
              value={input}
              borderRadius={"20px"}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              bg="white"
              h="166px"
              fontFamily={"Inter"}
              resize="none"
              _placeholder={{ color: "gray.400", fontsize: "16px" }}
              pl={5}
              pt={4}
            />
          </Box>
        </>
      )}
    </Flex>
  );
};

export default Chat;
