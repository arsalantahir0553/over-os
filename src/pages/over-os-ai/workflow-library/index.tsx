import {
  Box,
  Grid,
  Image,
  Input,
  InputGroup,
  Tag,
  Text,
  VStack,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Recommended1 from "../../../assets/svgs/recommended-1.svg";
import Recommended2 from "../../../assets/svgs/recommended-2.svg";
import Recommended3 from "../../../assets/svgs/recommended-3.svg";
import Recommended4 from "../../../assets/svgs/recommended-4.svg";
import Recommended5 from "../../../assets/svgs/recommended-5.svg";
import Recommended6 from "../../../assets/svgs/recommended-6.svg";
import Treding1 from "../../../assets/svgs/workflow-1.svg";
import Treding2 from "../../../assets/svgs/workflow-2.svg";
import Treding3 from "../../../assets/svgs/workflow-3.svg";
import Treding4 from "../../../assets/svgs/workflow-4.svg";

interface WorkflowCardProps {
  icon: string;
  title: string;
  desc: string;
}

const trending = [
  {
    icon: Treding1,
    title: "Send a file from your desktop via Email or Slack",
    desc: "Agent finds a doc (e.g., resume, NDA, PDF invoice), drafts a message, and sends it through Gmail, Outlook, or Slack.",
  },
  {
    icon: Treding2,
    title: "Auto-fill complex forms using your documents",
    desc: "Reads local files (e.g., ID, resume, tax data), extracts key info, fills out web forms like job applications or DMV renewals.",
  },
  {
    icon: Treding3,
    title: "Book a meeting and send confirmations",
    desc: "Checks calendar availability, opens browser to Calendly/Google, books meeting, and confirms by email or chat.",
  },
  {
    icon: Treding4,
    title: "Summarize meetings, articles, or documents",
    desc: "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with key takeaways.",
  },
];

const recommended = [
  {
    icon: Recommended1,
    title: "Turn receipts or scanned docs into expense reports",
    desc: "Watches a folder for receipts, OCRs them, fills expense templates or submits to QuickBooks.",
  },
  {
    icon: Recommended2,
    title: "Track deadlines and send smart reminders",
    desc: "Parses documents, forms, or tasks for dates and sets calendar events + Slack/email reminders.",
  },
  {
    icon: Recommended3,
    title: "Research & draft custom outreach messages",
    desc: "Agent takes a CSV of leads, researches each online, and drafts personalized cold emails or LinkedIn messages.",
  },
  {
    icon: Recommended4,
    title: "Prepare a weekly report or slide deck",
    desc: "Aggregates files, logs, updates from your system and auto-generates a ready-to-send report or presentation.",
  },
  {
    icon: Recommended5,
    title: "Find the housing in a zipcode",
    desc: "Go over to airbnb & apartments.com, Browser adds in right filter and reaches out to relevant property owners for info",
  },
  {
    icon: Recommended6,
    title: "Lead Capture → CRM Update/Email marketing",
    desc: "Connects form apps (Typeform, Webflow) to CRMs (HubSpot, Salesforce); static field mapping.",
  },
];

const WorkflowCard = ({ icon, title, desc }: WorkflowCardProps) => (
  <Box
    borderRadius="2xl"
    boxShadow="lg"
    borderBottom={"2px"}
    borderColor={"primary.500"}
    bgGradient="linear(to-b, white, gray.50)"
    p={6}
    w="full"
    h="100%"
    transition="all 0.25s ease"
    _hover={{
      transform: "translateY(-6px)",
      boxShadow: "2xl",
    }}
  >
    <Image src={icon} boxSize="50px" mb={4} alt={title} />
    <Text
      fontWeight="500"
      fontSize="18px"
      fontFamily={"Joan"}
      mb={2}
      color="gray.700"
    >
      {title}
    </Text>
    <Text
      fontSize="14px"
      fontFamily={"Inter"}
      fontWeight={400}
      color="gray.500"
    >
      {desc}
    </Text>
  </Box>
);

const WorkflowLibrary = () => {
  return (
    <Box px={{ base: 4, md: 12 }} py={10} bg="gray.50" minH="100vh">
      <Text
        fontSize={{ base: "2xl", md: "28px" }}
        fontWeight={400}
        fontFamily="Joan"
        mb={4}
      >
        Research Workflows
      </Text>
      {/* <Text fontSize="md" color="gray.500" mb={6}>
        Automate tasks, save hours, and scale your team’s productivity.
      </Text> */}

      <InputGroup mb={6}>
        <Input
          placeholder="Search workflows here"
          h="64px"
          fontSize="18px"
          borderRadius="10px"
          borderColor="gray.300"
          _placeholder={{ color: "gray.400", fontsize: "18px" }}
          _focusVisible={{ borderColor: "blue.400", boxShadow: "sm" }}
        />
      </InputGroup>

      <Wrap spacing={3} mb={10}>
        {[
          "Client",
          "Research",
          "Professional",
          "Medical",
          "Personal Use",
          "Search",
        ].map((tag, idx) => (
          <WrapItem key={idx}>
            <Tag
              size="lg"
              px={4}
              py={1}
              fontSize="15px"
              fontWeight={500}
              color={"white"}
              bg={"primary.500"}
              variant="solid"
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: "brand.500" }}
            >
              {tag}
            </Tag>
          </WrapItem>
        ))}
      </Wrap>

      <VStack align="start" spacing={10}>
        <Box w="full">
          <Text
            fontSize={{ base: "2xl", md: "24px" }}
            fontWeight={400}
            fontFamily="Joan"
            mb={3}
          >
            🔥 Trending Workflows
          </Text>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {trending.map((item, idx) => (
              <WorkflowCard key={idx} {...item} />
            ))}
          </Grid>
        </Box>

        <Box w="full">
          <Text
            fontSize={{ base: "2xl", md: "24px" }}
            fontWeight={400}
            fontFamily="Joan"
            mb={3}
          >
            ⭐ Recommended For You
          </Text>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(3, 1fr)",
            }}
            gap={6}
          >
            {recommended.map((item, idx) => (
              <WorkflowCard key={idx} {...item} />
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default WorkflowLibrary;
