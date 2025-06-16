import { useWorkflowsByCategory } from "@/utils/apis/workflow.api";
import {
  Box,
  Card,
  CardBody,
  Flex,
  Heading,
  Icon,
  SimpleGrid,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { AiOutlineProduct } from "react-icons/ai";
import { FiBookOpen, FiMonitor, FiTarget, FiTrendingUp } from "react-icons/fi";
import { PiRankingThin } from "react-icons/pi";
import { useNavigate, useParams } from "react-router-dom";

// Icon map for category headers
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Productivity Power Tools": AiOutlineProduct,
  "Thought Leadership Engine": FiBookOpen,
  "Instant Newsroom": FiMonitor,
  "Superfan Activation Kit": FiTrendingUp,
  "Founder's Starter Pack": FiTarget,
  "Ranking Rocket Pack": PiRankingThin,
};

// Card UI (same as DashboardWorkflows)
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

const CategoryWorkflows = () => {
  const { category } = useParams<{ category: string }>();
  const { data, isLoading, error } = useWorkflowsByCategory(category || "");

  const IconComponent = categoryIcons[category ?? ""] || FiBookOpen;

  if (isLoading) {
    return (
      <Flex justify="center" align="center" h="300px">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error || !data?.workflows?.length) {
    return (
      <Box pt="70px">
        <Heading
          size="md"
          color="text"
          mb={4}
          display="flex"
          gap={2}
          alignItems="center"
        >
          <Icon as={IconComponent} boxSize={5} color="accent" />
          {category}
        </Heading>
        <Text color="gray.400">No workflows found in this category.</Text>
      </Box>
    );
  }

  return (
    <Box pt="20px">
      <Box
        mb={8}
        px={6}
        py={5}
        borderRadius="xl"
        bg="linear-gradient(to-r, #0f0c29, #302b63, #24243e)"
        boxShadow="lg"
        border="1px solid"
        borderColor="whiteAlpha.200"
      >
        <Flex align="center" gap={3}>
          <Icon as={IconComponent} boxSize={6} color="accent" />
          <Heading size="lg" color="text">
            {category}
          </Heading>
        </Flex>
      </Box>
      <SimpleGrid columns={[1, null, 3]} spacing={6}>
        {data.workflows.map((workflow) => (
          <WorkflowCard key={workflow.id} workflow={workflow} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default CategoryWorkflows;
