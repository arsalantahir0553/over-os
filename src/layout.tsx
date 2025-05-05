import { Box } from "@chakra-ui/react";
import TopBar from "./components/Topbar";
import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <TopBar />
      <Box as="main" p={4}>
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
