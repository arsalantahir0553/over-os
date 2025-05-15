import { Box, Divider, Icon, Image, Text, VStack } from "@chakra-ui/react";
import { PiNotePencil } from "react-icons/pi";
import { VscGraph } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import Logo from "../../assets/svgs/logo-white.svg";
import { SearchIcon } from "lucide-react";
const DashboardSidebar = () => {
  const navigate = useNavigate();
  return (
    <Box w="260px" bg="blue.900" color="white" p={4}>
      <Image
        src={Logo}
        maxH="40px"
        cursor="pointer"
        onClick={() => navigate("/dashboard")}
      />

      <VStack align="start" spacing={4} mt={16} pl={2}>
        <Box as="button" display="flex" alignItems="center" gap={2}>
          <Icon as={PiNotePencil} />
          <Text>New Chat</Text>
        </Box>

        <Box as="button" display="flex" alignItems="center" gap={2}>
          <Icon as={VscGraph} />
          <Text>Explore workflows</Text>
          <Icon as={SearchIcon} />
        </Box>

        <Divider my={4} borderColor="whiteAlpha.400" />

        <Text fontSize="sm" color="whiteAlpha.700">
          Today
        </Text>
        <VStack align="start" spacing={2}>
          <Text>Climate Change News</Text>
          <Text>Workout plan for beginners</Text>
          <Text>Tools for remote teams</Text>
        </VStack>

        <Text fontSize="sm" color="whiteAlpha.700" mt={4}>
          Yesterday
        </Text>
        <VStack align="start" spacing={2}>
          <Text>Climate Change News</Text>
          <Text>Tools for remote teams</Text>
          <Text>Workout plan for beginners</Text>
          <Text>Climate Change News</Text>
        </VStack>
      </VStack>
    </Box>
  );
};

export default DashboardSidebar;
