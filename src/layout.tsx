import { Box } from "@chakra-ui/react";
import TopBar from "./components/Topbar";
import { Outlet } from "react-router-dom";
import { useForceColorMode } from "./hooks/useForceColorMode";

const Layout = () => {
  useForceColorMode("light");

  return (
    <Box>
      <TopBar />
      <Box as="main" p={{ md: 0, base: 4 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
