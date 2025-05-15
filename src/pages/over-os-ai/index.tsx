import {
  Box,
  Card,
  CardBody,
  Heading,
  Icon,
  Input,
  SimpleGrid,
  Text,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
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

        <Input
          mt={6}
          placeholder="Find my recent knee CT-Scan, sent it to my orthopedic doctor"
          size="lg"
          borderRadius="xl"
          h="60px"
          bg="white"
          boxShadow="md"
        />

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
                      <Text fontWeight="medium">{workflow.title}</Text>
                      <Text fontSize="sm" color="gray.600">
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
