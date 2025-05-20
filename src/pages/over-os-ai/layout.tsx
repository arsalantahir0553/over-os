import DashboardSidebar from "@/components/over-os-ai/DashboardSidebar";
import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  return (
    <Flex h="100vh" bg="brand.900">
      {/* Inner box with border and rounded corners */}
      <Box
        flex="1"
        border="8px solid"
        borderColor="brand.900"
        overflow="hidden"
        display="flex"
      >
        {/* Sidebar */}
        <DashboardSidebar />

        {/* Main area */}
        <Flex
          flex="1"
          direction="column"
          overflow="hidden"
          borderRadius={"10px"}
        >
          {/* Topbar */}
          <Box flexShrink={0}>
            <DashboardTopbar />
          </Box>

          {/* Content */}
          <Box flex="1" overflowY="auto" p={6} bg="gray.50">
            <Outlet />
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
