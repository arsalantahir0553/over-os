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
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import {
  CalendarIcon,
  EditIcon,
  PlusIcon,
  SendIcon,
  Upload,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { LinkedinLoginModal } from "./LinkedinLoginModal";
// import TaskStepsList from "./TaskStepList";
import CustomModal from "@/components/modals/CustomModal";
import Scheduler from "@/components/Scheduler";
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
} from "@/utils/apis/django.api";
import {
  getFullDayName,
  normalizeTimeTo24Hour,
} from "@/utils/helpers/functions.helper";
import type { ScheduleData } from "@/utils/types/types";
import { Switch, useDisclosure as useModalDisclosure } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import { RiCalendarScheduleLine } from "react-icons/ri";
import { useParams } from "react-router-dom";

const loadingMessages = [
  "Just a moment — we’re working on something great for you…",
  "Hang tight, generating your content…",
  "Creating something worth sharing…",
  "We’re writing this up for you…",
  "Putting your words together…",
  "One sec — we’re making this sound amazing…",
  "Composing your message…",
  "Working on it — this won’t take long…",
  "Giving your prompt the attention it deserves…",
  "Almost there — polishing your response…",
];

const LOCAL_STORAGE_KEYS = {
  prompt: "linkedin_prompt",
  response: "linkedin_response",
  imageUrls: "linkedin_image_urls",
};
//test
const LinkedinWorkflowBySession = () => {
  const { sessionId } = useParams();
  console.log(sessionId);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle initial textarea height when component mounts or userPrompt changes
  useEffect(() => {
    if (textareaRef.current && userPrompt) {
      const textarea = textareaRef.current;
      // Reset height to auto to get the correct scrollHeight for the content
      textarea.style.height = "auto";
      // Set the height to the scrollHeight, but not more than max height (6rem = 96px)
      textarea.style.height = `${Math.min(textarea.scrollHeight, 96)}px`;
    }
  }, [userPrompt]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [manualScheduleData, setManualScheduleData] =
    useState<ScheduleData | null>(null);
  const [isScheduleActive, setIsScheduleActive] = useState(true);
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useModalDisclosure();

  // Reset scheduler state when session changes
  useEffect(() => {
    setScheduleData(null);
    setManualScheduleData(null);
    setShowManualScheduler(false);
  }, [sessionId]);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const isLinkedinConnected = localStorage.getItem("is_linkedin_connected");
  const loadingIndexRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const generatedTextRef = useRef<HTMLTextAreaElement>(null);
  const [userMessageId, setUserMessageId] = useState<number | null>(null);
  const [showManualScheduler, setShowManualScheduler] = useState(false);
  const [generatedMessageId, setGeneratedMessageId] = useState<number | null>(
    null
  );
  const [scheduleId, setScheduleId] = useState<string | null>(null);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (generatedTextRef.current) {
      generatedTextRef.current.style.height = "auto";
      generatedTextRef.current.style.height = `${generatedTextRef.current.scrollHeight}px`;
    }
  }, [generatedText]);

  const { mutate: generatePrompt, isPending: isGenerating } = useChat();
  const { mutate: publishPost, isPending: isPublishing } = usePostToLinkedin();
  const { mutate: extractSchedule } = useExtractSchedule();
  const { mutate: createUserSchedules } = useCreateUserSchedules();
  const { mutate: deleteSchedule } = useDeleteSchedule();
  const { mutate: updateChatMessage } = useUpdateChatMessage();
  const { refetch, isFetching } = useOAuthInit();
  const queryClient = useQueryClient();
  // const navigate = useNavigate();

  const {
    data: SessionData,
    isLoading,
    refetch: refetchSessionData,
  } = useGetSessionChatMessages(sessionId!);

  const ChatSessionData = SessionData?.messages;
  const ScheduleData = SessionData?.schedules[0];

  useEffect(() => {
    if (ChatSessionData) {
      setUserPrompt(ChatSessionData[1]?.content || "");
      setGeneratedText(ChatSessionData[0]?.content || "");
      setUserMessageId(ChatSessionData[1]?.id || null);
      setGeneratedMessageId(ChatSessionData[0]?.id || null);
      console.log("ChatSessionData.schedules", ChatSessionData);

      // ✅ NEW: Set existing schedule into scheduleData state
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
        setScheduleData(formatted);
        setScheduleId(ScheduleData.id || null);
      }
    }
  }, [ChatSessionData]);

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;

    updateChatMessage({
      messageId: userMessageId!,
      session: Number(sessionId!),
      message: userPrompt,
    });

    loadingIndexRef.current = 0;
    setLoadingMessage(loadingMessages[0]);
    intervalRef.current = setInterval(() => {
      loadingIndexRef.current =
        (loadingIndexRef.current + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[loadingIndexRef.current]);
    }, 3500);

    generatePrompt(
      {
        session: Number(sessionId!),
        message: userPrompt,
      },
      {
        onSuccess: (data) => {
          console.log("data", data);
          if (data.data === null) {
            clearInterval(intervalRef.current!);
            setLoadingMessage(null);
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

          clearInterval(intervalRef.current!);
          setLoadingMessage(null);
          if (data.data.content) {
            updateChatMessage({
              messageId: generatedMessageId!,
              session: Number(sessionId!),
              message: data.data.content,
            });
            setGeneratedText(data.data.content);
            localStorage.setItem(LOCAL_STORAGE_KEYS.prompt, userPrompt);
            localStorage.setItem(
              LOCAL_STORAGE_KEYS.response,
              data.data.content
            );
          } else {
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
          setLoadingMessage(null);
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

    extractSchedule(userPrompt, {
      onSuccess: (data) => {
        if (data.data.day_of_week !== null) {
          setScheduleData({
            frequency: data.data.frequency,
            days_of_week: [data.data.day_of_week],
            time_of_day: data.data.time_of_day,
            end_date: data.data.end_date,
          });
        } else {
          setScheduleData(null);
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
    if (!scheduleData) return;

    if (!scheduleData || !generatedText.trim()) {
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
      frequency: scheduleData.frequency,
      days_of_week: scheduleData.days_of_week.map(getFullDayName),
      time_of_day: normalizeTimeTo24Hour(scheduleData.time_of_day),
      timezone: scheduleData.timezone,
      end_date: scheduleData.end_date,
      chat_session: Number(sessionId!),
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
    if (!manualScheduleData) return;

    if (!manualScheduleData || !generatedText.trim()) {
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
      frequency: manualScheduleData.frequency,
      days_of_week: manualScheduleData.days_of_week.map(getFullDayName),
      time_of_day: normalizeTimeTo24Hour(manualScheduleData.time_of_day),
      timezone: manualScheduleData.timezone,
      end_date: manualScheduleData.end_date,
      chat_session: Number(sessionId!),
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

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const MotionText = motion(Text);
  const iconBg = useColorModeValue("gray.100", "gray.700");
  const iconHoverBg = useColorModeValue("gray.200", "gray.600");
  const iconColor = useColorModeValue("gray.700", "accent");

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

  // const handleSchedules = () => {
  //   navigate("/workflow/linkedin/schedules");
  // };

  if (isLoading) {
    return <LoadingOverlay message="" />;
  }

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
      {/* {isLinkedinConnected && (
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
      )} */}
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
          <Text fontSize="sm" color="mutedText">
            Please let me know what would you like to write about
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
            ref={textareaRef}
            rows={1} // Start with 1 visible row
          />

          <Flex justify="space-between" gap={3}>
            <Button
              bg={showManualScheduler ? "brand.400" : "surfaceButton"}
              display={"flex"}
              gap={2}
              color="white"
              _hover={{ bg: "brand.400" }}
              size={{ md: "md", base: "xs" }}
              onClick={() => setShowManualScheduler((prev) => !prev)}
            >
              Schedule{" "}
              <Box as="span" mb={"-2px"}>
                <RiCalendarScheduleLine />
              </Box>
            </Button>
            <Box display={"flex"} gap={2}>
              <Flex gap={2} align="center">
                <Tooltip label="Upload images" rounded="md">
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
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                {selectedImages.length > 0 && (
                  <Text color="mutedText" fontSize="sm">
                    {selectedImages.length} image
                    {selectedImages.length > 1 ? "s" : ""} selected
                  </Text>
                )}
              </Flex>
              <Button
                onClick={handleGenerate}
                isLoading={isGenerating}
                bg="surfaceButton"
                color="white"
                _hover={{ bg: "brand.400" }}
                size={{ md: "md", base: "xs" }}
              >
                Generate
              </Button>
            </Box>
          </Flex>

          {!scheduleData && showManualScheduler && (
            <Scheduler
              data={manualScheduleData}
              onScheduleChange={(updatedData) => {
                setManualScheduleData(updatedData);
              }}
            />
          )}

          {isGenerating ||
            (scheduleData && generatedText && (
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
                    <Text fontWeight="medium" mb={1}>
                      Schedule Status
                    </Text>
                    <Flex align="center" gap={2}>
                      <Box
                        w="8px"
                        h="8px"
                        bg={isScheduleActive ? "green.500" : "orange.500"}
                        borderRadius="full"
                      />
                      <Text fontSize="sm">
                        {isScheduleActive ? "Active" : "Paused"}
                      </Text>
                    </Flex>
                  </Box>
                  <Flex gap={3}>
                    <Flex align="center" gap={2}>
                      <Text fontSize="sm">
                        {isScheduleActive ? "Pause" : "Resume"} Schedule
                      </Text>
                      <Switch
                        colorScheme="green"
                        isChecked={isScheduleActive}
                        onChange={(e) => setIsScheduleActive(e.target.checked)}
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
                  data={scheduleData}
                  onScheduleChange={(updatedData) => {
                    setScheduleData(updatedData);
                  }}
                  id={scheduleId!}
                  prompt={userPrompt}
                  showUpdateButton={true}
                  refetchSessionData={refetchSessionData}
                />
              </Box>
            ))}

          {/* ================================================== */}
          {/* steps  */}
          {/* <TaskStepsList /> */}
          {/* ================================================== */}

          {isGenerating && loadingMessage && (
            <LoadingOverlay message={loadingMessage} />
          )}
        </Flex>

        {/* Generated Text Area */}
        {generatedText && (
          <Box
            mb={-10}
            zIndex={2}
            display={"flex"}
            alignItems={"center"}
            gap={2}
            fontSize={"12px"}
          >
            {" "}
            Edit Post
            <EditIcon size={14} />
          </Box>
        )}
        {generatedText && (
          <Textarea
            ref={generatedTextRef}
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
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
        {generatedText && !scheduleData && (
          <Flex justify="flex-end" gap={2}>
            <Button
              onClick={handleSubmit}
              bg={manualScheduleData ? "surface2" : "primary"}
              color="white"
              isLoading={isPublishing}
              _hover={{ bg: "gray.600" }}
              leftIcon={<SendIcon size={15} />}
            >
              {manualScheduleData ? "Post Now" : "Post to LinkedIn"}
            </Button>
            {manualScheduleData && (
              <Button
                onClick={
                  manualScheduleData ? handleManualSchedule : handleSchedule
                }
                bg="primary"
                color="white"
                isLoading={isPublishing}
                _hover={{ bg: "brand.400" }}
                leftIcon={<CalendarIcon size={16} />}
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
                setScheduleData(null);
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
          Are you sure you want to delete this schedule? This action cannot be
          undone.
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

export default LinkedinWorkflowBySession;
