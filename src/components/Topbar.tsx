import {
  Box,
  Flex,
  Text,
  Button,
  IconButton,
  Image,
  Input,
} from "@chakra-ui/react";
import { LuSearch } from "react-icons/lu";
import Logo from "../assets/svgs/logo.svg";
import { CustomDialog } from "./CustomModal";
import { useState } from "react";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Box as="header" pl={10} pr={20} py={4}>
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Image src={Logo} />

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
            <Button
              colorPalette={"blue"}
              borderRadius="full"
              size="lg"
              onClick={() => setIsOpen(true)}
            >
              Get Started
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <CustomDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        headerText="Join Our Waitlist"
        cancelText="Close"
        submitText="Join Waitlist"
        onSubmit={() => {
          console.log("Form submitted"); // You can connect this to API later
          setIsOpen(false);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Waitlist submitted"); // replace with your form handling logic
            setIsOpen(false);
          }}
        >
          <Flex direction="column" gap={4}>
            <Input placeholder="Your Full Name" name="name" required />
            <Input
              placeholder="Email Address"
              type="email"
              name="email"
              required
            />
          </Flex>
        </form>
      </CustomDialog>
    </Box>
  );
};

export default TopBar;
