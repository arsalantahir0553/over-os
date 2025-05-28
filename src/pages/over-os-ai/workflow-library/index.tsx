import {
  Box,
  Flex,
  Grid,
  Image,
  Input,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import AllWorkflowsIcon from "../../../assets/svgs/all-workflows.svg";
import RecommendedIcon from "../../../assets/svgs/recomennded-workflow-icon.svg";
import Recommended1 from "../../../assets/svgs/recommended-1.svg";
import Recommended2 from "../../../assets/svgs/recommended-2.svg";
import Recommended3 from "../../../assets/svgs/recommended-3.svg";
import Recommended4 from "../../../assets/svgs/recommended-4.svg";
import Recommended5 from "../../../assets/svgs/recommended-5.svg";
import Recommended6 from "../../../assets/svgs/recommended-6.svg";
import RightArrowOrange from "../../../assets/svgs/right-arrow-orange.svg";
import Trending from "../../../assets/svgs/trending.svg";
import Treding1 from "../../../assets/svgs/workflow-1.svg";
import Treding2 from "../../../assets/svgs/workflow-2.svg";
import Treding3 from "../../../assets/svgs/workflow-3.svg";
import Treding4 from "../../../assets/svgs/workflow-4.svg";
import Treding5 from "../../../assets/svgs/workflow-5.svg";
import Treding6 from "../../../assets/svgs/workflow-6.svg";
import { useSearchParams } from "react-router-dom";

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
  {
    icon: Treding5,
    title: "Summarize meetings, articles, or documents",
    desc: "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with key takeaways.",
  },
  {
    icon: Treding6,
    title: "Summarize meetings, articles, or documents",
    desc: "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with key takeaways.",
  },
];

const allWorkflows = [
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
  {
    icon: Treding5,
    title: "Summarize meetings, articles, or documents",
    desc: "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with key takeaways.",
  },
  {
    icon: Treding6,
    title: "Summarize meetings, articles, or documents",
    desc: "Ingests transcripts, long PDFs, or multiple web articles and outputs a clean summary with key takeaways.",
  },
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
  <Flex align="start" gap={4} cursor="pointer" bg={"white"} minH="180px" p={4}>
    <Image src={icon} w="44px" h="44px" />

    <Flex
      direction="column"
      justify="space-between"
      h="100%"
      flex={1}
      minH="175px"
    >
      <Box>
        <Text fontWeight="400" fontSize="17px" fontFamily="Joan" mb={1}>
          {title}
        </Text>
        <Text mt={4} fontSize="12px" fontFamily="Inter" color="gray.600">
          {desc}
        </Text>
      </Box>

      <Box mt="auto" pt={2}>
        <Text
          fontSize="14px"
          color={"#D97757"}
          fontWeight="400"
          fontFamily="Inter"
          display="inline-flex"
          alignItems="center"
          gap={1}
        >
          {"Get started"}
          <Image src={RightArrowOrange} />
        </Text>
      </Box>
    </Flex>
  </Flex>
);

const WorkflowLibrary = () => {
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title");
  console.log(title);
  return (
    <Box px={{ base: 4, md: 12 }} py={10} bg="gray.50" minH="100vh">
      <Text
        fontSize={{ base: "2xl", md: "28px" }}
        fontWeight={400}
        fontFamily="Joan"
        mb={4}
      >
        {title || "Research Workflows"}
      </Text>
      {/* <Text fontSize="md" color="gray.500" mb={6}>
        Automate tasks, save hours, and scale your team’s productivity.
      </Text> */}

      <Flex align="center" gap={4} mb={10}>
        <Input
          placeholder={
            title ? `Search workflow related to ${title}` : "Search workflows"
          }
          fontSize="16px"
          borderRadius="20px"
          pl={10}
          borderColor="gray.200"
          bg={"white"}
          h={"49px"}
          _placeholder={{ color: "gray.300", fontSize: "16px" }}
          _focusVisible={{ borderColor: "blue.400", boxShadow: "sm" }}
        />

        {["Development", "Deployment", "WPS", "Wordpress"].map((tag, idx) => (
          <Tag
            key={idx}
            size="md"
            fontSize="15px"
            fontWeight={700}
            color="white"
            bg="primary.500"
            variant="solid"
            h={"44px"}
            px={"25px"}
            borderRadius="20px"
            cursor="pointer"
            _hover={{ bg: "brand.500" }}
            flexShrink={0}
          >
            {tag}
          </Tag>
        ))}
      </Flex>

      <VStack align="start" spacing={10}>
        <Box w="full">
          <Text
            fontSize={{ base: "2xl", md: "32px" }}
            fontWeight={400}
            fontFamily="Joan"
            mb={3}
            display={"flex"}
          >
            Trending Workflows <Image ml={2} src={Trending} />
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
            fontSize={{ base: "2xl", md: "32px" }}
            fontWeight={400}
            fontFamily="Joan"
            mb={3}
            display={"flex"}
          >
            Recommended Workflows <Image ml={2} src={RecommendedIcon} />
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
            fontSize={{ base: "2xl", md: "32px" }}
            fontWeight={400}
            fontFamily="Joan"
            mb={3}
            display={"flex"}
          >
            All Workflows <Image ml={2} src={AllWorkflowsIcon} />
          </Text>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              xl: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {allWorkflows.map((item, idx) => (
              <WorkflowCard key={idx} {...item} />
            ))}
          </Grid>
        </Box>
      </VStack>
    </Box>
  );
};

export default WorkflowLibrary;
