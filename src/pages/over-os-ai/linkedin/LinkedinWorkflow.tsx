import {
  useGenerateLinkedinPrompt,
  useGetLinkedinAuthUrl,
  usePublishGeneratedPost,
} from "@/utils/apis/linkedin.api";
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
// import { useNavigate } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";
import { LinkedinLoginModal } from "./LinkedinLoginModal";

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
  const loadingIndexRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);
  const toast = useToast();
  // const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { mutate: generatePrompt, isPending: isGenerating } =
    useGenerateLinkedinPrompt();
  const { mutate: publishPost, isPending: isPublishing } =
    usePublishGeneratedPost();
  const { refetch, isFetching } = useGetLinkedinAuthUrl();

  // Load from localStorage on mount
  useEffect(() => {
    const id = localStorage.getItem("linkedin_user_id");
    if (!id) {
      // Don't redirect; just block publishing later
      setLinkedinUserId(null);
    } else {
      setLinkedinUserId(id);
    }

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
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleLogin = async () => {
    try {
      const { data } = await refetch();
      const originalUrl = data?.linkedin_login_url || data?.url;
      if (!originalUrl) return;
      window.location.href = originalUrl;
    } catch (err) {
      console.error("Failed to fetch LinkedIn auth URL:", err);
    }
  };

  const handleGenerate = () => {
    if (!userPrompt.trim()) return;

    if (!linkedinUserId) {
      onOpen();
      return;
    }

    loadingIndexRef.current = 0;
    setLoadingMessage(loadingMessages[0]);
    intervalRef.current = setInterval(() => {
      loadingIndexRef.current =
        (loadingIndexRef.current + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[loadingIndexRef.current]);
    }, 3500);

    generatePrompt(
      {
        user_id: linkedinUserId,
        user_prompt: userPrompt,
        image_files: selectedImages,
        urls: [],
      },
      {
        onSuccess: (data) => {
          clearInterval(intervalRef.current!);
          setLoadingMessage(null);
          const post = data.generated_posts?.[0];
          if (post) {
            const text = post.text || "";
            const image = post.image_path
              ? Array.isArray(post.image_path)
                ? post.image_path[0]
                : post.image_path
              : "";

            setGeneratedText(text);
            setImageUrls(image ? [image] : []);

            // Persist in localStorage
            localStorage.setItem(LOCAL_STORAGE_KEYS.prompt, userPrompt);
            localStorage.setItem(LOCAL_STORAGE_KEYS.response, text);
            localStorage.setItem(
              LOCAL_STORAGE_KEYS.imageUrls,
              JSON.stringify(image ? [image] : [])
            );
          }
        },
        onError: () => {
          clearInterval(intervalRef.current!);
          setLoadingMessage(null);
          toast({
            title: "AI Generation Failed",
            description: "Try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

  const handleSubmit = () => {
    if (!linkedinUserId) {
      onOpen();
      return;
    }

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

    publishPost(
      {
        user_id: linkedinUserId,
        user_prompt: userPrompt,
        post: {
          text: generatedText,
          image_path: imageUrls[0] || "",
          url: "",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Success!",
            description: "Post successfully published to LinkedIn.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          setUserPrompt("");
          setGeneratedText("");
          setSelectedImages([]);
          setImageUrls([]);
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
      }
    );
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
      h="100vh"
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
          <Flex justify="flex-end" gap={3}>
            <Flex gap={2} align="center">
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
              size={{ md: "md", base: "sm" }}
            >
              Generate
            </Button>
          </Flex>
          {isGenerating && loadingMessage && (
            <Text fontSize="sm" color="gray.400" mt={1}>
              {loadingMessage}
            </Text>
          )}
        </Flex>

        {/* Generated Text Area */}
        {generatedText && (
          <Textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="AI-generated post will appear here"
            fontSize="md"
            minHeight="180px"
            p={0}
            color="text"
            resize="none"
            border="none"
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
