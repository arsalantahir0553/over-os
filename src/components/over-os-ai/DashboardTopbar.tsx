import { Button, Flex, IconButton } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";

const DashboardTopbar = () => {
  return (
    <Flex
      as="header"
      align="center"
      justify="flex-end"
      px={6}
      py={4}
      bg="gray.50"
      boxShadow="sm"
      gap={3}
      borderBottomColor={"gray.200"}
      borderBottomWidth={"1px"}
    >
      {/* Search Icon - right side */}
      <IconButton
        icon={<FiSearch color="gray" />}
        aria-label="Search"
        variant="ghost"
        fontSize="23px"
      />

      {/* Share button with text and icon */}
      <Button
        rounded={"full"}
        variant="solid"
        fontSize={"22px"}
        fontWeight={400}
        fontFamily={"Inter"}
        px={6}
        bg={"primary.500"}
        color={"white"}
        _hover={{ bg: "#1E5AAB" }}
        _active={{ bg: "#184A8F" }}
      >
        Ai Screen Share
      </Button>
    </Flex>
  );
};

export default DashboardTopbar;
