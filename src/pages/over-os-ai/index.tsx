import { useUserInput } from "@/context/useChatContext";
import { useGetAllWorkflows } from "@/utils/apis/workflow.api";
import {
  Box,
  Card,
  CardBody,
  Flex,
  IconButton,
  Image,
  InputGroup,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import RightArrowOrange from "../../assets/svgs/right-arrow-orange.svg";
import Workflow1 from "../../assets/svgs/workflow-1.svg";
import Workflow2 from "../../assets/svgs/workflow-2.svg";
import Workflow3 from "../../assets/svgs/workflow-3.svg";

const DashboardHome = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const { userInput, setUserInput, selectedImages, setSelectedImages } =
    useUserInput();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: Workflows } = useGetAllWorkflows();

  console.log("workflows", Workflows);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
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

  return (
    <Box maxW="950px" mx="auto" py={6}>
      <VStack spacing={2} align="left">
        <Text fontSize="48px" fontWeight={400} fontFamily="Joan">
          What is your goal?
        </Text>
        <Text
          fontSize="32px"
          fontWeight={400}
          color="primary.500"
          fontFamily="Joan"
          lineHeight={"24px"}
        >
          I’ll plan it out and take care of the work.
        </Text>

        <Flex
          align="center"
          justify="space-between"
          p={0}
          mt={10}
          position="relative"
        >
          <Box flex="1" mt={6}>
            {/* Image Previews */}
            {selectedImages.length > 0 && (
              <Flex gap={4} flexWrap="wrap" mb={4}>
                {selectedImages.map((file, index) => (
                  <Box
                    key={index}
                    position="relative"
                    width="40px"
                    height="40px"
                    borderRadius="md"
                  >
                    <Image
                      src={URL.createObjectURL(file)}
                      alt={`upload-${index}`}
                      boxSize="100%"
                      objectFit="cover"
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
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
                      height="16px"
                      width="16px"
                      minW="16px"
                      fontSize="10px"
                      zIndex="1"
                    />
                  </Box>
                ))}
              </Flex>
            )}

            {/* Textarea Input */}
            <InputGroup>
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
                shadow={"md"}
                fontFamily={"Inter"}
                pl={4}
                pt={4}
                color={"gray.600"}
                resize={"none"}
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />

              {/* Upload Button (fixed position) */}
              <Box position="absolute" right="10px" top="36px" zIndex={5}>
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
                    onClick={() => fileInputRef.current?.click()}
                  />
                </Tooltip>
              </Box>
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
            </InputGroup>
          </Box>
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

        <Box pt={10} mt={4} w="full">
          <Text fontSize="22px" fontFamily={"Joan"} mb={4} fontWeight="400">
            Trending Workflows
          </Text>
          <SimpleGrid columns={[1, null, 3]} spacing={6}>
            {Workflows?.slice(0, 3).map((workflow, index) => (
              <Card key={index} bg={cardBg} minH="180px">
                <CardBody>
                  <Flex
                    align="start"
                    gap={4}
                    cursor={index === 0 ? "pointer" : ""}
                    onClick={
                      index === 0
                        ? () => {
                            navigate(`/workflow/details/${workflow.id}`);
                          }
                        : () => {}
                    }
                  >
                    <Image
                      src={
                        index === 0
                          ? Workflow1
                          : index === 1
                          ? Workflow2
                          : Workflow3
                      }
                      w="44px"
                      h="44px"
                    />

                    <Flex
                      direction="column"
                      justify="space-between"
                      h="100%"
                      flex={1}
                      minH="175px"
                    >
                      <Box>
                        <Text
                          fontWeight="400"
                          fontSize="17px"
                          fontFamily="Joan"
                          mb={1}
                        >
                          {workflow.title}
                        </Text>
                        <Text
                          mt={4}
                          fontSize="12px"
                          fontFamily="Inter"
                          color="gray.600"
                        >
                          {workflow.description}
                        </Text>
                      </Box>

                      <Box mt="auto" pt={2}>
                        <Text
                          fontSize="14px"
                          color={workflow.isActive ? "#D97757" : "#D97757"}
                          fontWeight="400"
                          fontFamily="Inter"
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                        >
                          {workflow.isActive ? "Get started" : "Coming soon"}
                          <Image src={RightArrowOrange} />
                        </Text>
                      </Box>
                    </Flex>
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
