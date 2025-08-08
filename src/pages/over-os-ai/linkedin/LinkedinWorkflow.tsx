import {
  Box,
  Button,
  Flex,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { ListChecks } from "lucide-react";
import { useEffect, useState } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { LinkedinLoginModal } from "./LinkedinLoginModal";
// import TaskStepsList from "./TaskStepList";
import { useChatSession } from "@/context/ChatSessionContext";
import { useCreateChatSession } from "@/utils/apis/chat-sessions";
import { useOAuthInit } from "@/utils/apis/django.api";
import { useQueryClient } from "@tanstack/react-query";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import Scheduler, { type ScheduleData } from "@/components/Scheduler";

const LOCAL_STORAGE_KEYS = {
  prompt: "linkedin_prompt",
  firstTime: "linkedin_first_time",
  manualSchedule: "linkedin_manual_schedule",
  scheduleData: "linkedin_schedule_data",
};

const LinkedinWorkflow = () => {
  // const fileInputRef = useRef<HTMLInputElement>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: createChatSession } = useCreateChatSession();
  const { activeSessionId, setActiveSessionId } = useChatSession();
  const { refetch, isFetching } = useOAuthInit();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const isLinkedinConnected = localStorage.getItem("is_linkedin_connected");
  const [showScheduler, setShowScheduler] = useState(false);
  const [scheduleData, setScheduleData] = useState<ScheduleData[]>([]);

  useEffect(() => {
    const savedPrompt = localStorage.getItem(LOCAL_STORAGE_KEYS.prompt);

    if (savedPrompt) setUserPrompt(savedPrompt);

    localStorage.removeItem(LOCAL_STORAGE_KEYS.prompt);
  }, []);

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;

    if (!isLinkedinConnected) return onOpen();

    localStorage.setItem(LOCAL_STORAGE_KEYS.prompt, userPrompt);
    localStorage.setItem(LOCAL_STORAGE_KEYS.firstTime, "true");
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.manualSchedule,
      showScheduler.toString()
    );
    localStorage.setItem(
      LOCAL_STORAGE_KEYS.scheduleData,
      JSON.stringify(scheduleData)
    );

    createChatSession(userPrompt, {
      onSuccess: (data) => {
        console.log("chat session created:", data.data);
        setActiveSessionId(data.data.id);
        queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        navigate(`/workflow/linkedin/n/${data.data.id}`);
      },
      onError: (error) => {
        console.error("chat session creation failed", error);
      },
    });

    console.log("activeSessionId", activeSessionId);
  };

  const handleLogin = async () => {
    try {
      const { data } = await refetch();
      const originalUrl = data?.data.auth_url || data?.url;
      if (originalUrl) window.location.href = originalUrl;
    } catch (err) {
      console.error("Failed to fetch LinkedIn auth URL:", err);
    }
  };

  const MotionText = motion(Text);
  // const iconBg = useColorModeValue("gray.100", "gray.700");
  // const iconHoverBg = useColorModeValue("gray.200", "gray.600");
  // const iconColor = useColorModeValue("gray.700", "accent");

  const [typewriterText] = useTypewriter({
    words: [
      "Boost your reach",
      "AI for Thought Leadership",
      "Post on LinkedIn",
    ],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
  });

  const handleSchedules = () => {
    navigate("/workflow/linkedin/schedules");
  };

  return (
    <Box
      maxW="1260px"
      // h="100vh"
      mx="auto"
      py={16}
      px={[0, 6]}
      backdropFilter="blur(16px)"
      borderRadius="xl"
      position="relative"
    >
      {isLinkedinConnected && (
        <Button
          position="absolute"
          fontSize={{ base: "10px", md: "sm" }}
          top={{ base: "0", md: "-2" }}
          right={{ base: "0", md: "5" }}
          onClick={handleSchedules}
          leftIcon={<ListChecks size={18} color="#00FFF7" />}
          border={"1px solid rgba(0, 255, 247, 0.35)"}
          size={{ base: "xs", md: "sm" }}
        >
          My Schedules
        </Button>
      )}
      <VStack spacing={10} align="stretch">
        {/* Heading */}
        <Box textAlign="center">
          <MotionText
            fontSize={["2xl", "5xl"]}
            fontWeight="extrabold"
            fontFamily="Joan"
            letterSpacing="wide"
          >
            <Box
              as="span"
              bgGradient="linear(to-r, primary, accent)"
              bgClip="text"
            >
              {typewriterText}
            </Box>
            <Box as="span" color="white">
              <Cursor cursorStyle="|" />
            </Box>
          </MotionText>
        </Box>

        {/* Prompt Input + Generate */}
        <Flex direction="column" gap={3}>
          <Text fontSize="sm" color="mutedText">
            What would you like to post about?
          </Text>
          <Textarea
            placeholder="Tell me about your marketing goal..."
            variant="unstyled"
            fontSize={{ md: "lg", base: "sm" }}
            fontWeight="medium"
            resize="none"
            overflow="hidden"
            padding="0"
            lineHeight="1.5"
            height="auto"
            minH="1.5rem" // Single line initial height
            maxH="6rem" // Maximum height before scrolling
            border="none"
            borderBottom="2px solid"
            borderColor="accent"
            borderRadius="0"
            _placeholder={{
              color: "gray.600",
              lineHeight: "1.5",
            }}
            _focus={{
              borderColor: "primary",
              boxShadow: "none",
            }}
            value={userPrompt}
            onChange={(e) => {
              setUserPrompt(e.target.value);
              // Auto-expand logic:
              e.currentTarget.style.height = "auto";
              e.currentTarget.style.height = `${Math.min(
                e.currentTarget.scrollHeight,
                6 * 16 // 6rem in pixels (adjust based on your font size)
              )}px`;
            }}
            color="text"
            pr="2.5rem"
            rows={1} // Start with 1 visible row
          />

          <Flex justify="space-between" gap={3}>
            <Box
              display={"flex"}
              gap={2}
              w={"full"}
              justifyContent={"space-between"}
            >
              <Flex gap={2} align="center">
                <Button
                  bg={showScheduler ? "brand.400" : "surfaceButton"}
                  display={"flex"}
                  gap={2}
                  color="white"
                  _hover={{ bg: "brand.400" }}
                  size={{ md: "md", base: "xs" }}
                  onClick={() => setShowScheduler((prev) => !prev)}
                >
                  Schedule{" "}
                  <Box as="span" mb={"-2px"}>
                    <RiCalendarScheduleLine />
                  </Box>
                </Button>
                {/* <Tooltip label="Upload images" rounded="md">
                  <IconButton
                    icon={<Upload size={16} />}
                    aria-label="Upload"
                    size={{ md: "sm", base: "xs" }}
                    bg={iconBg}
                    color={iconColor}
                    _hover={{ bg: iconHoverBg }}
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Tooltip>
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  ref={fileInputRef}
                  style={{ display: "none" }}
                />*/}
              </Flex>
              <Button
                onClick={handleGenerate}
                bg="surfaceButton"
                color="white"
                _hover={{ bg: "brand.400" }}
                size={{ md: "md", base: "xs" }}
              >
                Generate
              </Button>
            </Box>
          </Flex>
        </Flex>
        {showScheduler && (
          <Scheduler
            data={scheduleData}
            onScheduleChange={(updatedData: ScheduleData[]) => {
              setScheduleData(updatedData);
            }}
          />
        )}
      </VStack>
      <LinkedinLoginModal
        isOpen={isOpen}
        onClose={onClose}
        onLogin={handleLogin}
        isPending={isFetching}
      />
    </Box>
  );
};

export default LinkedinWorkflow;
