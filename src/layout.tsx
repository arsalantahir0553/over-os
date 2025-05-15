import { Box } from "@chakra-ui/react";
import TopBar from "./components/Topbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <Box>
      <TopBar />
      <Box as="main" p={{ md: 0, base: 4 }}>
        <Outlet />
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
