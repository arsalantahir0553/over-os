import DashboardSidebar from "@/components/over-os-ai/DashboardSidebar";
import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Flex h="100vh" bg="bg">
      {/* Inner box with semantic border color */}
      <Box flex="1" overflow="hidden" display="flex">
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main content area */}
        <Flex flex="1" direction="column" overflow="hidden">
          {/* Topbar */}
          <Box flexShrink={0}>
            <DashboardTopbar />
          </Box>

          {/* Page content */}
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
