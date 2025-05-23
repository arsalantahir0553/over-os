import SmartInvoiceModal from "@/components/over-os-ai/SmartInvoiceModal";
import { useUserInput } from "@/context/useChatContext";
import {
  Box,
  Card,
  CardBody,
  Flex,
  IconButton,
  Image,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  Textarea,
  Tooltip,
  useColorModeValue,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { Clock10Icon, PlusIcon, Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Workflow1 from "../../assets/svgs/workflow-1.svg";
import Workflow2 from "../../assets/svgs/workflow-2.svg";
import Workflow3 from "../../assets/svgs/workflow-3.svg";
import RightArrowOrange from "../../assets/svgs/right-arrow-orange.svg";

const trendingWorkflows = [
  {
    icon: Workflow1,
    title: "Send a file from your desktop via Email or Slack",
    description:
      "Agent finds a doc (e.g., resume, NDA, PDF invoice), drafts a message, and sends it through Gmail or Slack.",
    coming_soon: false,
  },
  {
    icon: Workflow2,
    title: "Auto-fill complex forms using your documents",
    description:
      "Reads local files (e.g., resume, tax data), extracts key info, fills out web forms like job applications.",
    coming_soon: false,
  },
  {
    icon: Workflow3,
    title: "Summarize meetings, articles, or documents",
    description:
      "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with headings.",
    coming_soon: true,
  },
];

const DashboardHome = () => {
  const cardBg = useColorModeValue("white", "gray.800");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userInput, setUserInput } = useUserInput();
  const navigate = useNavigate();
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // prevent newline on enter without shift
      if (userInput.trim() !== "") {
        navigate("/chat");
      }
    }
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

        <Flex align="center" justify="space-between" p={0} mt={10}>
          {/* Input Field with Right Icon */}
          <InputGroup flex="1" mt={6}>
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
            <InputRightElement top="36px" right="10px">
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
                />
              </Tooltip>
            </InputRightElement>
          </InputGroup>

          {/* Schedule Link */}
        </Flex>
        {/* Left Icon Button */}
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
            {trendingWorkflows.map((workflow, index) => (
              <Card key={index} bg={cardBg} minH="180px">
                <CardBody>
                  <Flex align="start" gap={4} cursor="pointer" onClick={onOpen}>
                    <Image src={workflow.icon} w="44px" h="44px" />

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
                          color={workflow.coming_soon ? "#D97757" : "#D97757"}
                          fontWeight="400"
                          fontFamily="Inter"
                          display="inline-flex"
                          alignItems="center"
                          gap={1}
                        >
                          {workflow.coming_soon ? "Coming soon" : "Get started"}
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
      <SmartInvoiceModal isOpen={isOpen} onClose={onClose} />
    </Box>
  );
};

export default DashboardHome;
