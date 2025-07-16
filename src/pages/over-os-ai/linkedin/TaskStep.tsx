import Scheduler from "@/components/Scheduler";
import { Box, Collapse, Flex, Progress, Text } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { FiEdit } from "react-icons/fi";
import { AiTwotoneBulb } from "react-icons/ai";
import { GiCheckMark } from "react-icons/gi";
import { ArrowDown, ArrowUp, Check, Hourglass, TimerReset } from "lucide-react";
import { IoIosClose } from "react-icons/io";
import { RiAiGenerate } from "react-icons/ri";

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

interface TaskStepProps {
  title: string;
  description: string;
  status: "complete" | "in-progress" | "pending";
  progress: number;
  isExpanded: boolean;
  onToggle: () => void;
  index: number; // 👈 Add this
}

interface TrendingNews {
  title: string;
  subTitle: string;
  date: string;
}

const TrendingData: TrendingNews[] = [
  {
    title: "Open AI Announces GPT-5 with Revolutionary Multimodel Capabilities",
    subTitle: "TechCrunch",
    date: "2 hours ago",
  },
  {
    title: "OpenAI Unviels GPT-5 with Advanced AI Capabilities",
    subTitle: "Reuters",
    date: "3 hours ago",
  },
  {
    title: "GPT-5 Brings Multimodel AI to the mainstream",
    subTitle: "The Verge",
    date: "4 hours ago",
  },
];

export const TaskStep = ({
  title,
  description,
  status,
  progress,
  isExpanded,
  onToggle,
  index,
}: TaskStepProps) => {
  const isPending = status === "pending";
  const isComplete = status === "complete";
  const isInProgress = status === "in-progress";

  const borderColor = isComplete
    ? "universalGreen"
    : isInProgress
    ? "universalBlue"
    : "universalGray";

  const icon = {
    complete: <Check size={20} color="#22c55e" />,
    "in-progress": (
      <TimerReset
        size={20}
        color="#3b82f6"
        style={{ animation: `${spin} 1s linear infinite` }}
      />
    ),
    pending: <Hourglass size={20} color="#9ca3af" />,
  }[status];

  const progressColor = isComplete ? "green" : isInProgress ? "blue" : "gray";

  return (
    <Box
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      bg="surfaceTimeline"
    >
      <Flex
        align="center"
        justify="space-between"
        p={4}
        transition="all 0.2s"
        cursor="pointer"
        onClick={onToggle}
      >
        {/* Left: Icon + Text */}
        <Flex align="center" gap={3}>
          <Box mt={1} p={3} rounded="lg" bg="surface">
            {icon}
          </Box>
          <Box>
            <Text fontWeight="semibold" fontSize="md" color="text">
              {title}
            </Text>
            <Text fontSize="sm" color="mutedText">
              {description}
            </Text>
          </Box>
        </Flex>

        {/* Right: Progress + Toggle */}
        <Flex gap={4} align="center">
          <Box minW="100px" textAlign="right">
            {isPending ? (
              <Text fontSize="sm" color="gray.500">
                Waiting
              </Text>
            ) : (
              <>
                <Progress
                  value={progress}
                  size="xs"
                  colorScheme={progressColor}
                  borderRadius="md"
                  mb={1}
                />
                <Text fontSize="xs" color="gray.400">
                  {progress}%
                </Text>
              </>
            )}
          </Box>

          {isExpanded ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
        </Flex>
      </Flex>

      {/* Expanded content */}
      <Collapse in={isExpanded} animateOpacity>
        <Box px={4} pb={4} borderTop="1px solid" borderColor="border">
          {index === 0 ? (
            <>
              <Text
                fontSize="sm"
                color="mutedText"
                mt={3}
                textColor="brand.500"
              >
                Search Results
              </Text>
              <Box display="flex" mt={2} flexDirection="column" gap={2}>
                {TrendingData.map((td, index) => (
                  <Box
                    bg="bg"
                    px={4}
                    rounded="lg"
                    key={index}
                    w="full"
                    py={6}
                    display="flex"
                    justifyContent="space-between"
                    alignContent="center"
                    justifyItems="center"
                  >
                    <Box>
                      <Text textColor="brand.500">{td.title}</Text>
                      <Flex gap={4} mt={1} align="center">
                        <Text textColor="#8974D0">{td.subTitle}</Text>
                        <Text fontSize="14px" mt={1} textColor="gray.400">
                          {td.date}
                        </Text>
                      </Flex>
                    </Box>
                    <Box
                      p={1}
                      h="fit-content"
                      cursor={"pointer"}
                      rounded="full"
                      bg="universalRed"
                    >
                      <IoIosClose color="black" />
                    </Box>
                  </Box>
                ))}
              </Box>
            </>
          ) : index === 1 ? (
            <Box mt={3}>
              <Text fontSize="sm" fontWeight="medium" color="brand.500" mb={2}>
                Generated Summary
              </Text>
              <Box
                bg="bg"
                borderRadius="md"
                p={4}
                border="1px solid"
                borderColor="border"
                color="text"
                fontSize="sm"
              >
                OpenAI has unveiled GPT-5, marking a significant leap in AI
                capabilities with enhanced multimodal processing that can
                seamlessly handle text, images, audio, and video in real-time.
                The new model demonstrates unprecedented reasoning abilities and
                can maintain context across multiple interaction types, setting
                a new standard for AI assistant technology. Early beta tests
                show 40% improvement in complex problem-solving compared to
                GPT-4.
              </Box>

              <Flex gap={3} mt={4}>
                <Box
                  as="button"
                  px={4}
                  py={2}
                  fontSize="sm"
                  rounded="md"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <RiAiGenerate />
                  Regenerate
                </Box>
                <Box
                  as="button"
                  px={4}
                  py={2}
                  fontSize="sm"
                  rounded="md"
                  bg="blue.600"
                  _hover={{ bg: "blue.500" }}
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <FiEdit />
                  Edit Summary
                </Box>
              </Flex>
            </Box>
          ) : index === 2 ? (
            <Box mt={3}>
              <Text fontSize="sm" fontWeight="medium" color="brand.500" mb={2}>
                Draft LinkedIn Post
              </Text>
              <Box
                as="textarea"
                defaultValue={`🚀 The AI revolution just shifted into hyperdrive.

OpenAI has unveiled GPT-5, marking a significant leap in AI capabilities with enhanced multimodal processing that can seamlessly handle text, images, audio, and video in real-time. The new model demonstrates unprecedented reasoning abilities and can maintain context across multiple interaction types, setting a new standard for AI assistant technology. Early beta tests show 40% improvement in complex problem-solving compared to GPT-4.

This isn't just an incremental update—it's a glimpse into a future where AI becomes truly conversational across all mediums. The question isn't whether this will change how we work, but how quickly we can adapt.

What's your take on multimodal AI? Game-changer or overhyped?

#AI #OpenAI #GPT5 #Technology #Innovation #FutureOfWork`}
                rows={5}
                bg="bg"
                border="1px solid"
                borderColor="border"
                borderRadius="md"
                color="text"
                fontSize="sm"
                p={4}
                w="full"
                _focus={{ outline: "none", borderColor: "brand.500" }}
              />

              <Flex gap={3} mt={4} flexWrap="wrap">
                <Box
                  as="button"
                  px={4}
                  py={2}
                  fontSize="sm"
                  rounded="md"
                  bg="brand.500"
                  _hover={{ bg: "brand.500" }}
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <GiCheckMark />
                  Agree & Continue
                </Box>
                <Box
                  as="button"
                  px={4}
                  py={2}
                  fontSize="sm"
                  rounded="md"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <RiAiGenerate />
                  Regenerate
                </Box>
                <Box
                  as="button"
                  px={4}
                  py={2}
                  fontSize="sm"
                  rounded="md"
                  bg="gray.700"
                  _hover={{ bg: "gray.600" }}
                  color="white"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <AiTwotoneBulb />
                  Change Tone
                </Box>
              </Flex>
            </Box>
          ) : (
            <Box mt={3}>
              <Text fontSize="sm" fontWeight="medium" color="brand.500" mb={2}>
                Publishing Options
              </Text>
              <Box
                bg="bg"
                borderRadius="md"
                p={4}
                border="1px solid"
                borderColor="border"
                color="text"
                fontSize="sm"
              >
                This step will be available once the LinkedIn post is approved.
                You'll be able to:
                <Box as="ul" pl={4} mt={2} style={{ listStyleType: "disc" }}>
                  <li>Schedule the post for optimal timing</li>
                  <li>Preview how it will appear on LinkedIn</li>
                  <li>Add additional hashtags or mentions</li>
                  <li>Choose posting time and audience</li>
                </Box>
              </Box>
              <Scheduler />
            </Box>
          )}
        </Box>
      </Collapse>
    </Box>
  );
};
