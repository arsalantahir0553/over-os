import { Box, Flex, Image, Text } from "@chakra-ui/react";
import Founder2 from "../../assets/images/ali.jpg";
import Founder1 from "../../assets/images/yaseen.png";

const foundersData = [
  {
    name: "Yaseen Mohmand",
    title: "CTO, OverOS",
    image: Founder1,
    exp: "Ex–Meta Data Analyst | MS Data Science @ Harvard",
    description:
      "Yaseen blends data science and product thinking to build AI systems that act — not just analyze",
  },
  {
    name: "Ali Yousafzai",
    title: "CEO, OverOS",
    image: Founder2,
    exp: "Carnegie Mellon Alum | 2x Founder | AI Engineer",
    description:
      "Ali has built AI systems for NASA, Coca-Cola, and early-stage startups — now he’s building the operating system for autonomous AI agents.",
  },
];

const Founders = () => {
  return (
    <Box
      as="section"
      textAlign="center"
      px={{ base: 4, md: 6 }}
      py={10}
      mt={10}
      bg="linear-gradient(to bottom, #E8FBFF, #E2E5F6)"
    >
      {/* Intro */}
      <Text color="blue.500" fontWeight="semibold" mb={10} fontSize="sm">
        — MEET OUR FOUNDERS —
      </Text>

      {/* Headline */}
      {/* <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl", lg: "60px" }}
        lineHeight="1.2"
        maxW="5xl"
        mx="auto"
        mb={10}
        fontFamily={"Joan"}
        fontWeight={400}
        maxWidth={{ md: "600px", base: "100%" }}
      >
        The Visionaries Behind the Workflow
      </Heading> */}

      {/* Founder Cards */}
      <Flex
        gap={{ base: 4, md: 6 }} // Adjusted gap for mobile and desktop
        maxW="2xl"
        mx="auto"
        direction={{ base: "column", md: "row" }} // Stack vertically on mobile, row on desktop
        justify="center" // Center the content
        align="center" // Center the content vertically
      >
        {foundersData.map((founder, index) => (
          <Box
            key={index}
            p={{ base: 4, md: 6 }} // Adjusted padding for mobile and desktop
            borderRadius="xl"
            boxShadow="lg"
            bg="white"
            textAlign="center"
            maxW="250px" // Slimmer card
            minH={"520px"}
            mx="auto" // Ensures it is centered horizontally
            mb={{ base: 6, md: 0 }} // Added bottom margin for mobile view
          >
            <Box
              w={{ base: "180px", md: "200px" }} // Adjusted image size for mobile and desktop
              h={{ base: "220px", md: "250px" }} // Adjusted image size for mobile and desktop
              overflow="hidden"
              borderRadius="md"
              mb={4}
              mx="auto"
            >
              <Image
                src={founder.image}
                alt={founder.name}
                objectFit="cover"
                w="100%"
                h="100%"
              />
            </Box>

            <Text fontSize="sm" color="gray.500">
              {founder.title}
            </Text>
            <Text fontWeight="bold">{founder.name}</Text>
            <Text fontSize="sm" color="gray.500">
              {founder.exp}
            </Text>
            <Text mt={2} fontSize="sm" color="gray.800">
              {founder.description}
            </Text>
          </Box>
        ))}
      </Flex>
    </Box>
  );
};

export default Founders;
