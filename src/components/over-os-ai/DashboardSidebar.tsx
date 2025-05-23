import {
  Avatar,
  Box,
  Flex,
  IconButton,
  Image,
  Text,
  useBreakpointValue,
  VStack,
} from "@chakra-ui/react";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExploreWorkflowsIcon from "../../assets/svgs/explore-workflows.svg";
import Logo from "../../assets/svgs/logo-beta.svg";
import LogoCollapsed from "../../assets/svgs/logo-collapsed.svg";
import MyWorkflowsIcon from "../../assets/svgs/my-workflows.svg";
import NewMessageIcon from "../../assets/svgs/new-message.svg";
import SettingsIcon from "../../assets/svgs/settings.svg";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExplore, setShowExplore] = useState(false);
  const [showMyWorkflows, setShowMyWorkflows] = useState(false);
  // Automatically collapse sidebar on small screens
  const responsiveIsExpanded = useBreakpointValue({
    base: false, // small screens (mobile)
    md: isExpanded, // medium and up, respect toggle
  });

  const handleNavigate = () => {
    navigate("/explore");
  };
  const handleNewChat = () => {
    navigate("/dashboard");
  };

  return (
    <Box
      w={responsiveIsExpanded ? "260px" : "80px"}
      transition="width 0.3s ease"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      bg="brand.900"
      color="white"
      p={4}
    >
      {/* Logo & Toggle */}
      <Flex justify="space-between" align="center" mb={6} position={"relative"}>
        <Image
          src={responsiveIsExpanded ? Logo : LogoCollapsed}
          maxH="59px"
          cursor="pointer"
          onClick={() => navigate("/dashboard")}
          mx={responsiveIsExpanded ? 0 : "auto"}
        />
        {/* Show toggle only on md and larger */}
        <IconButton
          size="sm"
          position={"absolute"}
          aria-label="Toggle sidebar"
          icon={
            responsiveIsExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />
          }
          onClick={() => setIsExpanded(!isExpanded)}
          bg="transparent"
          color="whiteAlpha.700"
          _hover={{ bg: "whiteAlpha.200" }}
          ml={responsiveIsExpanded ? 0 : "auto"}
          right={-6}
          zIndex={4}
          display={{ base: "none", md: "block" }}
        />
      </Flex>

      {/* The rest remains the same but replace all isExpanded with responsiveIsExpanded */}
      {/* Menu */}
      <VStack
        align={responsiveIsExpanded ? "start" : "center"}
        spacing={4}
        mt={0}
        pl={responsiveIsExpanded ? 2 : 0}
        mb={4}
        overflowY="auto"
        flex={1}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={2}
          w={isExpanded ? "full" : ""}
          px={responsiveIsExpanded ? 2 : 2}
          py={2}
          mt={16}
          rounded="md"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={handleNewChat}
        >
          <Image src={NewMessageIcon} alt="New Chat" w={5} h={5} />
          {responsiveIsExpanded && <Text>New Chat</Text>}
        </Box>

        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w={isExpanded ? "full" : ""}
          px={responsiveIsExpanded ? 2 : 2}
          py={2}
          rounded="md"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => setShowExplore(!showExplore)}
        >
          <Flex align="center" gap={2}>
            <Image src={ExploreWorkflowsIcon} alt="Explore" w={5} h={5} />
            {responsiveIsExpanded && <Text>Explore Workflows</Text>}
          </Flex>
          {responsiveIsExpanded &&
            (showExplore ? (
              <ChevronUpIcon size={16} />
            ) : (
              <ChevronDownIcon size={16} />
            ))}
        </Box>

        {showExplore && responsiveIsExpanded && (
          <VStack align="start" spacing={1} pl={6}>
            {[
              "Software Engineers",
              "Accountants & Bookkeepers",
              "Content Creators",
              "Researchers",
              "Customer Support Agents",
              "Startup Operators",
              "Recruiters",
              "Legal Analysts",
              "Grad Researchers",
            ].map((item) => (
              <Text
                key={item}
                py={1}
                px={2}
                fontSize="14px"
                rounded="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.200" }}
                onClick={handleNavigate}
              >
                {item}
              </Text>
            ))}
          </VStack>
        )}

        {/* My Workflows Dropdown */}
        <Box
          as="button"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          w={isExpanded ? "full" : ""}
          px={responsiveIsExpanded ? 2 : 2}
          py={2}
          rounded="md"
          _hover={{ bg: "whiteAlpha.200" }}
          onClick={() => setShowMyWorkflows(!showMyWorkflows)}
        >
          <Flex align="center" gap={2}>
            <Image src={MyWorkflowsIcon} alt="My Workflows" w={5} h={5} />
            {responsiveIsExpanded && <Text>My Workflows</Text>}
          </Flex>
          {responsiveIsExpanded &&
            (showMyWorkflows ? (
              <ChevronUpIcon size={16} />
            ) : (
              <ChevronDownIcon size={16} />
            ))}
        </Box>

        {showMyWorkflows && responsiveIsExpanded && (
          <VStack align="start" spacing={2} pl={6}>
            <Text
              ml={2}
              fontSize="20px"
              fontWeight={400}
              fontFamily={"Joan"}
              mt={2}
            >
              Today
            </Text>
            {[
              "Climate Change News",
              "Workout plan for beginners",
              "Tools for remote teams",
            ].map((item) => (
              <Text
                key={item}
                py={1}
                px={2}
                fontSize="14px"
                rounded="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                {item}
              </Text>
            ))}

            <Text
              ml={2}
              fontSize="20px"
              fontWeight={400}
              fontFamily={"Joan"}
              mt={4}
            >
              Yesterday
            </Text>
            {[
              "Climate Change News",
              "Tools for remote teams",
              "Workout plan for beginners",
              "Climate Change News",
            ].map((item, idx) => (
              <Text
                key={idx}
                py={1}
                px={2}
                fontSize="14px"
                rounded="md"
                cursor="pointer"
                _hover={{ bg: "whiteAlpha.200" }}
              >
                {item}
              </Text>
            ))}
          </VStack>
        )}
      </VStack>

      {/* Footer Profile */}
      <Box
        display="flex"
        bg={responsiveIsExpanded ? "white" : "transparent"} // Remove white bg when shrunk
        h={10}
        rounded={responsiveIsExpanded ? "full" : "none"} // Remove rounding when shrunk
        mx={2}
        gap={3}
        justifyContent={responsiveIsExpanded ? "space-between" : "center"}
        px={responsiveIsExpanded ? 4 : 0} // Remove padding when shrunk
        alignItems="center"
        mt={4}
        boxShadow={responsiveIsExpanded ? "sm" : "none"} // Remove shadow if any
      >
        <Flex gap={3} cursor="pointer" align="center">
          <Avatar size="xs" name="John Doe" />
          {responsiveIsExpanded && (
            <Text color="gray.600" fontSize={"16px"} fontFamily={"Inter"}>
              John Doe
            </Text>
          )}
        </Flex>
        {responsiveIsExpanded && <Image src={SettingsIcon} />}
      </Box>
    </Box>
  );
};

export default DashboardSidebar;
