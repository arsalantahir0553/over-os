import ClaudeIcon from "@/assets/svgs/ClaudeIcon";
import GeminiIcon from "@/assets/svgs/GeminiIcon";
import GptIcon from "@/assets/svgs/GptIcon";
import LlmIcon from "@/assets/svgs/LlmIcon";
import MidJourneyIcon from "@/assets/svgs/MidJourneyIcon";
import { useUserInput } from "@/context/useChatContext";
import {
  useChat,
  useCreateWorkflow,
  useIntent,
  useQBLogin,
} from "@/utils/apis/overos.api";
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
import { LoginRequiredModal } from "./LoginRequiredModal"; // Adjust path if needed
import ChatLoadingDots from "@/components/DotsLoading";

const icons = [
  <GptIcon />,
  <ClaudeIcon />,
  <LlmIcon />,
  <MidJourneyIcon />,
  <GeminiIcon />,
];
const ICON_SIZE = 20;
const GAP = 40;
const STEP = ICON_SIZE + GAP;

const Chat = () => {
  const [input, setInput] = useState("");
  const { userInput, selectedImages, isChat, setIsChat } = useUserInput();
  const storedPrompt = localStorage.getItem("temp_user_prompt");
  const initialMessages = [
    {
      id: 1,
      text: storedPrompt || userInput,
      from: "me",
    },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [isLoginRequired, setIsLoginRequired] = useState(false);
  const { mutate: triggerLogin } = useQBLogin();
  const { mutate: createWorkflow, isPending } = useCreateWorkflow();
  const { mutateAsync: sendChat, isPending: isChatPending } = useChat();
  const { mutateAsync: detectIntent, isPending: isIntentPending } = useIntent();

  useEffect(() => {
    const runChatOrWorkflow = async () => {
      if (!userInput.trim()) return;

      try {
        const intentResponse = await detectIntent({ prompt: userInput });
        const { intent } = intentResponse;
        const userId = localStorage.getItem("user_id");

        if (intent === "chat") {
          const chatResponse = await sendChat({ prompt: userInput });
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: chatResponse.response || "No summary available",
              from: "other",
            },
          ]);
          return;
        }

        // Only proceed to workflow if intent is NOT 'chat'
        if (!userId) {
          setIsLoginRequired(true);
          return;
        }

        // Save input & images for later
        localStorage.setItem("temp_user_prompt", userInput);
        const convertToBase64 = (file: File) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          });

        const base64Images = await Promise.all(
          selectedImages.map((img) => convertToBase64(img))
        );

        localStorage.setItem(
          "temp_selected_images",
          JSON.stringify(base64Images)
        );

        // Trigger workflow
        createWorkflow(
          {
            userPrompt: userInput,
            images: selectedImages,
            userId,
          },
          {
            onSuccess: (data) => {
              setMessages((prev) => [
                ...prev,
                {
                  id: Date.now(),
                  text: data.summary || "No summary available",
                  from: "other",
                },
              ]);
              localStorage.removeItem("temp_user_prompt");
              localStorage.removeItem("temp_selected_images");
            },
            onError: (error) => {
              console.error("❌ Workflow API error:", error);
            },
          }
        );
      } catch (err) {
        console.error("❌ Error determining intent:", err);
      }
    };

    runChatOrWorkflow();
  }, []); // Run once when component loads

  // Watch for chat trigger
  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (isChat && userInput && userId) {
      sendChat(
        { prompt: userInput },
        {
          onSuccess: (data) => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                text: data.response || "No summary available",
                from: "other",
              },
            ]);
          },
        }
      );
      setIsChat(false);
    }
  }, [isChat, userInput]);

  // After login success, run workflow again
  useEffect(() => {
    if (!isLoginRequired) return;

    const storedPrompt = localStorage.getItem("temp_user_prompt");
    const storedBase64Images = localStorage.getItem("temp_selected_images");
    const userId = localStorage.getItem("user_id");

    if (storedPrompt && storedBase64Images && userId) {
      const base64List: string[] = JSON.parse(storedBase64Images);
      const dataURLtoFile = (dataurl: string, filename: string): File => {
        const arr = dataurl.split(",");
        const mimeMatch = arr[0].match(/:(.*?);/);
        const mime = mimeMatch ? mimeMatch[1] : "";
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
      };

      const files = base64List.map((b64, i) =>
        dataURLtoFile(b64, `image${i}.jpg`)
      );

      createWorkflow(
        {
          userPrompt: storedPrompt,
          images: files,
          userId,
        },
        {
          onSuccess: (data) => {
            setMessages((prev) => [
              ...prev,
              {
                id: Date.now(),
                text: data.summary || "No summary available",
                from: "other",
              },
            ]);
            localStorage.removeItem("temp_user_prompt");
            localStorage.removeItem("temp_selected_images");
          },
          onError: (error) => {
            console.error("❌ Workflow API error:", error);
          },
        }
      );
    }
  }, [createWorkflow, isLoginRequired]);

  // Handle login redirect trigger
  const handleLogin = async () => {
    const storedPrompt = userInput;
    const convertToBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    const base64Images = await Promise.all(
      selectedImages.map((img) => convertToBase64(img))
    );

    localStorage.setItem("temp_user_prompt", storedPrompt);
    localStorage.setItem("temp_selected_images", JSON.stringify(base64Images));

    await triggerLogin(undefined, {
      onSuccess: (data) => {
        window.location.href = data.auth_url;
      },
      onError: (error) => {
        console.error("❌ Login API call failed:", error);
      },
    });
  };

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

  // Conditional rendering starts here
  if (isPending) {
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
                    textAlign="center"
                    boxSize={"20px"}
                  >
                    {IconComp}
                  </Box>
                ))}
              </motion.div>
            </Box>
          </Box>
        </VStack>
      </Flex>
    );
  }

  if (isIntentPending || isChatPending) {
    return (
      <Flex
        direction="column"
        h="81.5vh"
        maxW="90%"
        mx="auto"
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
              <Text fontFamily="Inter" fontSize="17px">
                {messages[0].text}
              </Text>
            </Box>
          </Flex>

          {/* Loading dots aligned like a bot message */}
          <Flex w="100%" justify="flex-start">
            <Box maxW="70%">
              <ChatLoadingDots />
            </Box>
          </Flex>
        </VStack>
      </Flex>
    );
  }

  if (isLoginRequired) {
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
                {msg.text
                  .split("\n")
                  .filter((line) => line.trim() !== "")
                  .map((line, idx) => (
                    <Text
                      key={idx}
                      fontFamily={msg.from === "me" ? "Inter" : ""}
                      fontSize={msg.from === "me" ? "17px" : "19px"}
                      mb={2}
                    >
                      {line}
                    </Text>
                  ))}
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
