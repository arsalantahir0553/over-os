import { useGetHistoryById } from "@/utils/apis/history.api";
import {
  Box,
  Flex,
  Text,
  Textarea,
  VStack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const LinkedinHistoryDetails = () => {
  const MotionText = motion(Text);
  const { historyId } = useParams<{ historyId: string }>();
  const generatedTextRef = useRef<HTMLTextAreaElement>(null);

  const [typewriterText] = useTypewriter({
    words: [
      "Boost your reach",
      "AI for Thought Leadership",
      "Post on LinkedIn",
    ],
    delaySpeed: 2000,
    typeSpeed: 10,
    deleteSpeed: 10,
  });

  const { data, isLoading, error } = useGetHistoryById(historyId ?? "");

  if (isLoading) {
    return (
      <Center h="100vh">
        <Spinner size="xl" color="accent" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center h="100vh">
        <Text color="red.500">Failed to load history data.</Text>
      </Center>
    );
  }

  return (
    <Box
      maxW="1260px"
      mx="auto"
      py={16}
      px={[0, 6]}
      backdropFilter="blur(16px)"
      borderRadius="xl"
    >
      <VStack spacing={10} align="stretch">
        {/* Heading */}
        <Box textAlign="center">
          <MotionText
            fontSize={["2xl", "5xl"]}
            fontWeight="extrabold"
            fontFamily="Joan"
            letterSpacing="wide"
          >
            <Box
              as="span"
              bgGradient="linear(to-r, primary, accent)"
              bgClip="text"
            >
              {typewriterText}
            </Box>
            <Box as="span" color="white">
              <Cursor cursorStyle="|" />
            </Box>
          </MotionText>
        </Box>

        {/* Prompt Input */}
        <Flex direction="column" gap={3}>
          <Textarea
            isReadOnly
            value={data?.prompt || ""}
            placeholder="Original prompt..."
            variant="unstyled"
            fontSize={{ md: "lg", base: "sm" }}
            fontWeight="medium"
            resize="none"
            overflow="hidden"
            padding="0"
            lineHeight="1.5"
            height="auto"
            minH="1.5rem"
            maxH="6rem"
            border="none"
            borderBottom="2px solid"
            borderColor="accent"
            borderRadius="0"
            _placeholder={{ color: "gray.600" }}
            _focus={{ borderColor: "primary", boxShadow: "none" }}
            color="text"
            pr="2.5rem"
            rows={1}
          />
        </Flex>

        {/* Generated Text Output */}
        <Textarea
          ref={generatedTextRef}
          isReadOnly
          value={data?.generated_post || ""}
          placeholder="AI-generated post will appear here"
          fontSize="md"
          minHeight="180px"
          p={0}
          color="text"
          resize="none"
          border="none"
          overflow="hidden"
          _placeholder={{ color: "gray.500" }}
          _focus={{ border: "none", boxShadow: "none" }}
        />
      </VStack>
    </Box>
  );
};

export default LinkedinHistoryDetails;
