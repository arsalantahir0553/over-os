import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerPositioner,
  Flex,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import Logo from "../assets/svgs/logo.svg";
import { CustomDialog } from "./CustomModal";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Box as="header" px={{ base: 4, md: 10 }} py={4}>
      <Flex align="center" justify="space-between">
        {/* Logo */}
        <Image src={Logo} maxH="40px" />

        {isMobile ? (
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <IconButton
                aria-label="Open menu"
                variant="ghost"
                onClick={onOpen}
              >
                <FiMenu />
              </IconButton>
            </Drawer.Trigger>

            <DrawerPositioner>
              <DrawerContent>
                <DrawerBody mt={10}>
                  <VStack align="start" gap={6}>
                    <Text cursor="pointer" onClick={onClose}>
                      Home
                    </Text>
                    <Text cursor="pointer" onClick={onClose}>
                      Features
                    </Text>
                    <Text cursor="pointer" onClick={onClose}>
                      Pricing
                    </Text>
                    <Text cursor="pointer" onClick={onClose}>
                      Contact
                    </Text>

                    <Button
                      colorScheme="blue"
                      borderRadius="full"
                      width="100%"
                      onClick={() => {
                        onClose();
                        setIsOpen(true);
                      }}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </DrawerPositioner>
          </Drawer.Root>
        ) : (
          <Flex align="center" gap={12}>
            <Flex align="center" gap={6}>
              <Text cursor="pointer">Home</Text>
              <Text cursor="pointer">Features</Text>
              <Text cursor="pointer">Pricing</Text>
              <Text cursor="pointer">Contact</Text>
            </Flex>

            <Flex align="center" gap={4}>
              <IconButton aria-label="Search" variant="ghost">
                <LuSearch />
              </IconButton>
              <Button
                colorScheme="blue"
                borderRadius="full"
                size="lg"
                onClick={() => setIsOpen(true)}
              >
                Get Started
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>

      {/* Waitlist Dialog */}
      <CustomDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        headerText="Join Our Waitlist"
        cancelText="Close"
        submitText="Join Waitlist"
        onSubmit={() => {
          console.log("Form submitted");
          setIsOpen(false);
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Waitlist submitted");
            setIsOpen(false);
          }}
        >
          <Flex direction="column" gap={4}>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Name</Text>
              <Input placeholder="John Doe" name="name" required />
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Work Email</Text>
              <Input
                placeholder="johndoe@example.com"
                type="email"
                name="workEmail"
                required
              />
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Linked Profile</Text>
              <Input
                placeholder="https://linkedin.com/johndoe"
                type="text"
                name="linkedin"
                required
              />
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">How did you hear about us?</Text>
              <Input
                placeholder="Social Media"
                type="text"
                name="hearabout"
                required
              />
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Your Interest</Text>
              <Input
                placeholder="Tell us about your interests"
                type="text"
                name="interest"
                required
              />
            </Flex>
          </Flex>
        </form>
      </CustomDialog>
    </Box>
  );
};

export default TopBar;
