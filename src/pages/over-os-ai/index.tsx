import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  IconButton,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Text,
  Textarea,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { PlusIcon } from "lucide-react";
import { FaLink } from "react-icons/fa";
import { LuNotepadText } from "react-icons/lu";
import { MdOutlineDynamicForm, MdOutlineWifiTethering } from "react-icons/md";

const trendingWorkflows = [
  {
    icon: MdOutlineWifiTethering,
    title: "Send a file from your desktop via Email or Slack",
    description:
      "Agent finds a doc (e.g., resume, NDA, PDF invoice), drafts a message, and sends it through Gmail or Slack.",
  },
  {
    icon: MdOutlineDynamicForm,
    title: "Auto-fill complex forms using your documents",
    description:
      "Reads local files (e.g., resume, tax data), extracts key info, fills out web forms like job applications.",
  },
  {
    icon: LuNotepadText,
    title: "Summarize meetings, articles, or documents",
    description:
      "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with headings.",
  },
];

const DashboardHome = () => {
  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box maxW="800px" mx="auto" py={6}>
      <VStack spacing={2} align="left">
        <Heading size="xl" fontWeight={400} fontFamily="Joan">
          What is your goal?
        </Heading>
        <Text
          fontSize="3xl"
          fontWeight={400}
          color="blue.600"
          fontFamily="Joan"
        >
          I’ll plan it out and take care of the work.
        </Text>

        <Flex align="center" justify="space-between" p={0}>
          {/* Input Field with Right Icon */}
          <InputGroup flex="1" mt={6}>
            <Textarea
              placeholder="Ask Anything"
              _placeholder={{ color: "gray.400", fontsize: "12px" }}
              size="lg"
              h="80px"
              borderRadius="2xl"
              bg="white"
              pr="3rem"
              shadow={"md"}
              resize={"none"}
            />
            <InputRightElement top="36px" right="10px">
              <IconButton
                icon={<FaLink width={"16px"} />}
                aria-label="Add"
                variant="ghost"
                borderRadius="full"
                size="sm"
                bg={"blue.50"}
                colorScheme="blue"
              />
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
          <Text
            fontSize="sm"
            color="blue.500"
            cursor="pointer"
            textDecor={"underline"}
          >
            Schedule
          </Text>
        </Flex>
        <Box pt={10} w="full">
          <Heading size="md" mb={4} fontWeight="medium">
            Trending Workflows
          </Heading>
          <SimpleGrid columns={[1, null, 3]} spacing={6}>
            {trendingWorkflows.map((workflow, index) => (
              <Card
                key={index}
                bg={cardBg}
                boxShadow="sm"
                borderRadius="lg"
                borderBottomColor={"blue.500"}
                borderBottomWidth={"3px"}
              >
                <CardBody>
                  <VStack align="start" spacing={4}>
                    <Icon
                      as={workflow.icon}
                      boxSize={8}
                      mt={1}
                      //   color="blue.500"
                      flexShrink={0}
                    />
                    <VStack align="start" spacing={3}>
                      <Text fontWeight="medium" fontFamily={"Joan"}>
                        {workflow.title}
                      </Text>
                      <Text fontSize="sm" fontFamily={"Inter"} color="gray.600">
                        {workflow.description}
                      </Text>
                    </VStack>
                  </VStack>
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
