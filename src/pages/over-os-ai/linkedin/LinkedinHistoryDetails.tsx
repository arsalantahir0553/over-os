import { useCreateHistory, useGetHistoryById } from "@/utils/apis/history.api";
import { useLoggedInUser } from "@/utils/apis/auth.api";
import { usePublishGeneratedPost } from "@/utils/apis/linkedin.api";
import { queryClient } from "@/utils/apis/query.client";
import {
  Box,
  Button,
  Center,
  Flex,
  Spinner,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Cursor, useTypewriter } from "react-simple-typewriter";

const LinkedinHistoryDetails = () => {
  const MotionText = motion(Text);
  const { historyId } = useParams<{ historyId: string }>();
  const generatedTextRef = useRef<HTMLTextAreaElement>(null);
  const toast = useToast();

  const [editablePost, setEditablePost] = useState<string>("");

  const { data: user } = useLoggedInUser();
  const { data, isLoading, error } = useGetHistoryById(historyId ?? "");
  const { mutate: publishPost, isPending } = usePublishGeneratedPost();
  const { mutate: createHistory } = useCreateHistory();

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

  useEffect(() => {
    if (data?.generated_post) {
      setEditablePost(data.generated_post);
    }
  }, [data]);

  const handlePostToLinkedin = () => {
    if (!editablePost.trim()) {
      toast({
        title: "Post is empty",
        description: "Please enter or edit your post before publishing.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    publishPost(
      {
        user_prompt: data?.prompt || "",
        post: {
          text: editablePost,
          image_path: data?.image_url || "",
          url: "",
        },
      },
      {
        onSuccess: () => {
          toast({
            title: "Post published!",
            description: "Your post was successfully shared on LinkedIn.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });

          // Create history after successful post
          if (user?.id) {
            createHistory(
              {
                user_id: user.id,
                prompt: data?.prompt || "",
                generated_post: editablePost,
                image_url: data?.image_url || "",
                meta: JSON.stringify({
                  source: "LinkedInHistoryDetails",
                  timestamp: new Date().toISOString(),
                }),
              },
              {
                onSuccess: () => {
                  queryClient.invalidateQueries({
                    queryKey: ["user-history", user.id, 10, 0],
                  });
                },
              }
            );
          }
        },
        onError: () => {
          toast({
            title: "Failed to post",
            description: "Something went wrong. Try again later.",
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      }
    );
  };

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

        {/* Original Prompt */}
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

        {/* Editable Generated Post */}
        <Textarea
          ref={generatedTextRef}
          value={editablePost}
          onChange={(e) => setEditablePost(e.target.value)}
          placeholder="AI-generated post will appear here"
          fontSize="md"
          minHeight="180px"
          p={0}
          color="text"
          resize="none"
          border="none"
          overflow="hidden"
          _placeholder={{ color: "gray.500" }}
          _focus={{
            border: "none",
            boxShadow: "none",
          }}
        />

        {/* Post to LinkedIn Button */}
        <Flex justify="flex-end">
          <Button
            onClick={handlePostToLinkedin}
            isLoading={isPending}
            bg="primary"
            color="white"
            _hover={{ bg: "brand.400" }}
          >
            Repost to LinkedIn
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default LinkedinHistoryDetails;
