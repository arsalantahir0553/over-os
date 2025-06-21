import {
  useGenerateLinkedinPrompt,
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
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const LinkedinWorkflow = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userPrompt, setUserPrompt] = useState(""); // initial short prompt
  const [generatedText, setGeneratedText] = useState(""); // full AI-generated text
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [linkedinUserId, setLinkedinUserId] = useState<string | null>(null);

  const toast = useToast();
  const navigate = useNavigate();

  const { mutate: generatePrompt, isPending: isGenerating } =
    useGenerateLinkedinPrompt();
  const { mutate: publishPost, isPending: isPublishing } =
    usePublishGeneratedPost();

  useEffect(() => {
    const id = localStorage.getItem("linkedin_user_id");
    if (!id) {
      navigate("/dashboard");
    } else {
      setLinkedinUserId(id);
    }
  }, [navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    setSelectedImages((prev) => [...prev, ...filesArray]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = () => {
    if (!linkedinUserId || !userPrompt.trim()) return;

    generatePrompt(
      {
        user_id: linkedinUserId,
        user_prompt: userPrompt,
        image_files: selectedImages,
        urls: [], // Extend if needed
      },
      {
        onSuccess: (data) => {
          const post = data.generated_posts?.[0];
          if (post) {
            setGeneratedText(post.text || "");

            const image = post.image_path
              ? Array.isArray(post.image_path)
                ? post.image_path[0]
                : post.image_path
              : "";

            // ✅ Log the actual image path for verification
            console.log("Image path from API:", image);

            setImageUrls([image]); // set properly here
          }
        },
        onError: () => {
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
    if (!linkedinUserId || !userPrompt.trim() || !generatedText.trim()) {
      toast({
        title: "Missing Data",
        description: "Prompt and generated post text are required.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    console.log("checking image Urls", imageUrls);

    publishPost(
      {
        user_id: linkedinUserId,
        user_prompt: userPrompt,
        post: {
          text: generatedText,
          image_path: imageUrls.length > 0 ? imageUrls[0] : "", // safe fallback
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
        },
        onError: (err) => {
          console.error(err);
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
      <VStack spacing={10} align="stretch">
        {/* Heading */}
        <Box textAlign="center">
          <MotionText
            fontSize={["4xl", "5xl"]}
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
          <Input
            placeholder="e.g. Share my full-stack development journey"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            variant="unstyled"
            borderBottom="2px"
            borderColor="accent"
            borderRadius={"0"}
            fontSize="lg"
            color="text"
            _placeholder={{ color: "gray.500" }}
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
            >
              Generate
            </Button>
          </Flex>
        </Flex>

        {/* Generated Text Area */}
        {generatedText && (
          <Textarea
            value={generatedText}
            onChange={(e) => setGeneratedText(e.target.value)}
            placeholder="AI-generated post will appear here"
            fontSize="md"
            minHeight="150px"
            borderColor="accent"
            color="text"
            _placeholder={{ color: "gray.500" }}
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
    </Box>
  );
};

export default LinkedinWorkflow;
