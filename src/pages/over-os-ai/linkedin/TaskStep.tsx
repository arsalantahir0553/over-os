import { Box, Flex, Progress, Text, Collapse } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import {
  ArrowDown,
  ArrowUp,
  Check,
  CrossIcon,
  Hourglass,
  TimerReset,
} from "lucide-react";
import { FaCross } from "react-icons/fa";
import { MdClose } from "react-icons/md";

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
}: TaskStepProps) => {
  const isPending = status === "pending";
  const isComplete = status === "complete";
  const isInProgress = status === "in-progress";

  const borderColor = isComplete
    ? "green.500"
    : isInProgress
    ? "blue.500"
    : "gray.600";

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
      bg="surfaceButton"
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
          <Box mt={1} p={3} rounded="lg" bg="brand.1000">
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
        <Box px={4} pb={4} borderTop={"1px solid"} borderColor={"gray.600"}>
          <Text fontSize="sm" color="mutedText" mt={3} textColor={"brand.500"}>
            Search Results
          </Text>
          <Box display={"flex"} mt={2} flexDirection={"column"} gap={2}>
            {TrendingData.map((td, index) => (
              <Box
                bg={"brand.900"}
                px={4}
                rounded={"lg"}
                key={index}
                w="full"
                py={6}
                display={"flex"}
                justifyContent={"space-between"}
                alignContent={"center"}
                justifyItems={"center"}
              >
                <Box>
                  <Text textColor={"brand.500"}>{td.title}</Text>
                  <Flex gap={4} mt={1} align={"center"}>
                    <Text textColor={"#8974D0"}>{td.subTitle}</Text>
                    <Text fontSize={"14px"} mt={1} textColor={"gray.400"}>
                      {td.date}
                    </Text>
                  </Flex>
                </Box>
                <Box p={1} h={"fit-content"} rounded={"full"} bg={"red.500"}>
                  <MdClose />
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};
