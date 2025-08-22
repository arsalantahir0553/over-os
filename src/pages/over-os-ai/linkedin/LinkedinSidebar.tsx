import {
  Avatar,
  Box,
  Button,
  Flex,
  IconButton,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
  EditIcon,
  MessageSquareText,
} from "lucide-react";
import { useState } from "react";
import {
  FiBookOpen,
  FiClock,
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

import { useChatSession } from "@/context/ChatSessionContext";
import {
  useGetAllChatSessions,
  useUpdateSessionTitle,
} from "@/utils/apis/chat-sessions";
import { useWorkflowCategories } from "@/utils/apis/workflow.api";
import { AiOutlineProduct } from "react-icons/ai";
import { PiRankingThin } from "react-icons/pi";
import { useChatStore } from "@/store/chat-session.store";

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
  const [showMyWorkflows, setShowMyWorkflows] = useState(true);
  const { activeSessionId, setActiveSessionId } = useChatSession();
  const { setActiveSession } = useChatStore();
  const responsiveIsExpanded = useBreakpointValue({
    base: false,
    md: isExpanded,
  });
  const [hoveredSessionId, setHoveredSessionId] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editSessionId, setEditSessionId] = useState<string | null>(null);
  const { data: UserData, isLoading: isUserLoading } = useLoggedInUser();
  const { data: SessionData, refetch } = useGetAllChatSessions();
  console.log("SessionData", SessionData);
  const User = UserData?.data;
  const updateTitleMutation = useUpdateSessionTitle();

  const handleNavigate = (category: string) => {
    navigate(`/workflow/category/${encodeURIComponent(category)}`);
  };

  const handleNewChat = () => {
    localStorage.removeItem("linkedin_prompt");
    localStorage.removeItem("linkedin_response");
    localStorage.removeItem("linkedin_image_urls");
    window.location.href = "/workflow/linkedin"; // Full page reload
  };

  const handleSaveTitle = async () => {
    if (!editSessionId || !editTitle.trim()) return;

    try {
      await updateTitleMutation.mutateAsync(
        {
          messageId: parseInt(editSessionId),
          title: editTitle.trim(),
        },
        {
          onSuccess: () => {
            refetch();
            setIsEditModalOpen(false);
          },
          onError: (error) => {
            console.error("Failed to update title:", error);
            // You might want to show an error toast here
          },
        }
      );
    } catch (error) {
      console.error("Error updating title:", error);
    }
  };

  return (
    <Box
      w={responsiveIsExpanded ? "270px" : "80px"}
      transition="width 0.3s"
      bg="surfaceSidebar"
      color="white"
      p={4}
      display={{ lg: "flex", base: "none" }}
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
                w="full"
              >
                <Icon size={16} />
                <Text fontSize="sm" noOfLines={1} w="full">
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
          <SidebarSection>
            {SessionData ? (
              SessionData.results?.length > 0 ? (
                SessionData.results.map((session: any) => (
                  <Flex
                    key={session.id}
                    px={2}
                    py={2}
                    w="full"
                    rounded="md"
                    bg={
                      session.id === activeSessionId
                        ? "whiteAlpha.300"
                        : "transparent"
                    }
                    _hover={{ bg: "whiteAlpha.200" }}
                    cursor="pointer"
                    align="center"
                    justifyContent="space-between"
                    onMouseEnter={() => setHoveredSessionId(session.id)}
                    onMouseLeave={() => setHoveredSessionId(null)}
                  >
                    <Flex
                      gap={2}
                      align="start"
                      w="full"
                      onClick={() => {
                        if (session.id === activeSessionId) {
                          setActiveSessionId(null);
                          setActiveSession(null);
                        } else {
                          setActiveSessionId(session.id);
                          setActiveSession(session.id);
                          navigate(`/workflow/linkedin/${session.id}`);
                        }
                      }}
                    >
                      <Box mt={0.5}>
                        <MessageSquareText size={16} />
                      </Box>
                      <Box
                        w="full"
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Text fontSize="sm" maxW="150px" noOfLines={1}>
                          {session.title}
                        </Text>
                        {session.is_contain_schedules && (
                          <FiClock size={16} color="gray.400" />
                        )}
                      </Box>
                    </Flex>

                    {/* Edit icon only on hover */}
                    {hoveredSessionId === session.id && (
                      <IconButton
                        aria-label="Edit title"
                        size="xs"
                        icon={<EditIcon size={16} />}
                        variant="ghost"
                        color="whiteAlpha.800"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          setEditTitle(session.title);
                          setEditSessionId(session.id);
                          setIsEditModalOpen(true);
                        }}
                      />
                    )}
                  </Flex>
                ))
              ) : (
                <Text fontSize="sm" color="gray.400">
                  No sessions yet
                </Text>
              )
            ) : (
              // Loading skeletons
              Array.from({ length: 4 }).map((_, index) => (
                <Flex
                  key={index}
                  px={2}
                  py={2}
                  w="full"
                  rounded="md"
                  align="center"
                  gap={2}
                >
                  <SkeletonCircle size="4" />
                  <Box flex={1}>
                    <SkeletonText
                      noOfLines={1}
                      skeletonHeight="3"
                      startColor="whiteAlpha.200"
                      endColor="whiteAlpha.100"
                    />
                  </Box>
                </Flex>
              ))
            )}
          </SidebarSection>
        </SidebarDropdown>
      </VStack>

      {/* User Footer */}
      {isExpanded && <BetaBanner triesRemaining={10} />}
      <UserMenu
        User={User}
        isLoading={isUserLoading}
        isExpanded={responsiveIsExpanded}
      />

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        size="lg"
        isCentered
      >
        <ModalOverlay />
        <ModalContent
          bg="surface2"
          color="white"
          maxW={{ base: "90%", md: "600px" }}
          w="full"
        >
          <ModalHeader>Edit Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Enter new title"
              bg="white"
              color="black"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveTitle();
                }
              }}
            />
          </ModalBody>
          <ModalFooter gap={2}>
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(false)}
              isDisabled={updateTitleMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleSaveTitle}
              isLoading={updateTitleMutation.isPending}
              loadingText="Saving..."
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
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
  <Box
    maxH="500px"
    overflowY="auto"
    sx={{
      "&::-webkit-scrollbar": {
        width: "3px",
      },
      "&::-webkit-scrollbar-track": {
        background: "transparent",
      },
      "&::-webkit-scrollbar-thumb": {
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "2px",
        "&:hover": {
          background: "rgba(255, 255, 255, 0.3)",
        },
      },
      "&::-webkit-scrollbar-thumb:hover": {
        background: "rgba(255, 255, 255, 0.4)",
      },
      scrollbarWidth: "thin",
      scrollbarColor: "rgba(255, 255, 255, 0.2) transparent",
    }}
  >
    <VStack align="start" spacing={1}>
      {children}
    </VStack>
  </Box>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const UserMenu = ({ User, isExpanded, isLoading }: any) => {
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
            <Avatar size="sm" name={User?.first_name + " " + User?.last_name} />
            {isExpanded && (
              <Text fontSize="sm">
                {User?.first_name + " " + User?.last_name}
              </Text>
            )}
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

const BetaBanner = ({ triesRemaining }: { triesRemaining: number }) => (
  <Box
    bgGradient="linear(135deg, purple.500 0%, blue.600 50%, cyan.500 100%)"
    borderRadius="lg"
    p={3}
    color="white"
    textAlign="center"
    boxShadow="0 4px 16px rgba(0, 0, 0, 0.3)"
    position="relative"
    overflow="hidden"
    sx={{
      "&::before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background:
          "linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)",
        animation: "shimmer 2s infinite",
      },
      "@keyframes shimmer": {
        "0%": { transform: "translateX(-100%)" },
        "100%": { transform: "translateX(100%)" },
      },
    }}
  >
    {/* Background Pattern */}
    <Box
      position="absolute"
      top={0}
      left={0}
      right={0}
      bottom={0}
      opacity={0.1}
      backgroundImage="radial-gradient(circle at 20% 80%, rgba(255,255,255,0.3) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3) 0%, transparent 50%)"
    />

    {/* Content */}
    <Box position="relative" zIndex={1}>
      <Flex align="center" justify="center" mb={1}>
        <Text
          fontSize="xs"
          fontWeight="bold"
          letterSpacing="wide"
          textTransform="uppercase"
          bgGradient="linear(to-r, white, blue.100)"
          bgClip="text"
        >
          Beta Version
        </Text>
      </Flex>

      <Text fontSize="xs" color="blue.100" mb={1}>
        Limited Access
      </Text>

      <Flex align="center" justify="center" gap={1}>
        <Box
          bg="whiteAlpha.200"
          borderRadius="full"
          px={2}
          py={0.5}
          backdropFilter="blur(10px)"
          boxShadow="0 1px 4px rgba(0, 0, 0, 0.2)"
        >
          <Text fontSize="xs" fontWeight="semibold">
            {triesRemaining} tries
          </Text>
        </Box>
        <Text fontSize="xs" color="blue.100">
          remaining
        </Text>
      </Flex>

      {/* Progress Bar */}
      <Box mt={2}>
        <Box
          bg="whiteAlpha.200"
          h={1.5}
          borderRadius="full"
          overflow="hidden"
          backdropFilter="blur(10px)"
          boxShadow="inset 0 1px 2px rgba(0, 0, 0, 0.2)"
        >
          <Box
            bgGradient="linear(to-r, white, blue.200)"
            h="full"
            w={`${(triesRemaining / 10) * 100}%`}
            borderRadius="full"
            transition="width 0.3s ease"
            boxShadow="0 0 6px rgba(255,255,255,0.3)"
          />
        </Box>
      </Box>
    </Box>
  </Box>
);
