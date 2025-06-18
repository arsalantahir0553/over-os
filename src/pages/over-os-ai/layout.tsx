import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/over-os-ai/DashboardSidebar";
import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { useForceColorMode } from "@/hooks/useForceColorMode";

const DashboardLayout = () => {
  useForceColorMode("dark");

  return (
    <Flex h="100vh" bg="bg">
      <Box flex="1" overflow="hidden" display="flex">
        <DashboardSidebar />
        <Flex flex="1" direction="column" overflow="hidden">
          <Box flexShrink={0}>
            <DashboardTopbar />
          </Box>
          <Box
            flex="1"
            overflowY="auto"
            p={6}
            bg="surface"
            mx={3}
            mt={3}
            borderRadius={"8px"}
          >
            <Outlet />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
