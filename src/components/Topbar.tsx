import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  Image,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import { useNavigate } from "react-router-dom";
import Logo from "../assets/svgs/logo.svg";

const TopBar = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleNav = (path?: string) => {
    if (path) navigate(path);
    onClose();
  };

  // const navLinks = [
  //   { title: "Home", url: "/" },
  //   { title: "Features", url: "#" },
  //   { title: "Pricing", url: "#" },
  //   { title: "Contact", url: "#" },
  // ];

  return (
    <Box as="header" px={{ base: 4, md: 10 }} py={4}>
      <Flex align="center" justify="space-between">
        <Image
          src={Logo}
          maxH="40px"
          cursor="pointer"
          onClick={() => navigate("/")}
        />

        {isMobile ? (
          <>
            <IconButton
              aria-label="Open menu"
              icon={<FiMenu />}
              variant="ghost"
              onClick={onOpen}
            />

            <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader mt={4}>Menu</DrawerHeader>
                <DrawerBody>
                  <VStack align="start" spacing={6} mt={4}>
                    {/* {navLinks.map((nav, index) => (
                      <Text key={index} cursor="pointer" fontSize="lg">
                        <Link to={nav.url}>{nav.title}</Link>
                      </Text>
                    ))} */}
                    <Button
                      colorScheme="blue"
                      borderRadius="full"
                      width="100%"
                      onClick={() => handleNav("/waiting-list")}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </>
        ) : (
          <Flex align="center" gap={12}>
            {/* <Flex align="center" gap={6}>
              {navLinks.map((nav, index) => (
                <Text key={index} cursor="pointer" fontWeight="medium">
                  <Link to={nav.url}>{nav.title}</Link>
                </Text>
              ))}
            </Flex> */}
            <Flex align="center" gap={4}>
              <IconButton
                aria-label="Search"
                variant="ghost"
                icon={<LuSearch />}
              />
              <Button
                colorScheme="blue"
                borderRadius="full"
                size="lg"
                onClick={() => navigate("/waiting-list")}
              >
                Get Started
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default TopBar;
