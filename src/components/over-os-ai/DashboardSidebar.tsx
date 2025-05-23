import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  SkeletonCircle,
  SkeletonText,
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
import { useLoggedInUser, useLogout } from "@/utils/apis/auth.api";
import { FiLogOut } from "react-icons/fi";

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

  const { data: User, isLoading } = useLoggedInUser();

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
      <UserMenu
        responsiveIsExpanded={responsiveIsExpanded}
        User={User}
        isLoading={isLoading}
      />
    </Box>
  );
};

export default DashboardSidebar;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserMenu = ({ responsiveIsExpanded, User, isLoading }: any) => {
  const logout = useLogout();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        window.location.reload();
      },
    });
  };

  if (isLoading) {
    return (
      <Flex mx={2} mt={4} align="center" gap={3}>
        <SkeletonCircle size="8" />
        {responsiveIsExpanded && <SkeletonText noOfLines={1} width="80px" />}
      </Flex>
    );
  }

  if (!User) {
    return (
      <Button
        colorScheme="whiteAlpha"
        variant="solid"
        size="sm"
        mx={2}
        mt={4}
        onClick={() => navigate("/signin")}
      >
        Login
      </Button>
    );
  }

  return (
    <Menu placement="top-end">
      <MenuButton
        as={Box}
        display="flex"
        bg={responsiveIsExpanded ? "white" : "transparent"}
        h={10}
        rounded={responsiveIsExpanded ? "full" : "none"}
        mx={2}
        gap={3}
        justifyContent={responsiveIsExpanded ? "space-between" : "center"}
        px={responsiveIsExpanded ? 4 : 0}
        alignItems="center"
        mt={4}
        boxShadow={responsiveIsExpanded ? "sm" : "none"}
        cursor="pointer"
      >
        <Flex gap={3} align="center" justifyContent="space-between">
          <Avatar
            size="xs"
            name={User.name}
            sx={{
              "& > div": {
                transform: "translateY(2px)",
              },
            }}
          />
          {responsiveIsExpanded && (
            <Text color="gray.600" fontSize="16px" fontFamily="Inter">
              {User.name}
            </Text>
          )}
          {responsiveIsExpanded && <Image src={SettingsIcon} />}
        </Flex>
      </MenuButton>

      <MenuList zIndex={10}>
        <MenuItem
          icon={<FiLogOut color="red" />}
          onClick={handleLogout}
          color="red.500"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
