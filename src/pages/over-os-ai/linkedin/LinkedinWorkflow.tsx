import { LoadingOverlay } from "@/components/LoadingOverlay";
import { useLoggedInUser } from "@/utils/apis/auth.api";
import { useCreateHistory } from "@/utils/apis/history.api";
import { queryClient } from "@/utils/apis/query.client";

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
import { PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { LinkedinLoginModal } from "./LinkedinLoginModal";
// import TaskStepsList from "./TaskStepList";
import {
  useChat,
  useOAuthInit,
  usePostToLinkedin,
} from "@/utils/apis/django.api";

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

const LinkedinWorkflow = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userPrompt, setUserPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [linkedinUserId, setLinkedinUserId] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const isLinkedinConnected = localStorage.getItem("is_linkedin_connected");
  const loadingIndexRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const toast = useToast();
  const { data: user } = useLoggedInUser();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const generatedTextRef = useRef<HTMLTextAreaElement>(null);
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
      generatedTextRef.current.style.height = "auto"; // Reset height
      generatedTextRef.current.style.height = `${generatedTextRef.current.scrollHeight}px`; // Set to full content height
    }
  }, [generatedText]);

  // const { mutate: generatePrompt, isPending: isGenerating } =
  //   useGenerateLinkedinPrompt();
  const { mutate: generatePrompt, isPending: isGenerating } = useChat();
  // const { mutate: publishPost, isPending: isPublishing } =
  //   usePublishGeneratedPost();
  const { mutate: publishPost, isPending: isPublishing } = usePostToLinkedin();
  // const { refetch, isFetching } = useGetLinkedinAuthUrl();
  const { refetch, isFetching } = useOAuthInit();

  const { mutate: createHistory } = useCreateHistory();

  useEffect(() => {
    const id = localStorage.getItem("linkedin_user_id");
    setLinkedinUserId(id || null);

    const savedPrompt = localStorage.getItem(LOCAL_STORAGE_KEYS.prompt);
    const savedResponse = localStorage.getItem(LOCAL_STORAGE_KEYS.response);
    const savedImageUrls = localStorage.getItem(LOCAL_STORAGE_KEYS.imageUrls);

    if (savedPrompt) setUserPrompt(savedPrompt);
    if (savedResponse) setGeneratedText(savedResponse);
    if (savedImageUrls) {
      try {
        const parsed = JSON.parse(savedImageUrls);
        if (Array.isArray(parsed)) setImageUrls(parsed);
      } catch {
        setImageUrls([]);
      }
    }

    localStorage.removeItem(LOCAL_STORAGE_KEYS.prompt);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.response);
    localStorage.removeItem(LOCAL_STORAGE_KEYS.imageUrls);
  }, []);

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;

    loadingIndexRef.current = 0;
    setLoadingMessage(loadingMessages[0]);
    intervalRef.current = setInterval(() => {
      loadingIndexRef.current =
        (loadingIndexRef.current + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[loadingIndexRef.current]);
    }, 3500);

    generatePrompt(userPrompt, {
      onSuccess: (data) => {
        console.log("data", data);
        if (data === null) {
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
        setGeneratedText(data.data.post_text);
        localStorage.setItem(LOCAL_STORAGE_KEYS.prompt, userPrompt);
        localStorage.setItem(LOCAL_STORAGE_KEYS.response, data.data.post_text);
        localStorage.setItem(LOCAL_STORAGE_KEYS.imageUrls, JSON.stringify([]));
        setImageUrls([]);
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

        createHistory(
          {
            user_id: user.id,
            prompt: userPrompt,
            generated_post: generatedText,
            image_url: imageUrls[0] || "",
            meta: JSON.stringify({
              source: "LinkedInWorkflow",
              timestamp: new Date().toISOString(),
            }),
          },
          {
            onSuccess: () => {
              queryClient.invalidateQueries({
                queryKey: ["user-history", user.id, 10, 0],
              });
            },
          }
        );

        localStorage.removeItem(LOCAL_STORAGE_KEYS.prompt);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.response);
        localStorage.removeItem(LOCAL_STORAGE_KEYS.imageUrls);
      },
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to publish post.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      },
    });
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
      "Post on LinkedIn",
    ],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
  });

  return (
    <Box
      maxW="1260px"
      // h="100vh"
      mx="auto"
      py={16}
      px={[0, 6]}
      backdropFilter="blur(16px)"
      borderRadius="xl"
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
          <Flex justify="end" gap={3}>
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
          <Textarea
            ref={generatedTextRef}
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="AI-generated post will appear here"
            fontSize="md"
            minHeight="180px"
            p={0}
            color="text"
            resize="none"
            border="none"
            overflow="hidden"
            _placeholder={{ color: "gray.500" }}
            _focus={{
              border: "none",
              boxShadow: "none",
            }}
          />
        )}

        {/* Submit */}
        {generatedText && (
          <Flex justify="flex-end">
            <Button
              onClick={handleSubmit}
              bg="primary"
              color="white"
              isLoading={isPublishing}
              _hover={{ bg: "brand.400" }}
            >
              Post to LinkedIn
            </Button>
          </Flex>
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
