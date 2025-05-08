import { Box, Heading, Text, SimpleGrid, VStack } from "@chakra-ui/react";

const HowWeWork = () => {
  return (
    <Box as="section" textAlign="center" px={{ base: 4, md: 6 }} py={10}>
      {/* Intro */}
      <Text color="blue.500" fontWeight="semibold" mb={4} fontSize="sm">
        — HOW WE WORK —
      </Text>

      {/* Headline */}
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl", lg: "64px" }}
        lineHeight="1.2"
        maxW="5xl"
        mx="auto"
        mb={6}
        fontFamily={"Joan"}
        fontWeight={400}
        maxWidth={{ md: "700px", base: "100%" }}
      >
        Where Your To-Do List Meets Automation.
      </Heading>

      <Box
        as="p"
        color="gray.600"
        maxW={{ md: "900px", base: "100%" }}
        mx="auto"
        mb={12}
      >
        No clicks, no juggling tools — just one simple prompt. Our system
        intelligently understands your request, breaks it into actionable steps,
        and completes each task for you automatically.
      </Box>

      {/* Feature Blocks */}
      <SimpleGrid
        columns={{ base: 1, md: 2 }}
        gap={10}
        maxW="6xl"
        mx="auto"
        textAlign="left"
      >
        <VStack align="start" gap={2}>
          <Text fontWeight="bold">
            Local-first or Cloud-assist — you choose
          </Text>
          <Text color="gray.600">
            Local-first? We can work with your file on the cloud or files on
            your desktop (you choose which ones you want to share) or
            Cloud-assist — you choose.
          </Text>
        </VStack>

        <VStack align="start" gap={2}>
          <Text fontWeight="bold">Smart Model Picker</Text>
          <Text color="gray.600">
            Each task is routed to the ideal LLM—GPT-4o, Gemini, Groq, and
            more—balancing speed, cost, and accuracy so you always get the best
            result.
          </Text>
        </VStack>

        <VStack align="start" gap={2}>
          <Text fontWeight="bold">Drag-and-drop Workflows</Text>
          <Text color="gray.600">
            Design automations on a visual canvas—just drag steps into place and
            run. No code, no YAML, no headaches.
          </Text>
        </VStack>

        <VStack align="start" gap={2}>
          <Text fontWeight="bold">OS → Browser Orchestration</Text>
          <Text color="gray.600">
            The agent hops between desktop apps and live websites: clicking,
            typing, uploading, and saving files in one seamless flow.
          </Text>
        </VStack>
      </SimpleGrid>
    </Box>
  );
};

export default HowWeWork;
