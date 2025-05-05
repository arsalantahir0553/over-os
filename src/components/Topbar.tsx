import { Box, Flex, Text, Button, IconButton } from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";

const TopBar = () => {
  return (
    <Box as="header" pl={10} pr={20} py={4}>
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Text fontSize="xl" fontWeight="bold">
          OverOS
        </Text>

        <Flex gapX={20}>
          <Flex align="center" gap={6}>
            <Text cursor="pointer">Home</Text>
            <Text cursor="pointer">Features</Text>
            <Text cursor="pointer">Pricing</Text>
            <Text cursor="pointer">Contact</Text>
          </Flex>

          {/* Search and Get Started Button */}
          <Flex align="center" gap={4}>
            <IconButton aria-label="Search" variant="ghost">
              <LuSearch />
            </IconButton>
            <Button colorPalette={"blue"} borderRadius="full" size="lg">
              Get Started
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  );
};

export default TopBar;
