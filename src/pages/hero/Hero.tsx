import {
  Box,
  Button,
  Heading,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Triangle } from "lucide-react"; // play icon
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Demo from "../../assets/videos/demo.mp4";

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const videoHeight = useBreakpointValue({ base: "200px", md: "460px" });
  const videoTranslateY = useBreakpointValue({ base: "-40%", md: "-60%" });
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/waiting-list");
  };

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <Box as="section" textAlign="center" px={{ base: 0, md: 6 }} py={10}>
      <Text color="blue.500" fontWeight="semibold" mb={8} fontSize="sm">
        — INTRODUCING OVEROS —
      </Text>

      <Heading
        as="h1"
        fontSize={{ base: "3xl", md: "5xl", lg: "64px" }}
        lineHeight="1.2"
        maxW="4xl"
        mx="auto"
        mb={{ md: 8, base: 8 }}
        fontFamily="Joan"
        fontWeight={400}
      >
        You on Autopilot – AI that clicks types & ships for you.
      </Heading>

      <Stack
        direction={{ base: "column", md: "row" }}
        justify="center"
        gap={4}
        mt={10}
        mb={44}
        flexWrap="wrap"
      >
        <Button
          colorScheme="blue"
          size="lg"
          borderRadius="full"
          px={8}
          onClick={handleNavigate}
        >
          Try OverOS
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
          <Box position="relative" width="100%" height="100%">
            <video
              ref={videoRef}
              src={Demo}
              muted
              playsInline
              controls={isPlaying}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
            {!isPlaying && (
              <Box
                as="button"
                aria-label="Play video"
                onClick={handlePlay}
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                borderRadius="full"
                width="64px"
                height="64px"
                bg="white"
                boxShadow="lg"
                display="flex"
                alignItems="center"
                justifyContent="center"
                zIndex="2"
                _hover={{ bg: "gray.300" }}
              >
                <Box transform="rotate(90deg)">
                  <Triangle color="black" size={28} fill="black" />
                </Box>
              </Box>
            )}
          </Box>
        </Box>

        {/* Bottom Text */}
        <Text
          color="white"
          fontSize={{ base: "sm", md: "md" }}
          mt="270px"
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
