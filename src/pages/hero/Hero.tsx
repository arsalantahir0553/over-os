import {
  Box,
  Button,
  Flex,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const videoHeight = useBreakpointValue({ base: "200px", md: "460px" });
  const videoTranslateY = useBreakpointValue({ base: "-40%", md: "-60%" });
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/waiting-list");
  };
  const handleContactNavigate = () => {
    navigate("/contact-us");
  };
  return (
    <Box as="section" textAlign="center" px={{ base: 0, md: 6 }} py={10}>
      {/* Intro */}
      <Text color="blue.500" fontWeight="semibold" mb={4} fontSize="sm">
        — INTRODUCING OVEROS —
      </Text>

      {/* Headline */}
      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl", lg: "64px" }}
        lineHeight="1.2"
        maxW="4xl"
        mx="auto"
        mb={{ md: 8, base: 8 }}
        fontFamily={"Joan"}
        fontWeight={400}
      >
        You on Autopilot – AI that clicks types & ships for you.
      </Heading>
      {/* Buttons */}
      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        gap={4}
        mt={8}
        mb={36}
        flexWrap="wrap"
      >
        <Button
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          px={8}
          onClick={() => handleNavigate()}
        >
          Try OverOS
        </Button>
        <Button
          variant="outline"
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          px={8}
          onClick={() => handleContactNavigate()}
        >
          Contact Us
        </Button>
      </Stack>
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
    </Box>
  );
};

export default Hero;
