import {
  Box,
  Container,
  Flex,
  Stack,
  Text,
  Heading,
  Input,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { FaYoutube, FaGithub, FaInstagram, FaArrowRight } from "react-icons/fa";

const Footer = () => {
  return (
    <Box py={16}>
      <Container maxW="7xl" px={{ base: 4, md: 8 }}>
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          gap={10}
        >
          {/* Logo & Description */}
          <Box maxW="300px">
            <Heading size="md" mb={2} color="blue.600">
              OverOS
            </Heading>
            <Text fontSize="sm">
              A smart execution system that transforms everyday tasks into
              seamless automated workflows.
            </Text>
          </Box>

          {/* Link Sections */}
          <Flex
            gap={10}
            flex="1"
            wrap="wrap"
            justify={{ base: "flex-start", md: "space-between" }}
          >
            <Stack gap={2} minW="120px">
              <Text fontWeight="bold" mb={2}>
                Product
              </Text>
              <Link href="#">Features</Link>
              <Link href="#">Workflow Library</Link>
              <Link href="#">Use Cases</Link>
              <Link href="#">Demo Request</Link>
            </Stack>

            <Stack gap={2} minW="120px">
              <Text fontWeight="bold" mb={2}>
                Company
              </Text>
              <Link href="#">About Us</Link>
              <Link href="#">Founders</Link>
              <Link href="#">Contact</Link>
            </Stack>

            {/* Newsletter Signup */}
            <Box minW="260px">
              <Text fontWeight="bold" mb={2}>
                Newsletter Signup
              </Text>
              <Text fontSize="sm" mb={4}>
                Stay updated with the latest from OverOS
              </Text>
              <Flex as="form" gap={2}>
                <Input placeholder="Send Message" size="sm" bg="white" />
                <IconButton colorScheme="blue" aria-label="Send" size="sm">
                  <FaArrowRight />
                </IconButton>
              </Flex>

              {/* Social Icons */}
              <Flex mt={4} gap={3}>
                <IconButton
                  aria-label="YouTube"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <FaYoutube />
                </IconButton>
                <IconButton
                  aria-label="GitHub"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <FaGithub />
                </IconButton>
                <IconButton
                  aria-label="Instagram"
                  variant="ghost"
                  colorScheme="blue"
                >
                  <FaInstagram />
                </IconButton>
              </Flex>
            </Box>
          </Flex>
        </Flex>
      </Container>
    </Box>
  );
};

export default Footer;
