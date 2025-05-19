import { Button, Flex, IconButton } from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import { PiShareFat } from "react-icons/pi";

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
        icon={<FiSearch />}
        aria-label="Search"
        variant="ghost"
        fontSize="20px"
      />

      {/* Share button with text and icon */}
      <Button
        rightIcon={<PiShareFat />}
        rounded={"full"}
        variant="solid"
        size={"sm"}
        fontWeight={400}
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
