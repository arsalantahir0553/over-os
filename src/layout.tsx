import { Box } from "@chakra-ui/react";
import TopBar from "./components/Topbar";
import type { ReactNode } from "react";
// import Footer from "./components/Footer";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <TopBar />
      <Box as="main" p={{ md: 0, base: 4 }}>
        {children}
      </Box>
      {/* <Footer /> */}
    </Box>
  );
};

export default Layout;
