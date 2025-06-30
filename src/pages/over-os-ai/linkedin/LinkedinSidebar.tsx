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
import { useEffect, useState } from "react";
import {
  FiBookOpen,
  FiLogOut,
  FiMonitor,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";

import ExploreIcon from "../../../assets/svgs/explore-workflows.svg";
import Logo from "../../../assets/svgs/logo-beta.svg";
import LogoCollapsed from "../../../assets/svgs/logo-collapsed.svg";
import MyWorkflowsIcon from "../../../assets/svgs/my-workflows.svg";
import NewMessageIcon from "../../../assets/svgs/new-message.svg";
import SettingsIcon from "../../../assets/svgs/settings.svg";

import { useLoggedInUser, useLogout } from "@/utils/apis/auth.api";

import {
  useGetUserHistory,
  type HistoryResponse,
} from "@/utils/apis/history.api";
import { useWorkflowCategories } from "@/utils/apis/workflow.api";
import { AiOutlineProduct } from "react-icons/ai";
import { PiRankingThin } from "react-icons/pi";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const categoryIcons: Record<string, any> = {
  "Productivity Power Tools": AiOutlineProduct,
  "Thought Leadership Engine": FiBookOpen,
  "Instant Newsroom": FiMonitor,
  "Superfan Activation Kit": FiTrendingUp,
  "Founder's Starter Pack": FiTarget,
  "Ranking Rocket Pack": PiRankingThin,
};

const LinkedinSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const activeTitle = decodeURIComponent(searchParams.get("title") || "");
  const { data: categories = [] } = useWorkflowCategories();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showExplore, setShowExplore] = useState(false);
  const [showMyWorkflows, setShowMyWorkflows] = useState(false);
  const [historyLimit] = useState(10);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [historyData, setHistoryData] = useState<HistoryResponse[]>([]);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);

  const responsiveIsExpanded = useBreakpointValue({
    base: false,
    md: isExpanded,
  });

  const { data: User, isLoading: isUserLoading } = useLoggedInUser();
  const { data: historyPage, isFetching: isFetchingHistory } =
    useGetUserHistory(User?.id, historyLimit, historyOffset);
  const handleNavigate = (category: string) => {
    navigate(`/workflow/category/${encodeURIComponent(category)}`);
  };

  useEffect(() => {
    if (historyPage?.data) {
      setHistoryData((prev) =>
        historyOffset === 0 ? historyPage.data : [...prev, ...historyPage.data]
      );

      const total = historyPage.pagination?.total || 0;
      if (historyOffset + historyLimit >= total) {
        setHasMoreHistory(false);
      } else {
        setHasMoreHistory(true);
      }
    }
  }, [historyLimit, historyOffset, historyPage]);

  const handleNewChat = () => {
    localStorage.removeItem("linkedin_prompt");
    localStorage.removeItem("linkedin_response");
    localStorage.removeItem("linkedin_image_urls");
    window.location.href = "/workflow/linkedin"; // Full page reload
  };

  return (
    <Box
      w={responsiveIsExpanded ? "270px" : "80px"}
      transition="width 0.3s"
      bg="surfaceSidebar"
      color="white"
      p={4}
      display={{ md: "flex", base: "none" }}
      flexDirection="column"
      borderRadius={"8px"}
      justifyContent="space-between"
      borderRight={"1px solid"}
      borderColor={"border"}
    >
      {/* Header */}
      <Flex
        justify="space-between"
        align="center"
        pb={"21px"}
        position="relative"
      >
        <Image
          src={responsiveIsExpanded ? Logo : LogoCollapsed}
          maxH="50px"
          cursor="pointer"
          mx={responsiveIsExpanded ? 0 : "auto"}
          onClick={() => navigate("/")}
        />
        <IconButton
          size="sm"
          icon={
            responsiveIsExpanded ? <ChevronLeftIcon /> : <ChevronRightIcon />
          }
          aria-label="Toggle sidebar"
          onClick={() => setIsExpanded(!isExpanded)}
          position="absolute"
          right={-6}
          bg="transparent"
          color="whiteAlpha.700"
          _hover={{ bg: "whiteAlpha.200" }}
          display={{ base: "none", md: "block" }}
          zIndex={5}
        />
      </Flex>

      {/* Menu Section */}
      <VStack
        align={responsiveIsExpanded ? "start" : "center"}
        spacing={3}
        pl={responsiveIsExpanded ? 2 : 0}
        pr={1}
        overflowY="auto"
        flex={1}
        mt={12}
        sx={{
          "&::-webkit-scrollbar": { display: "none" },
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        <SidebarButton
          icon={NewMessageIcon}
          label="New Agent"
          onClick={handleNewChat}
          isExpanded={responsiveIsExpanded}
        />

        <SidebarDropdown
          label="Agents"
          icon={ExploreIcon}
          isExpanded={responsiveIsExpanded}
          isOpen={showExplore}
          toggle={() => setShowExplore((prev) => !prev)}
        >
          {categories.map((item, index) => {
            const Icon = categoryIcons[item] || FiBookOpen;
            return (
              <Flex
                key={index}
                px={2}
                py={1}
                rounded="md"
                bg={item === activeTitle ? "whiteAlpha.300" : "transparent"}
                _hover={{ bg: "whiteAlpha.200" }}
                cursor="pointer"
                align="center"
                gap={2}
                onClick={() => handleNavigate(item)}
              >
                <Icon size={16} />
                <Text fontSize="sm" noOfLines={1}>
                  {item}
                </Text>
              </Flex>
            );
          })}
        </SidebarDropdown>

        <SidebarDropdown
          label="My Agents"
          icon={MyWorkflowsIcon}
          isExpanded={responsiveIsExpanded}
          isOpen={showMyWorkflows}
          toggle={() => setShowMyWorkflows((prev) => !prev)}
        >
          {historyData.length > 0 ? (
            <SidebarSection>
              {historyData.map((h: HistoryResponse) => (
                <SidebarSubItem
                  key={h.id}
                  label={`Linkedin Post: ${h.prompt}`}
                  historyId={h.id}
                />
              ))}
              {hasMoreHistory && (
                <Flex
                  justify={"center"}
                  align={"center"}
                  px={10}
                  bg={"border"}
                  rounded="8px"
                  cursor={"pointer"}
                  onClick={() =>
                    setHistoryOffset((prev) => prev + historyLimit)
                  }
                >
                  <ChevronDownIcon />
                  <Button
                    size="sm"
                    bg={"transparent"}
                    _hover={{
                      bg: "transparent",
                    }}
                    width="100%"
                    isLoading={isFetchingHistory}
                  >
                    Show More
                  </Button>
                </Flex>
              )}
            </SidebarSection>
          ) : (
            <SidebarSection>
              <Text fontSize="sm" color="gray.400">
                No prompts found
              </Text>
            </SidebarSection>
          )}
        </SidebarDropdown>
      </VStack>

      {/* User Footer */}
      <UserMenu
        User={User}
        isLoading={isUserLoading}
        isExpanded={responsiveIsExpanded}
      />
    </Box>
  );
};

export default LinkedinSidebar;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarButton = ({ icon, label, onClick, isExpanded }: any) => (
  <Box
    as="button"
    display="flex"
    alignItems="center"
    gap={2}
    w="full"
    px={2}
    py={2}
    rounded="md"
    _hover={{ bg: "whiteAlpha.200" }}
    onClick={onClick}
  >
    <Image src={icon} w={5} h={5} />
    {isExpanded && <Text fontSize="sm">{label}</Text>}
  </Box>
);

const SidebarDropdown = ({
  label,
  icon,
  children,
  isExpanded,
  isOpen,
  toggle,
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => (
  <>
    <Flex
      as="button"
      align="center"
      justify="space-between"
      w="full"
      px={2}
      py={2}
      rounded="md"
      _hover={{ bg: "whiteAlpha.200" }}
      onClick={toggle}
    >
      <Flex align="center" gap={2}>
        <Image src={icon} w={5} h={5} />
        {isExpanded && <Text fontSize="sm">{label}</Text>}
      </Flex>
      {isExpanded &&
        (isOpen ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />)}
    </Flex>
    {isOpen && isExpanded && (
      <VStack align="start" spacing={1} pl={3} mt={1}>
        {children}
      </VStack>
    )}
  </>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SidebarSection = ({ children }: any) => (
  <Box>
    <VStack align="start" spacing={1}>
      {children}
    </VStack>
  </Box>
);

const SidebarSubItem = ({
  label,
  historyId,
}: {
  label: string;
  historyId: string;
}) => {
  const navigate = useNavigate();
  return (
    <Text
      fontSize="sm"
      px={2}
      py={1}
      rounded="md"
      cursor="pointer"
      _hover={{ bg: "whiteAlpha.200" }}
      noOfLines={1}
      onClick={() => navigate(`workflow/linkedin/${historyId}`)}
    >
      {label}
    </Text>
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserMenu = ({ User, isLoading, isExpanded }: any) => {
  const logout = useLogout();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Flex mx={2} mt={4} align="center" gap={3}>
        <SkeletonCircle size="8" />
        {isExpanded && <SkeletonText noOfLines={1} width="80px" />}
      </Flex>
    );
  }

  if (!User) {
    return (
      <Button
        size="sm"
        bg={"surface2"}
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
        alignItems="center"
        justifyContent="space-between"
        w="full"
        px={isExpanded ? 4 : 0}
        py={2}
        mt={4}
        rounded="md"
        cursor="pointer"
        bg={isExpanded ? "surface2" : "transparent"}
        color={isExpanded ? "white" : "white"}
        boxShadow={isExpanded ? "sm" : "none"}
      >
        <Flex align="center" justifyContent={"space-between"}>
          <Flex align="center" gap={2}>
            <Avatar size="sm" name={User.name} />
            {isExpanded && <Text fontSize="sm">{User.name}</Text>}
          </Flex>
          {isExpanded && <Image src={SettingsIcon} />}
        </Flex>
      </MenuButton>
      <MenuList zIndex={10} p={0}>
        <MenuItem
          icon={<FiLogOut color="red" />}
          onClick={() =>
            logout.mutate(undefined, {
              onSuccess: () => window.location.reload(),
            })
          }
          color="red.500"
        >
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};
