import {
  Box,
  Card,
  CardBody,
  Flex,
  SimpleGrid,
  Text,
  Spinner,
  Heading,
  Icon,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import {
  FiZap,
  FiMonitor,
  FiBookOpen,
  FiTrendingUp,
  FiTarget,
} from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { PiRankingThin } from "react-icons/pi";
import {
  useTrendingWorkflows,
  useDashboardWorkflows,
} from "@/utils/apis/workflow.api";

// Optional: Map category names to icons
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Productivity Power Tools": AiOutlineProduct,
  "Thought Leadership Engine": FiBookOpen,
  "Instant Newsroom": FiMonitor,
  "Superfan Activation Kit": FiTrendingUp,
  "Founder's Starter Pack": FiTarget,
  "Ranking Rocket Pack": PiRankingThin,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const WorkflowCard = ({ workflow }: { workflow: any }) => {
  const navigate = useNavigate();

  return (
    <Card
      bg="rgba(255, 255, 255, 0.05)"
      backdropFilter="blur(10px)"
      border="1px solid"
      borderColor="whiteAlpha.200"
      _hover={{ shadow: "lg", transform: "scale(1.01)" }}
      transition="all 0.2s ease"
      cursor="pointer"
      borderRadius="xl"
      position="relative"
      py={3}
      overflow="hidden"
      h="180px"
      onClick={() => {
        if (workflow.isActive) {
          navigate(`/workflow/details/${workflow.id}`);
        }
      }}
    >
      <Box
        position="absolute"
        top="-2px"
        right="-7px"
        bgGradient={
          workflow.isActive
            ? "linear(to-br, teal.400, green.400)"
            : "linear(to-br, orange.300, red.400)"
        }
        color="white"
        px={4}
        py={1}
        fontSize="xs"
        fontWeight="bold"
        borderBottomRadius="12px"
        boxShadow="0 4px 8px rgba(0,0,0,0.2)"
        zIndex={10}
      >
        {workflow.isActive ? "✅ GET STARTED" : "⏳ COMING SOON"}
      </Box>

      <CardBody>
        <Flex direction="column" flex="1" justify="center" gap={2} h="100%">
          <Text fontWeight="bold" fontSize="md" color="text" mb={1}>
            {workflow.title}
          </Text>
          <Box h="48px" overflow="hidden">
            <Text fontSize="sm" color="gray.400" noOfLines={2}>
              {workflow.description}
            </Text>
          </Box>
        </Flex>
      </CardBody>
    </Card>
  );
};

const DashboardWorkflows = () => {
  const {
    data: trendingData,
    isLoading: trendingLoading,
    error: trendingError,
  } = useTrendingWorkflows();

  const {
    data: dashboardData,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useDashboardWorkflows();

  const isLoading = trendingLoading || dashboardLoading;
  const error = trendingError || dashboardError;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="300px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Text color="red.400" fontWeight="semibold">
        Failed to load workflows. Please try again.
      </Text>
    );
  }

  const { trendingWorkflows } = trendingData || {};
  const { workflowsByCategory } = dashboardData || {};

  return (
    <Box pt={"70px"}>
      {/* Trending Workflows */}
      <Text
        fontSize="2xl"
        fontWeight="semibold"
        color="text"
        mb={4}
        display={"flex"}
        gap={1}
        alignItems={"center"}
      >
        <FiZap width={5} color="accent" /> Trending Workflows
      </Text>
      <SimpleGrid columns={[1, null, 3]} spacing={6} mb={10}>
        {trendingWorkflows?.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </SimpleGrid>

      {/* Workflows By Category */}
      {Object.entries(workflowsByCategory ?? {}).map(
        ([category, workflows]) => {
          const IconComponent = categoryIcons[category] || FiBookOpen;

          return (
            <Box mb={10} key={category}>
              <Flex align="center" mb={4} gap={2}>
                <Icon as={IconComponent} boxSize={5} color="accent" />
                <Heading size="md" color="text">
                  {category}
                </Heading>
              </Flex>
              <SimpleGrid columns={[1, null, 3]} spacing={6}>
                {workflows.map((workflow) => (
                  <WorkflowCard key={workflow.id} workflow={workflow} />
                ))}
              </SimpleGrid>
            </Box>
          );
        }
      )}
    </Box>
  );
};

export default DashboardWorkflows;
