import {
  Button,
  Flex,
  IconButton,
  useColorMode,
  Tooltip,
} from "@chakra-ui/react";
import { FiSearch, FiSun, FiMoon } from "react-icons/fi";

const DashboardTopbar = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Flex
      as="header"
      align="center"
      justify="flex-end"
      px={6}
      py={4}
      bg="surface"
      borderBottom="1px"
      borderColor="border"
      gap={3}
    >
      {/* Search Button */}
      <Tooltip label="Search" hasArrow>
        <IconButton
          icon={<FiSearch />}
          aria-label="Search"
          variant="ghost"
          fontSize="23px"
          color="text"
        />
      </Tooltip>

      {/* Theme Toggle Button */}
      <Tooltip
        label={
          colorMode === "light" ? "Switch to dark mode" : "Switch to light mode"
        }
        hasArrow
      >
        <IconButton
          icon={colorMode === "light" ? <FiMoon /> : <FiSun />}
          aria-label="Toggle theme"
          variant="ghost"
          fontSize="22px"
          color="text"
          onClick={toggleColorMode}
        />
      </Tooltip>

      {/* Screen Share Button */}
      <Button
        rounded="8px"
        variant="solid"
        fontSize="16px"
        fontWeight="500"
        fontFamily="Inter"
        size={"md"}
        px={6}
        bg="surfaceButton"
        color="white"
        _hover={{ bg: "primary", opacity: 0.9 }}
        _active={{ bg: "primary", opacity: 0.8 }}
      >
        AI Screen Share
      </Button>
    </Flex>
  );
};

export default DashboardTopbar;
