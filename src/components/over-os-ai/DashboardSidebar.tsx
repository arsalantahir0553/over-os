import {
  Avatar,
  Box,
  Divider,
  Flex,
  Image,
  Text,
  VStack,
  IconButton,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ExploreWorkflowsIcon from "../../assets/svgs/explore-workflows.svg";
import Logo from "../../assets/svgs/dashboard-logo.svg";
import LogoCollapsed from "../../assets/svgs/logo-collapsed.svg";
import NewMessageIcon from "../../assets/svgs/new-message.svg";
import SettingsIcon from "../../assets/svgs/settings.svg";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const DashboardSidebar = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  // Automatically collapse sidebar on small screens
  const responsiveIsExpanded = useBreakpointValue({
    base: false, // small screens (mobile)
    md: isExpanded, // medium and up, respect toggle
  });

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
          maxH="40px"
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
          rounded="md"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <Image src={NewMessageIcon} alt="New Chat" w={5} h={5} />
          {responsiveIsExpanded && <Text>New Chat</Text>}
        </Box>

        <Box
          as="button"
          display="flex"
          alignItems="center"
          gap={2}
          w={isExpanded ? "full" : ""}
          px={responsiveIsExpanded ? 2 : 2}
          py={2}
          rounded="md"
          _hover={{ bg: "whiteAlpha.200" }}
        >
          <Image
            src={ExploreWorkflowsIcon}
            alt="Explore workflows"
            w={5}
            h={5}
          />
          {responsiveIsExpanded && <Text>Explore workflows</Text>}
        </Box>

        {responsiveIsExpanded && (
          <Divider my={4} borderColor="whiteAlpha.400" />
        )}

        {responsiveIsExpanded && (
          <>
            <Text fontSize="sm" color="whiteAlpha.700">
              Today
            </Text>
            <VStack align="start" spacing={2}>
              {[
                "Climate Change News",
                "Workout plan for beginners",
                "Tools for remote teams",
              ].map((item) => (
                <Text
                  key={item}
                  px={2}
                  py={1}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  {item}
                </Text>
              ))}
            </VStack>

            <Text fontSize="sm" color="whiteAlpha.700" mt={4}>
              Yesterday
            </Text>
            <VStack align="start" spacing={2}>
              {[
                "Climate Change News",
                "Tools for remote teams",
                "Workout plan for beginners",
                "Climate Change News",
              ].map((item, idx) => (
                <Text
                  key={idx}
                  px={2}
                  py={1}
                  rounded="md"
                  cursor="pointer"
                  _hover={{ bg: "whiteAlpha.200" }}
                >
                  {item}
                </Text>
              ))}
            </VStack>
          </>
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
