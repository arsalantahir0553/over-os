import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Stack,
  Highlight,
  useBreakpointValue,
} from "@chakra-ui/react";

const Hero = () => {
  const videoHeight = useBreakpointValue({ base: "200px", md: "460px" });
  const videoTranslateY = useBreakpointValue({ base: "-40%", md: "-60%" });

  return (
    <Box as="section" textAlign="center" px={{ base: 0, md: 6 }} py={10}>
      {/* Intro */}
      <Text color="blue.500" fontWeight="semibold" mb={4} fontSize="sm">
        — INTRODUCING OVEROS —
      </Text>

      {/* Headline */}
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl", lg: "55px" }}
        lineHeight="1.2"
        maxW="4xl"
        mx="auto"
        mb={{ md: 36, base: 12 }}
        className="cardo"
      >
        <Highlight
          query="AI that clicks"
          styles={{
            px: "4",
            py: "1",
            rounded: "full",
            bg: "blue.100",
          }}
        >
          You on Autopilot – AI that clicks types & ships for you.
        </Highlight>
      </Heading>

      {/* Blue Box with Video Overlay */}
      <Box
        position="relative"
        bg="blue.900"
        pt={{ base: 24, md: 32 }}
        pb={{ md: 10, base: 4 }}
        borderRadius="3xl"
        minH={{ base: "300px", md: "500px" }}
      >
        {/* Floating Video Box */}
        <Box
          position="absolute"
          top="34%"
          left="50%"
          transform={`translate(-50%, ${videoTranslateY})`}
          width={{ base: "90%", md: "90%", lg: "80%" }}
          height={videoHeight}
          bg="gray.100"
          borderRadius="xl"
          boxShadow="2xl"
          overflow="hidden"
          zIndex="1"
        >
          <Flex
            h="100%"
            align="center"
            justify="center"
            color="gray.500"
            fontSize="xl"
          >
            Video Placeholder
          </Flex>
        </Box>

        {/* Bottom Text */}
        <Text
          color="white"
          fontSize={{ base: "sm", md: "md" }}
          mt={"270px"}
          px={4}
        >
          See how effortlessly your ideas turn into automated <br /> actions —
          no clicks, just commands
        </Text>
      </Box>
      {/* Buttons */}
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        gap={4}
        mt={8}
        flexWrap="wrap"
      >
        <Button colorScheme="blue" size="lg" borderRadius="full" px={8}>
          Try OverOS
        </Button>
        <Button
          variant="outline"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          px={8}
        >
          Download App
        </Button>
      </Stack>
    </Box>
  );
};

export default Hero;
