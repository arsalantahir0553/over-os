import DashboardTopbar from "@/components/over-os-ai/DashboardTopbar";
import { useForceColorMode } from "@/hooks/useForceColorMode";
import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import LinkedinSidebar from "../over-os-ai/linkedin/LinkedinSidebar";

const LinkedinLayout = () => {
  useForceColorMode("dark");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath !== "/workflow/linkedin") {
      localStorage.removeItem("linkedin_prompt");
      localStorage.removeItem("linkedin_response");
      localStorage.removeItem("linkedin_image_urls");
    }
  }, [location.pathname]);

  return (
    <Flex h={{ md: "100vh", base: "auto" }} bg="bg">
      <Box flex="1" overflow="hidden" display="flex">
        <LinkedinSidebar />
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

export default LinkedinLayout;
