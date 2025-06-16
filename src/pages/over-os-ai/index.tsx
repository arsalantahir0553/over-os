import { useUserInput } from "@/context/useChatContext";
import {
  Box,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import DashboardWorkflows from "./DashboardWorkflows";

import { PiRankingThin } from "react-icons/pi";
import { AiOutlineProduct } from "react-icons/ai";
import { FiBookOpen, FiMonitor, FiTarget, FiTrendingUp } from "react-icons/fi";
import { useWorkflowCategories } from "@/utils/apis/workflow.api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Productivity Power Tools": AiOutlineProduct,
  "Thought Leadership Engine": FiBookOpen,
  "Instant Newsroom": FiMonitor,
  "Superfan Activation Kit": FiTrendingUp,
  "Founder's Starter Pack": FiTarget,
  "Ranking Rocket Pack": PiRankingThin,
};

const DashboardHome = () => {
  const { userInput, setUserInput, selectedImages, setSelectedImages } =
    useUserInput();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatPrompt = localStorage.getItem("chat_prompt");
  const [isDone, setIsDone] = useState(false);
  const [text] = useTypewriter({
    words: ["Cursor For Growth Marketing", "Vibe Coding", "Vibe Marketing"],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
    onLoopDone: () => setIsDone(true),
  });

  const { data: categories = [] } = useWorkflowCategories();
  const topCategories = categories.slice(0, 5);

  useEffect(() => {
    if (chatPrompt) {
      setUserInput(chatPrompt);
      localStorage.removeItem("chat_prompt");
    }
  }, [chatPrompt, setUserInput]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (userInput.trim() !== "") {
        localStorage.setItem("runWorkflow", "true");
        navigate("/chat");
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const MotionText = motion(Text);
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.700", "accent");

  return (
    <Box
      maxW="1260px"
      mx="auto"
      py={16}
      px={[4, 6]}
      backdropFilter="blur(16px)"
      borderRadius="xl"
    >
      <VStack spacing={8} align="stretch">
        {/* Heading */}
        <Box textAlign="center">
          <MotionText
            fontSize={["4xl", "5xl"]}
            fontWeight="extrabold"
            fontFamily="Joan"
            letterSpacing="wide"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Box
              as="span"
              bgGradient="linear(to-r, primary, accent)"
              bgClip="text"
            >
              {text}
            </Box>
            <Box as="span" color="white">
              {isDone ? <Cursor cursorStyle="." /> : <Cursor cursorStyle="|" />}
            </Box>
          </MotionText>
        </Box>

        {/* Input + Upload */}
        <Box position="relative">
          <InputGroup>
            <Input
              placeholder="Tell me about your marketing goal..."
              variant="unstyled"
              fontSize="lg"
              borderRadius={"none"}
              fontWeight="medium"
              pb={1.5}
              borderBottom="2px"
              borderColor="accent"
              _placeholder={{ color: "gray.600" }}
              _focus={{
                borderColor: "primary",
                boxShadow: "0 1px 0 0 var(--chakra-colors-primary)",
              }}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyDown}
              pr="2.5rem"
              color="text"
            />
            <Box
              position="absolute"
              right="0"
              top="30%"
              transform="translateY(-50%)"
            >
              <Tooltip label="Upload images" rounded="md">
                <IconButton
                  icon={<Upload size={16} />}
                  aria-label="Upload"
                  size="sm"
                  bg={iconBg}
                  color={iconColor}
                  _hover={{ bg: iconHoverBg }}
                  onClick={() => fileInputRef.current?.click()}
                />
              </Tooltip>
            </Box>
          </InputGroup>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </Box>

        {/* Image Previews */}
        {selectedImages.length > 0 && (
          <Flex mt={2} gap={3} flexWrap="wrap">
            {selectedImages.map((file, index) => (
              <Box
                key={index}
                position="relative"
                w="50px"
                h="50px"
                borderRadius="md"
                overflow="hidden"
                boxShadow="0 0 0 1px var(--chakra-colors-accent)"
              >
                <Image
                  src={URL.createObjectURL(file)}
                  alt={`upload-${index}`}
                  boxSize="100%"
                  objectFit="cover"
                  border="1px solid"
                  borderColor="border"
                />
                <IconButton
                  icon={<PlusIcon style={{ transform: "rotate(45deg)" }} />}
                  size="xs"
                  position="absolute"
                  top="-6px"
                  right="-6px"
                  aria-label="Remove image"
                  onClick={() => removeImage(index)}
                  bg="red.500"
                  color="white"
                  borderRadius="full"
                  h="16px"
                  w="16px"
                  minW="16px"
                  zIndex={1}
                />
              </Box>
            ))}
          </Flex>
        )}

        <Flex justify="space-between" align="center" mt={-2}>
          <Tooltip label="Add New" rounded="md">
            <IconButton
              icon={<PlusIcon size={16} />}
              aria-label="Add"
              size="sm"
              bg={iconBg}
              color={iconColor}
              _hover={{ bg: iconHoverBg }}
            />
          </Tooltip>

          <Flex gap={4} wrap="wrap" justifyContent="center">
            {topCategories.map((cat, index) => {
              const Icon = categoryIcons[cat] ?? FiMonitor;
              return (
                <Box
                  key={index}
                  role="group" // important for group-hover effect
                  rounded="md"
                  boxShadow="sm"
                  bg={iconBg}
                  px={3}
                  py={2}
                  cursor="pointer"
                  _hover={{ bg: iconHoverBg }}
                  transition="all 0.2s"
                >
                  <Flex align="center" gap={2} zIndex={2}>
                    <Icon
                      size={18}
                      color="var(--chakra-colors-accent)"
                      style={{ transition: "color 0.2s" }}
                    />
                    <Text fontSize="sm" color="text" fontWeight="medium">
                      {cat}
                    </Text>
                  </Flex>
                </Box>
              );
            })}
          </Flex>

          <Tooltip label="Schedule" rounded="md">
            <IconButton
              icon={<Clock10Icon size={16} />}
              aria-label="Schedule"
              size="sm"
              bg={iconBg}
              color={iconColor}
              _hover={{ bg: iconHoverBg }}
            />
          </Tooltip>
        </Flex>

        {/* Trending Workflows */}
        <DashboardWorkflows />
      </VStack>
    </Box>
  );
};

export default DashboardHome;
