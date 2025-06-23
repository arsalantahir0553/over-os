import { Box, Flex } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/over-os-ai/DashboardSidebar";
import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { useForceColorMode } from "@/hooks/useForceColorMode";
import { useState } from "react";

const DashboardLayout = () => {
  useForceColorMode("dark");

  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <Flex h="100vh" bg="bg">
      <Box flex="1" overflow="hidden" display="flex">
        <DashboardSidebar />
        <Flex flex="1" direction="column" overflow="hidden">
          <Box flexShrink={0}>
            <DashboardTopbar
              isDrawerOpen={drawerOpen}
              onDrawerOpen={() => setDrawerOpen(true)}
              onDrawerClose={() => setDrawerOpen(false)}
            />
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
