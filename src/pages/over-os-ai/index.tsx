import {
  Box,
  Card,
  CardBody,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserInput } from "@/context/useChatContext";
import { useGetAllWorkflows } from "@/utils/apis/workflow.api";
import RightArrowOrange from "../../assets/svgs/right-arrow-orange.svg";
// import Workflow1 from "../../assets/svgs/workflow-1.svg";
// import Workflow2 from "../../assets/svgs/workflow-2.svg";
// import Workflow3 from "../../assets/svgs/workflow-3.svg";
import { useTypewriter, Cursor } from "react-simple-typewriter";
import { motion } from "framer-motion";

const DashboardHome = () => {
  const { userInput, setUserInput, selectedImages, setSelectedImages } =
    useUserInput();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: Workflows } = useGetAllWorkflows();
  const chatPrompt = localStorage.getItem("chat_prompt");
  const [isDone, setIsDone] = useState(false);
  const [text] = useTypewriter({
    words: ["Cursor For Growth Marketing", "Vibe Coding", "Vibe Marketing"],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
    onLoopDone: () => setIsDone(true),
  });

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
      py={10}
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

        {/* Icon Buttons */}
        <Flex justify="space-between" align="center" mt={-5}>
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
        <Box pt={6}>
          <Text fontSize="2xl" fontWeight="semibold" color="text" mb={4}>
            Trending Workflows
          </Text>
          <SimpleGrid columns={[1, null, 3]} spacing={6}>
            {Workflows?.slice(0, 3).map((workflow, index) => (
              <Card
                key={index}
                bg="rgba(255, 255, 255, 0.05)"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="whiteAlpha.200"
                _hover={{ shadow: "lg", transform: "scale(1.01)" }}
                transition="all 0.2s ease"
                cursor="pointer"
                borderRadius="xl"
                position="relative"
                py={3}
                overflow="hidden"
                h="180px" // ensures all cards are same height
              >
                {/* Floating Pill Badge */}
                <Box
                  position="absolute"
                  top="-2px"
                  right="-7px"
                  bgGradient={
                    workflow.isActive
                      ? "linear(to-br, teal.400, green.400)"
                      : "linear(to-br, orange.300, red.400)"
                  }
                  color="white"
                  px={4}
                  py={1}
                  fontSize="xs"
                  fontWeight="bold"
                  borderBottomRadius="12px"
                  boxShadow="0 4px 8px rgba(0,0,0,0.2)"
                  zIndex={10}
                >
                  {workflow.isActive ? "✅ LIVE" : "⏳ COMING SOON"}
                </Box>

                <CardBody>
                  <Flex
                    direction="column"
                    flex="1"
                    justify="center"
                    gap={2}
                    h="100%"
                  >
                    <Text fontWeight="bold" fontSize="md" color="text" mb={1}>
                      {workflow.title}
                    </Text>
                    <Box h="48px" overflow="hidden">
                      <Text fontSize="sm" color="gray.400" noOfLines={2}>
                        {workflow.description}
                      </Text>
                    </Box>
                  </Flex>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </Box>
      </VStack>
    </Box>
  );
};

export default DashboardHome;
