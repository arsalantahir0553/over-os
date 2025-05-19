import {
  Box,
  Grid,
  Heading,
  Image,
  Input,
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
import Treding4 from "../../../assets/svgs/workflow-3.svg";
import Treding3 from "../../../assets/svgs/workflow-4.svg";

interface WorkflowCardProps {
  icon: string;
  title: string;
  desc: string;
}
const trending = [
  {
    icon: Treding1,
    title: "Send all free-form paper slips to Alex’s Slack",
    desc: "Push physical slips to Slack via OCR, tagging, sorting. Built for external client handoff.",
  },
  {
    icon: Treding2,
    title: "Auto-ETL complex forms",
    desc: "OCR and normalize client-submitted paperwork like IRS, contracts, tax forms.",
  },
  {
    icon: Treding3,
    title: "Book a consulting call",
    desc: "Client books + fills call-prep form. Analyst gets structured context automatically.",
  },
  {
    icon: Treding4,
    title: "Streamline receipts, statements",
    desc: "Ingest + classify receipts, PDFs, bank statements. Prepares for accounting software.",
  },
];

const recommended = [
  {
    icon: Recommended1,
    title: "Email-to-booking 1.0",
    desc: "Client emails get parsed + sorted to calendar-ready prompts for admin.",
  },
  {
    icon: Recommended2,
    title: "Track deadlines and send reminders",
    desc: "Remind internal or external contacts for docs, filings, etc.",
  },
  {
    icon: Recommended3,
    title: "Research & draft custom agreements",
    desc: "Respond to early client signals with accurate, fill-ready docs.",
  },
  {
    icon: Recommended4,
    title: "Prepare weekly report slide deck",
    desc: "Autofill a weekly template with updated data + wins.",
  },
  {
    icon: Recommended5,
    title: "Smart filters",
    desc: "Create rules for classifying workflows based on keywords or document types.",
  },
  {
    icon: Recommended6,
    title: "Lead Capture → CRM Upload/Email trigger",
    desc: "Auto-uploads captured leads into CRM, sends a welcome email.",
  },
];

const WorkflowCard = ({ icon, title, desc }: WorkflowCardProps) => (
  <Box
    borderRadius="lg"
    boxShadow="md"
    bg="white"
    p={4}
    w="full"
    h="100%"
    _hover={{ boxShadow: "xl" }}
  >
    <Image src={icon} boxSize="40px" mb={3} alt={title} />
    <Text fontWeight="400" fontSize="md" mb={2}>
      {title}
    </Text>
    <Text fontSize="sm" color="gray.600">
      {desc}
    </Text>
  </Box>
);

const WorkflowLibrary = () => {
  return (
    <Box px={8} py={6} bg="gray.50" minH="100vh">
      <Text fontSize="28px" fontWeight={400} fontFamily={"joan"} mb={4}>
        Workflow library
      </Text>

      <Input
        placeholder="Search workflow here"
        w={"full"}
        mb={4}
        h={"71px"}
        _placeholder={{ color: "gray.400" }}
        pl={4}
        borderRadius={"10px"}
      />

      <Wrap spacing={3} mb={6}>
        {[
          "Client",
          "Research",
          "Professional",
          "Medical",
          "Personal Use",
          "Search",
        ].map((tag) => (
          <WrapItem key={tag}>
            <Tag
              cursor={"pointer"}
              size="lg"
              borderWidth={"1px"}
              fontSize={"18px"}
              borderColor={"gray.300"}
              color={"gray.400"}
              variant="ghost"
              colorScheme="gray"
              borderRadius={"full"}
              _hover={{ borderColor: "#2368C4", color: "#2368C4" }}
            >
              {tag}
            </Tag>
          </WrapItem>
        ))}
      </Wrap>

      <VStack align="start" spacing={6}>
        <Box w="full">
          <Heading size="md" mb={4}>
            Trending Workflow
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(4, 1fr)",
            }}
            gap={6}
          >
            {trending.map((item, idx) => (
              <WorkflowCard key={idx} {...item} />
            ))}
          </Grid>
        </Box>

        <Box w="full">
          <Heading size="md" mb={4}>
            Recommended For You
          </Heading>
          <Grid
            templateColumns={{
              base: "1fr",
              md: "repeat(2, 1fr)",
              lg: "repeat(3, 1fr)",
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
