import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  Text,
  Tooltip,
  useColorMode,
  VStack,
  Collapse,
} from "@chakra-ui/react";
import {
  FiSearch,
  FiSun,
  FiMoon,
  FiMenu,
  FiLogOut,
  FiChevronDown,
  FiChevronUp,
  FiBookOpen,
  FiMonitor,
  FiTrendingUp,
  FiTarget,
} from "react-icons/fi";
import { AiOutlineProduct } from "react-icons/ai";
import { PiRankingThin } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useLoggedInUser, useLogout } from "@/utils/apis/auth.api";
import { useWorkflowCategories } from "@/utils/apis/workflow.api";
import LogoCollapsed from "../../assets/svgs/logo-collapsed.svg";
import Logo from "@/assets/svgs/logo-beta.svg";
import ExploreIcon from "@/assets/svgs/explore-workflows.svg";
import MyWorkflowsIcon from "@/assets/svgs/my-workflows.svg";
import NewMessageIcon from "@/assets/svgs/new-message.svg";

// Icon map (reuse from Sidebar)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Productivity Power Tools": AiOutlineProduct,
  "Thought Leadership Engine": FiBookOpen,
  "Instant Newsroom": FiMonitor,
  "Superfan Activation Kit": FiTrendingUp,
  "Founder's Starter Pack": FiTarget,
  "Ranking Rocket Pack": PiRankingThin,
};

const DashboardTopbar = ({
  isDrawerOpen,
  onDrawerOpen,
  onDrawerClose,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const navigate = useNavigate();
  const { data: User } = useLoggedInUser();
  const logout = useLogout();
  const { data: categories = [] } = useWorkflowCategories();

  const [showExplore, setShowExplore] = useState(false);
  const [showMyWorkflows, setShowMyWorkflows] = useState(false);

  return (
    <>
      {/* Topbar */}
      <Flex
        as="header"
        align="center"
        justify={{ base: "space-between", md: "end" }}
        px={4}
        py={3}
        bg="surface"
        borderBottom="1px"
        borderColor="border"
        gap={3}
      >
        {/* Collapsed Logo */}
        <Image
          src={LogoCollapsed}
          alt="Logo"
          maxH="28px"
          onClick={() => navigate("/dashboard")}
          display={{ md: "none", base: "block" }}
        />

        {/* Right Icons */}
        <Flex align="center" gap={2}>
          <Tooltip label="Search" hasArrow>
            <IconButton
              icon={<FiSearch />}
              aria-label="Search"
              variant="ghost"
              fontSize="23px"
              color="text"
            />
          </Tooltip>

          <Tooltip
            label={colorMode === "light" ? "Dark Mode" : "Light Mode"}
            hasArrow
          >
            <IconButton
              icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
              aria-label="Toggle theme"
              variant="ghost"
              fontSize="22px"
              color="text"
              onClick={toggleColorMode}
            />
          </Tooltip>

          <Button
            rounded="8px"
            variant="solid"
            fontSize="16px"
            fontWeight="500"
            fontFamily="Inter"
            display={{ md: "block", base: "none" }}
            size="md"
            px={6}
            bg="surfaceButton"
            color="white"
            _hover={{ bg: "primary", opacity: 0.9 }}
            _active={{ bg: "primary", opacity: 0.8 }}
          >
            AI Screen Share
          </Button>

          {/* Hamburger on right end */}
          <IconButton
            display={{ base: "flex", md: "none" }}
            icon={<FiMenu />}
            aria-label="Open menu"
            variant="ghost"
            fontSize="24px"
            onClick={onDrawerOpen}
            color="text"
          />
        </Flex>
      </Flex>

      {/* Drawer */}
      <Drawer placement="left" onClose={onDrawerClose} isOpen={isDrawerOpen}>
        <DrawerOverlay />
        <DrawerContent bg="surfaceSidebar" color="white">
          <DrawerCloseButton />
          <DrawerBody p={4}>
            <Flex direction="column" gap={4} mt={8}>
              <Flex justifyContent={"left"}>
                <Image src={Logo} maxH="40px" mb={4} />
              </Flex>

              <VStack align="start" spacing={3}>
                <DrawerItem
                  label="New Chat"
                  icon={NewMessageIcon}
                  onClick={() => {
                    navigate("/dashboard");
                    onDrawerClose();
                  }}
                />

                {/* Explore Workflows Dropdown */}
                <DrawerDropdown
                  icon={ExploreIcon}
                  label="Explore Workflows"
                  isOpen={showExplore}
                  toggle={() => setShowExplore(!showExplore)}
                >
                  {categories.map((cat, i) => {
                    const Icon = categoryIcons[cat] || FiBookOpen;
                    return (
                      <Flex
                        key={i}
                        align="center"
                        gap={2}
                        py={1}
                        px={3}
                        rounded="md"
                        _hover={{ bg: "whiteAlpha.200" }}
                        cursor="pointer"
                        onClick={() => {
                          navigate(
                            `/workflow/category/${encodeURIComponent(cat)}`
                          );
                          onDrawerClose();
                        }}
                      >
                        <Icon size={16} />
                        <Text fontSize="sm">{cat}</Text>
                      </Flex>
                    );
                  })}
                </DrawerDropdown>

                {/* My Workflows Dropdown */}
                <DrawerDropdown
                  icon={MyWorkflowsIcon}
                  label="My Workflows"
                  isOpen={showMyWorkflows}
                  toggle={() => setShowMyWorkflows(!showMyWorkflows)}
                >
                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.400"
                    mt={2}
                  >
                    Today
                  </Text>
                  {["Climate Change News", "Workout plan for beginners"].map(
                    (item, i) => (
                      <DrawerSubItem key={i} label={item} />
                    )
                  )}

                  <Text
                    fontSize="xs"
                    fontWeight="semibold"
                    color="gray.400"
                    mt={3}
                  >
                    Yesterday
                  </Text>
                  {["Tools for remote teams", "Old Workflow"].map((item, i) => (
                    <DrawerSubItem key={i} label={item} />
                  ))}
                </DrawerDropdown>
              </VStack>

              <Divider my={4} />

              {/* User Section */}
              {User ? (
                <Flex align="center" gap={3} px={2}>
                  <Avatar size="sm" name={User.name} />
                  <Flex direction="column">
                    <Text fontSize="sm">{User.name}</Text>
                    <Button
                      size="xs"
                      mt={1}
                      variant="link"
                      color="red.400"
                      onClick={() =>
                        logout.mutate(undefined, {
                          onSuccess: () => window.location.reload(),
                        })
                      }
                      leftIcon={<FiLogOut />}
                    >
                      Logout
                    </Button>
                  </Flex>
                </Flex>
              ) : (
                <Button onClick={() => navigate("/signin")} mt={4}>
                  Sign In
                </Button>
              )}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default DashboardTopbar;

// Drawer single item
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DrawerItem = ({ label, icon, onClick }: any) => (
  <Flex
    align="center"
    gap={3}
    py={2}
    px={3}
    w="full"
    rounded="md"
    _hover={{ bg: "whiteAlpha.200" }}
    onClick={onClick}
    cursor="pointer"
  >
    <Image src={icon} w={5} h={5} />
    <Text fontSize="md">{label}</Text>
  </Flex>
);

// Dropdown section
const DrawerDropdown = ({
  label,
  icon,
  isOpen,
  toggle,
  children,
}: {
  label: string;
  icon: string;
  isOpen: boolean;
  toggle: () => void;
  children: React.ReactNode;
}) => (
  <Box w="full">
    <Flex
      align="center"
      justify="space-between"
      onClick={toggle}
      cursor="pointer"
      px={3}
      py={2}
      rounded="md"
      _hover={{ bg: "whiteAlpha.200" }}
    >
      <Flex align="center" gap={2}>
        <Image src={icon} w={5} h={5} />
        <Text fontSize="md">{label}</Text>
      </Flex>
      {isOpen ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
    </Flex>
    <Collapse in={isOpen}>
      <VStack align="start" spacing={1} pl={6} pt={1}>
        {children}
      </VStack>
    </Collapse>
  </Box>
);

// Sub item
const DrawerSubItem = ({ label }: { label: string }) => (
  <Text
    fontSize="sm"
    px={2}
    py={1}
    rounded="md"
    cursor="pointer"
    _hover={{ bg: "whiteAlpha.200" }}
    w="full"
  >
    {label}
  </Text>
);
