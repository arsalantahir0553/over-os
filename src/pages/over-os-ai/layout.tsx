import DashboardSidebar from "@/components/over-os-ai/DashboardSidebar";
import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Flex h="100vh" overflow="hidden">
      {/* Sidebar - Fixed width */}
      <DashboardSidebar />

      {/* Main area */}
      <Flex flex="1" direction="column" overflow="hidden">
        {/* Topbar - Fixed height */}
        <Box flexShrink={0}>
          <DashboardTopbar />
        </Box>

        {/* Scrollable content */}
        <Box flex="1" overflowY="auto" p={6} bg="gray.50">
          <Outlet />
        </Box>
      </Flex>
    </Flex>
  );
};

export default DashboardLayout;
