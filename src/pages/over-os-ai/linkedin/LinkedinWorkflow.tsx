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
import { motion } from "framer-motion";
import { PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const LinkedinWorkflow = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isDone, setIsDone] = useState(false);

  const [text] = useTypewriter({
    words: [
      "Boost your reach",
      "AI for Thought Leadership",
      "Post on LinkedIn",
    ],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
    onLoopDone: () => setIsDone(true),
  });

  const navigate = useNavigate();

  useEffect(() => {
    const linkedinUserId = localStorage.getItem("linkedin_user_id");

    if (!linkedinUserId) {
      navigate("/dashboard"); // 👈 Redirect if linkedin_user_id is missing
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              placeholder="What would you like to post on LinkedIn?"
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
        {/* Tips Section */}
        <Box mt={6} px={2}>
          <Text fontWeight="semibold" fontSize="md" color="text" mb={2}>
            💡 Tips for Better LinkedIn Posts
          </Text>
          <VStack spacing={2} align="start" fontSize="sm" color="gray.400">
            <Text as="li">
              Start with a strong hook or question to grab attention.
            </Text>
            <Text as="li">
              Add personal insights or real experiences for authenticity.
            </Text>
            <Text as="li">
              Use 2–3 hashtags to increase visibility (e.g. <b>#AI</b>,{" "}
              <b>#Productivity</b>).
            </Text>
            <Text as="li">
              Include an image or infographic to boost engagement.
            </Text>
            <Text as="li">Keep it concise — ideally under 300 words.</Text>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default LinkedinWorkflow;
