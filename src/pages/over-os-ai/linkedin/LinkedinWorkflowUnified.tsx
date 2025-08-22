import { LoadingOverlay } from "@/components/LoadingOverlay";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { CalendarIcon, PlusIcon, SendIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { LinkedinLoginModal } from "./LinkedinLoginModal";
// import TaskStepsList from "./TaskStepList";
import CustomModal from "@/components/modals/CustomModal";
import Scheduler from "@/components/Scheduler";
import { useChatStore } from "@/store/chat-session.store";
import {
  useChat,
  useGetSessionChatMessages,
  useUpdateChatMessage,
} from "@/utils/apis/chat-sessions";
import {
  useCreateUserSchedules,
  useDeleteSchedule,
  useExtractSchedule,
  useOAuthInit,
  usePostToLinkedin,
  useToggleScheduleStatus,
} from "@/utils/apis/django.api";
import {
  getFullDayName,
  normalizeTimeTo24Hour,
} from "@/utils/helpers/functions.helper";
import { Switch, useDisclosure as useModalDisclosure } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useParams } from "react-router-dom";

const loadingMessages = [
  "Just a moment — we're working on something great for you…",
  "Hang tight, generating your content…",
  "Creating something worth sharing…",
  "We're writing this up for you…",
  "Putting your words together…",
  "One sec — we're making this sound amazing…",
  "Composing your message…",
  "Working on it — this won't take long…",
  "Giving your prompt the attention it deserves…",
  "Almost there — polishing your response…",
];

const LOCAL_STORAGE_KEYS = {
  prompt: "linkedin_prompt",
  response: "linkedin_response",
  imageUrls: "linkedin_image_urls",
};

const LinkedinWorkflowUnified = () => {
  const { sessionId } = useParams();
  const sessionIdNum = Number(sessionId);
  console.log(sessionId);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const generatedTextRef = useRef<HTMLTextAreaElement>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();
  const isLinkedinConnected = localStorage.getItem("is_linkedin_connected");

  // Zustand store
  const {
    sessions,
    setActiveSession,
    updateSessionData,
    setLoading,
    setLoadingMessage,
    setError,
    setGeneratedText,
    setUserPrompt: setStoreUserPrompt,
    updateScheduleData,
    updateManualScheduleData,
    setShowManualScheduler,
  } = useChatStore();

  // Get current session data from store
  const currentSession = sessions[sessionIdNum] || {
    loading: false,
    data: [],
    error: null,
    scheduleData: null,
    manualScheduleData: null,
    showManualScheduler: false,
    loadingMessage: null,
    lastUpdated: null,
  };

  // Local state derived from store
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedText, setLocalGeneratedText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [userMessageId, setUserMessageId] = useState<number | null>(null);
  const [generatedMessageId, setGeneratedMessageId] = useState<number | null>(
    null
  );
  const [scheduleStatus, setScheduleStatus] = useState<"active" | "inactive">(
    "active"
  );
  const [scheduleId, setScheduleId] = useState<string | null>(null);

  // Loading message rotation
  const loadingIndexRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  // API hooks
  const { mutate: generatePrompt } = useChat(sessionIdNum);
  const { mutate: publishPost, isPending: isPublishing } = usePostToLinkedin();
  const { mutate: extractSchedule } = useExtractSchedule();
  const { mutate: createUserSchedules } = useCreateUserSchedules();
  const { mutate: deleteSchedule } = useDeleteSchedule();
  const { mutate: updateChatMessage } = useUpdateChatMessage();
  const { mutate: toggleScheduleStatus } = useToggleScheduleStatus();
  const { refetch, isFetching } = useOAuthInit();

  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useModalDisclosure();

  const {
    data: SessionData,
    // isLoading,
    refetch: refetchSessionData,
  } = useGetSessionChatMessages(sessionId!);

  const ChatSessionData = SessionData?.messages;
  const ScheduleData = SessionData?.schedules[0];

  // Initialize session in store when component mounts
  useEffect(() => {
    if (sessionIdNum && !sessions[sessionIdNum]) {
      setActiveSession(sessionIdNum);
      updateSessionData(sessionIdNum, {
        loading: false,
        data: [],
        error: null,
        scheduleData: null,
        manualScheduleData: null,
        showManualScheduler: false,
        loadingMessage: null,
        lastUpdated: Date.now(),
      });
    }
  }, [sessionIdNum, sessions, setActiveSession, updateSessionData]);

  // Sync local state with store
  useEffect(() => {
    if (currentSession) {
      const userMessage = currentSession.data.find(
        (msg) => msg.message_type === "user"
      );
      const systemMessage = currentSession.data.find(
        (msg) => msg.message_type === "system"
      );

      setUserPrompt(userMessage?.content || "");
      setLocalGeneratedText(systemMessage?.content || "");
    }
  }, [currentSession]);

  // Handle initial textarea height when component mounts or userPrompt changes
  useEffect(() => {
    if (textareaRef.current && userPrompt) {
      const textarea = textareaRef.current;
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    }
  }, [userPrompt]);

  useEffect(() => {
    if (generatedTextRef.current) {
      generatedTextRef.current.style.height = "auto";
      generatedTextRef.current.style.height = `${generatedTextRef.current.scrollHeight}px`;
    }
  }, [generatedText]);

  // Load existing session data from API
  useEffect(() => {
    if (ChatSessionData && ChatSessionData.length > 0) {
      const latestUser = [...ChatSessionData].find(
        (msg) => msg.message_type === "user"
      );
      const latestSystem = [...ChatSessionData].find(
        (msg) => msg.message_type === "system"
      );

      setUserPrompt(latestUser?.content || "");
      setLocalGeneratedText(latestSystem?.content || "");
      setUserMessageId(latestUser?.id || null);
      setGeneratedMessageId(latestSystem?.id || null);

      // Update store with existing data
      if (sessionIdNum) {
        updateSessionData(sessionIdNum, {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: ChatSessionData.map((msg: any) => ({
            id: msg.id.toString(),
            content: msg.content,
            message_type: msg.message_type,
            timestamp: msg.created_at,
          })),
          lastUpdated: Date.now(),
        });
      }

      // Set existing schedule
      if (ScheduleData) {
        const formatted = {
          frequency: ScheduleData.frequency,
          days_of_week: ScheduleData.days_of_week,
          time_of_day: ScheduleData.time_of_day,
          timezone:
            ScheduleData.timezone ||
            Intl.DateTimeFormat().resolvedOptions().timeZone,
          end_date: ScheduleData.end_date || undefined,
        };
        updateScheduleData(sessionIdNum, formatted);
        setScheduleId(ScheduleData.id || null);
      }
    }
  }, [
    ChatSessionData,
    ScheduleData,
    sessionIdNum,
    updateSessionData,
    updateScheduleData,
  ]);

  // Handle auto-generation for first-time sessions
  const autoGenerateIfFirstTime = () => {
    const firstTime = localStorage.getItem("linkedin_first_time");
    const storedPrompt = localStorage.getItem("linkedin_prompt");
    const showManualSchedule = localStorage.getItem("linkedin_manual_schedule");
    const storedScheduleData = localStorage.getItem("linkedin_schedule_data");

    console.log("autoGenerateIfFirstTime called:", {
      firstTime,
      storedPrompt,
      sessionIdNum,
      showManualSchedule,
      storedScheduleData,
    });

    if (firstTime && storedPrompt && sessionIdNum) {
      console.log("Setting up auto-generation with prompt:", storedPrompt);
      setUserPrompt(storedPrompt);
      setStoreUserPrompt(sessionIdNum, storedPrompt);

      // Load manual schedule data if it exists
      if (showManualSchedule === "true" && storedScheduleData) {
        try {
          const scheduleData = JSON.parse(storedScheduleData);
          console.log("Loading manual schedule data:", scheduleData);
          updateManualScheduleData(sessionIdNum, scheduleData);
          setShowManualScheduler(sessionIdNum, true);
        } catch (error) {
          console.error("Error parsing stored schedule data:", error);
        }
      }

      setTimeout(() => {
        console.log("Calling handleGenerate with prompt:", storedPrompt);
        handleGenerate(storedPrompt);
        localStorage.removeItem("linkedin_first_time");
        localStorage.removeItem("linkedin_manual_schedule");
        localStorage.removeItem("linkedin_schedule_data");
      }, 200);
    }
  };

  useEffect(() => {
    autoGenerateIfFirstTime();
  }, [sessionIdNum]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = (prompt?: string) => {
    const finalPrompt = prompt || userPrompt;

    console.log("handleGenerate called with:", {
      prompt,
      userPrompt,
      finalPrompt,
    });

    if (!finalPrompt.trim()) {
      console.log("No prompt provided, returning early");
      return;
    }

    // Update store
    setStoreUserPrompt(sessionIdNum, finalPrompt);
    setLoading(sessionIdNum, true);

    // Start loading message rotation
    loadingIndexRef.current = 0;
    setLoadingMessage(sessionIdNum, loadingMessages[0]);
    intervalRef.current = setInterval(() => {
      loadingIndexRef.current =
        (loadingIndexRef.current + 1) % loadingMessages.length;
      setLoadingMessage(sessionIdNum, loadingMessages[loadingIndexRef.current]);
    }, 3500);

    // Update user message in API if it exists
    if (userMessageId) {
      updateChatMessage({
        messageId: userMessageId,
        session: sessionIdNum,
        message: finalPrompt,
      });
    }

    console.log("Making generatePrompt API call with:", finalPrompt);
    const currentSessionId = sessionIdNum; // Capture current session ID
    generatePrompt(
      {
        message: finalPrompt,
      },
      {
        onSuccess: (data) => {
          console.log("data", data);
          clearInterval(intervalRef.current!);
          setLoading(currentSessionId, false);
          setLoadingMessage(currentSessionId, null);

          if (data.data === null) {
            setError(
              currentSessionId,
              "Post generation failed. Try writing something more specific."
            );
            toast({
              title: "Post Generation Failed",
              description:
                "Try writing something more specific — like what topic you want to post about, your audience, or the tone you're going for.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
            return;
          }

          if (data.data.content) {
            setGeneratedText(currentSessionId, data.data.content);

            // Update system message in API if it exists
            if (generatedMessageId) {
              updateChatMessage({
                messageId: generatedMessageId,
                session: currentSessionId,
                message: data.data.content,
              });
            }

            localStorage.setItem(LOCAL_STORAGE_KEYS.prompt, finalPrompt);
            localStorage.setItem(
              LOCAL_STORAGE_KEYS.response,
              data.data.content
            );
          } else {
            setError(
              currentSessionId,
              "Post generation failed. Try writing something more specific."
            );
            toast({
              title: "Post Generation Failed",
              description:
                "Try writing something more specific — like what topic you want to post about, your audience, or the tone you're going for.",
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          }
        },
        onError: () => {
          clearInterval(intervalRef.current!);
          setLoading(currentSessionId, false);
          setLoadingMessage(currentSessionId, null);
          setError(
            currentSessionId,
            "Post generation failed. Try writing something more specific."
          );
          toast({
            title: "Post Generation Failed",
            description:
              "Try writing something more specific — like what topic you want to post about, your audience, or the tone you're going for.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );

    extractSchedule(finalPrompt, {
      onSuccess: (data) => {
        if (data.data.day_of_week !== null) {
          const scheduleData = {
            frequency: data.data.frequency,
            days_of_week: [data.data.day_of_week],
            time_of_day: data.data.time_of_day,
            end_date: data.data.end_date,
          };
          updateScheduleData(sessionIdNum, scheduleData);
        } else {
          updateScheduleData(sessionIdNum, null);
        }
      },
      onError: () => {
        console.log("error");
      },
    });
  };

  const handleSubmit = () => {
    if (!isLinkedinConnected) return onOpen();
    if (!userPrompt.trim() || !generatedText.trim()) {
      toast({
        title: "Missing Data",
        description: "Prompt and generated post text are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    publishPost(generatedText, {
      onSuccess: () => {
        toast({
          title: "Success!",
          description: "Post successfully published to LinkedIn.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        localStorage.removeItem(LOCAL_STORAGE_KEYS.prompt);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.response);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.imageUrls);
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        console.log("error", error.response.data.message);
        toast({
          title: "Error",
          description: "Failed to publish post.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        if (error.response.data.message === "No LinkedIn account connected.") {
          onOpen();
        }
      },
    });
  };

  const handleSchedule = () => {
    if (!isLinkedinConnected) return onOpen();
    if (!currentSession.scheduleData) return;

    if (!currentSession.scheduleData || !generatedText.trim()) {
      toast({
        title: "Missing Data",
        description: "Schedule and generated post text are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedSchedules = {
      frequency: currentSession.scheduleData.frequency,
      days_of_week:
        currentSession.scheduleData.days_of_week.map(getFullDayName),
      time_of_day: normalizeTimeTo24Hour(
        currentSession.scheduleData.time_of_day
      ),
      timezone:
        currentSession.scheduleData.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      end_date: currentSession.scheduleData.end_date
        ? new Date(currentSession.scheduleData.end_date)
            .toISOString()
            .split("T")[0]
        : undefined,
      chat_session: sessionIdNum,
      flag: 1 as const,
    };

    createUserSchedules(
      {
        prompt: userPrompt,
        ...formattedSchedules,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Post successfully scheduled to LinkedIn.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to schedule post.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

  const handleManualSchedule = () => {
    if (!isLinkedinConnected) return onOpen();
    if (!currentSession.manualScheduleData) return;

    if (!currentSession.manualScheduleData || !generatedText.trim()) {
      toast({
        title: "Missing Data",
        description: "Schedule and generated post text are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const formattedSchedules = {
      frequency: currentSession.manualScheduleData.frequency,
      days_of_week:
        currentSession.manualScheduleData.days_of_week.map(getFullDayName),
      time_of_day: normalizeTimeTo24Hour(
        currentSession.manualScheduleData.time_of_day
      ),
      timezone:
        currentSession.manualScheduleData.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone,
      end_date: currentSession.manualScheduleData.end_date
        ? new Date(currentSession.manualScheduleData.end_date)
            .toISOString()
            .split("T")[0]
        : undefined,
      chat_session: sessionIdNum,
      flag: 1 as const,
    };

    createUserSchedules(
      {
        prompt: userPrompt,
        ...formattedSchedules,
      },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Post successfully scheduled to LinkedIn.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
        },
        onError: () => {
          toast({
            title: "Error",
            description: "Failed to schedule post.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
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
      "I'm Your Personalized Linkedin Agent",
    ],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
  });

  return (
    <Box
      maxW="1260px"
      mx="auto"
      py={16}
      px={[0, 6]}
      backdropFilter="blur(16px)"
      borderRadius="xl"
      position="relative"
    >
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

        {/* Image Previews */}
        {selectedImages.length > 0 && (
          <Flex mt={-2} gap={3} flexWrap="wrap" justify="flex-start">
            {selectedImages.map((file, index) => (
              <Box
                key={index}
                position="relative"
                w="60px"
                h="60px"
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

        {/* Prompt Input + Generate */}
        <Flex direction="column" gap={3}>
          {/* <Text fontSize="sm" color="mutedText">
                Please let me know what would you like to write about
            </Text> */}
          <Box position="relative">
            <Textarea
              placeholder="Please let me know what would you like to write about..."
              variant="unstyled"
              fontSize={{ md: "lg", base: "sm" }}
              fontWeight="medium"
              resize="none"
              overflow="hidden"
              padding="0"
              paddingRight="3rem"
              lineHeight="1.5"
              height="auto"
              minH="1.5rem"
              maxH="6rem"
              border="none"
              borderBottom="2px solid"
              borderColor="accent"
              borderRadius="0"
              _placeholder={{
                color: "gray.500",
                lineHeight: "1.5",
              }}
              _focus={{
                borderColor: "primary",
                boxShadow: "none",
              }}
              value={userPrompt}
              onChange={(e) => {
                setUserPrompt(e.target.value);
                setStoreUserPrompt(sessionIdNum, e.target.value);
                e.currentTarget.style.height = "auto";
                e.currentTarget.style.height = `${Math.min(
                  e.currentTarget.scrollHeight,
                  6 * 16
                )}px`;
              }}
              color="text"
              ref={textareaRef}
              rows={1}
            />
            {/* <IconButton
              icon={<Upload size={16} />}
              aria-label="Upload images"
              size="sm"
              position="absolute"
              right="0"
              top="50%"
              transform="translateY(-50%)"
              bg="transparent"
              color={iconColor}
              _hover={{ bg: "transparent" }}
              onClick={() => fileInputRef.current?.click()}
            /> */}
            <Input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            {selectedImages.length > 0 && (
              <Text color="mutedText" fontSize="sm" mt={2}>
                {selectedImages.length} image
                {selectedImages.length > 1 ? "s" : ""} selected
              </Text>
            )}
          </Box>

          <Flex justify="flex-end" gap={3}>
            <Button
              bg={
                currentSession.showManualScheduler
                  ? "brand.400"
                  : "surfaceButton"
              }
              display={"flex"}
              gap={2}
              color="white"
              _hover={{ bg: "brand.400" }}
              size={{ md: "md", base: "xs" }}
              onClick={() =>
                setShowManualScheduler(
                  sessionIdNum,
                  !currentSession.showManualScheduler
                )
              }
            >
              <Box as="span" mb={"-2px"}>
                <RiCalendarScheduleLine />
              </Box>
              Schedule{" "}
            </Button>
            <Button
              onClick={() => handleGenerate()}
              isLoading={currentSession.loading}
              bg="surfaceButton"
              color="white"
              _hover={{ bg: "brand.400" }}
              size={{ md: "md", base: "xs" }}
              leftIcon={<SendIcon size={14} />}
            >
              Generate
            </Button>
          </Flex>

          {!currentSession.scheduleData &&
            currentSession.showManualScheduler && (
              <Scheduler
                data={currentSession.manualScheduleData}
                onScheduleChange={(updatedData) => {
                  updateManualScheduleData(sessionIdNum, updatedData);
                }}
              />
            )}

          {currentSession.loading ||
            (ScheduleData && generatedText && (
              <Box mt={4}>
                <Flex
                  justify="space-between"
                  align="center"
                  mb={4}
                  p={4}
                  bg="surface2"
                  borderRadius="md"
                >
                  <Box>
                    <Text fontWeight="medium" mb={{ md: 1, base: 3 }}>
                      Schedule Status
                    </Text>
                    <Flex align="center" gap={2}>
                      <Box
                        w="8px"
                        h="8px"
                        bg={
                          scheduleStatus === "active"
                            ? "green.500"
                            : "orange.500"
                        }
                        borderRadius="full"
                      />
                      <Text fontSize="sm">
                        {scheduleStatus === "active" ? "Active" : "Paused"}
                      </Text>
                    </Flex>
                  </Box>
                  <Flex gap={3} mb={{ md: 0, base: -8 }}>
                    <Flex align="center" gap={2}>
                      <Text fontSize="sm">
                        {scheduleStatus === "active" ? "Pause" : "Resume"} Agent
                      </Text>
                      <Switch
                        colorScheme="green"
                        isChecked={scheduleStatus === "active"}
                        onChange={(e) => {
                          const newStatus = e.target.checked
                            ? "active"
                            : "inactive";
                          setScheduleStatus(newStatus);
                          if (scheduleId) {
                            toggleScheduleStatus(
                              { id: scheduleId, status: newStatus },
                              {
                                onSuccess: () => {
                                  console.log(
                                    "Schedule status toggled successfully"
                                  );
                                },
                                onError: () => {
                                  console.log(
                                    "Failed to toggle schedule status"
                                  );
                                  // Revert the status if the API call fails
                                  setScheduleStatus(
                                    newStatus === "active"
                                      ? "inactive"
                                      : "active"
                                  );
                                },
                              }
                            );
                          }
                        }}
                      />
                    </Flex>
                    <IconButton
                      aria-label="Delete schedule"
                      icon={<FiTrash2 size={16} />}
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={onDeleteModalOpen}
                    />
                  </Flex>
                </Flex>
                <Scheduler
                  data={currentSession.scheduleData}
                  onScheduleChange={(updatedData) => {
                    updateScheduleData(sessionIdNum, updatedData);
                  }}
                  id={scheduleId!}
                  prompt={userPrompt}
                  showUpdateButton={true}
                  refetchSessionData={refetchSessionData}
                />
              </Box>
            ))}

          {/* Show scheduler without status bar when there's extracted schedule data but no saved schedule */}
          {!ScheduleData && currentSession.scheduleData && generatedText && (
            <Scheduler
              data={currentSession.scheduleData}
              onScheduleChange={(updatedData) => {
                updateScheduleData(sessionIdNum, updatedData);
              }}
            />
          )}

          {currentSession.loading && currentSession.loadingMessage && (
            <LoadingOverlay message={currentSession.loadingMessage} />
          )}
        </Flex>

        {/* Generated Text Area */}
        {generatedText && (
          <Box
            mb={-16}
            mr={2}
            zIndex={2}
            display={"flex"}
            alignItems={"center"}
            justifyContent={"flex-end"}
            gap={2}
            fontSize={"12px"}
            color="gray.500"
            fontStyle="italic"
          >
            Edit Post
            {/* <EditIcon size={14} /> */}
          </Box>
        )}
        {generatedText && (
          <Textarea
            ref={generatedTextRef}
            value={generatedText}
            onChange={(e) => {
              setLocalGeneratedText(e.target.value);
              setGeneratedText(sessionIdNum, e.target.value);
            }}
            placeholder="AI-generated post will appear here"
            fontSize="md"
            bg="surface2"
            minHeight="180px"
            pt={4}
            color="text"
            resize="none"
            border="1px solid"
            borderColor="#292929"
            overflow="hidden"
            _placeholder={{ color: "gray.500" }}
            _focus={{
              border: "1px solid",
              borderColor: "primary",
              boxShadow: "none",
            }}
          />
        )}

        {/* Submit */}
        {generatedText && !ScheduleData && (
          <Flex justify="flex-end" gap={2}>
            <Button
              onClick={handleSubmit}
              bg={
                currentSession.manualScheduleData || currentSession.scheduleData
                  ? "surface2"
                  : "primary"
              }
              color="white"
              isLoading={isPublishing}
              _hover={{ bg: "gray.600" }}
              leftIcon={<SendIcon size={15} />}
            >
              {currentSession.manualScheduleData || currentSession.scheduleData
                ? "Post Now"
                : "Post to LinkedIn"}
            </Button>
            {(currentSession.manualScheduleData ||
              currentSession.scheduleData) && (
              <Button
                onClick={
                  currentSession.manualScheduleData
                    ? handleManualSchedule
                    : handleSchedule
                }
                bg="primary"
                color="white"
                _hover={{ bg: "brand.400" }}
                leftIcon={<CalendarIcon size={16} />}
                isLoading={isPublishing}
                isDisabled={isPublishing}
              >
                Schedule Post
              </Button>
            )}
          </Flex>
        )}
      </VStack>

      <CustomModal
        isOpen={isDeleteModalOpen}
        onClose={onDeleteModalClose}
        onSubmit={() => {
          if (scheduleId) {
            deleteSchedule(scheduleId, {
              onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["chat-sessions"] });
                updateScheduleData(sessionIdNum, null);
                setScheduleId(null);
                onDeleteModalClose();
                toast({
                  title: "Success",
                  description: "Schedule deleted successfully.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              },
              onError: () => {
                toast({
                  title: "Error",
                  description: "Failed to delete schedule. Please try again.",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
                });
              },
            });
          }
        }}
        onCancel={onDeleteModalClose}
        header="Delete Schedule"
        submitText="Delete"
        cancelText="Cancel"
        submitButtonColor="red"
      >
        <Text>
          Do you want to delete the schedule for this agent? This will stop the
          agent's execution.
        </Text>
      </CustomModal>

      <LinkedinLoginModal
        isOpen={isOpen}
        onClose={onClose}
        onLogin={handleLogin}
        isPending={isFetching}
      />
    </Box>
  );
};

export default LinkedinWorkflowUnified;
