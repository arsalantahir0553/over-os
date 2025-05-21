import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Image,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaStar } from "react-icons/fa";
import graphImage from "../../assets/images/graph.png";
import TestimonialImage from "../../assets/images/testimonial.png";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const SmartInvoiceModal = ({ isOpen, onClose }: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent p={6} borderRadius="xl" maxW="1062px">
        <ModalCloseButton />
        <Box pt={6}>
          <Text
            fontSize="36px"
            fontWeight="400"
            fontFamily={"Joan"}
            textAlign="center"
            mb={3}
          >
            Smart Invoice Processing into Quickbooks
          </Text>

          <Text
            textAlign="center"
            color="gray.600"
            mb={6}
            fontWeight={300}
            fontSize="15px"
            maxW={"820px"}
            mx={"auto"}
          >
            Manual invoice processing is a top pain point for accountants and
            finance teams. This workflow uses AI to automate invoice extraction,
            categorization, and integration with accounting software—cutting
            processing time by over 80% and reducing error rates dramatically.
          </Text>

          <Center mb={6} w={"full"}>
            <Button
              bg={"primary.500"}
              borderRadius="full"
              fontSize={"22px"}
              size={"md"}
              fontWeight={400}
              px={16}
              color={"white"}
              fontFamily={"Inter"}
              _hover={{
                bg: "brand.500",
              }}
            >
              Try Now
            </Button>
          </Center>

          <Flex justify="center" gap={2} mb={6} wrap="wrap">
            {["Invoices", "Accounting", "Bookkeeping"].map((tag) => (
              <Tag
                key={tag}
                size="lg"
                px={6}
                py={2}
                variant={"ghost"}
                borderWidth={"1px"}
                borderColor={"gray.200"}
                color={"gray.700"}
                borderRadius="full"
                cursor={"pointer"}
                _hover={{
                  bg: "gray.50",
                }}
              >
                {tag}
              </Tag>
            ))}
          </Flex>

          <Box position={"relative"} mt={32}>
            <Box
              bg={"brand.900"}
              w={"980px"}
              mx={"auto"}
              borderRadius={"15px"}
              h={"295px"}
            >
              <Image
                src={graphImage}
                alt="Workflow Diagram"
                borderRadius="lg"
                top={-12}
                mb={6}
                left={"90px"}
                w={"830px"}
                position={"absolute"}
              />
            </Box>
          </Box>

          <Flex
            justify="space-between"
            mx={4}
            gap={4}
            mb={8}
            mt={20}
            wrap="wrap"
          >
            <Box
              flex="1"
              p={4}
              bg="gray.50"
              border="1px solid"
              borderColor="primary.300"
              borderRadius="md"
              minH="300px"
              minW="250px"
            >
              <Flex direction="column" justify="center" h="100%" pl={4}>
                <Text
                  fontWeight={400}
                  fontFamily={"Joan"}
                  fontSize={"30px"}
                  mb={2}
                >
                  Who This Is For
                </Text>
                <Box as={"ul"} listStyleType={"none"} fontWeight={350}>
                  <Box fontSize={"15px"} as={"li"}>
                    Accountants and bookkeepers
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Freelancers and consultants
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Small to mid-sized business owners
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Finance teams handling recurring vendor invoices and
                    receipts
                  </Box>
                </Box>
              </Flex>
            </Box>

            <Box
              flex="1"
              p={4}
              bg="gray.50"
              border="1px solid"
              borderColor="primary.300"
              borderRadius="md"
              minH="300px"
              minW="250px"
            >
              <Flex direction="column" justify="center" h="100%" pl={4}>
                <Text
                  fontWeight={400}
                  fontFamily={"Joan"}
                  fontSize={"30px"}
                  mb={2}
                >
                  Key Benefits
                </Text>
                <Box as={"ul"} listStyleType={"none"} fontWeight={350}>
                  <Box fontSize={"15px"} as={"li"}>
                    Save Hours Every Week
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Drastically Reduce Errors
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Instant, Smart Categorization
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Seamless QuickBooks Integration
                  </Box>
                  <Box fontSize={"15px"} as={"li"}>
                    Faster Month-End Close
                  </Box>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Divider mb={6} />

          <VStack spacing={4} pb={10}>
            <Text
              fontWeight="400"
              fontFamily={"Joan"}
              fontSize="30px"
              letterSpacing={"1%"}
            >
              What users say
            </Text>
            <Image
              src={TestimonialImage}
              alt="User Testimonial"
              borderRadius="full"
              w="60px"
              h="60px"
            />
            <Text fontWeight="400" fontSize={"21.8px"} lineHeight={"150%"}>
              Arsalan Hanif
            </Text>
            <Text
              fontWeight="400"
              fontSize={"16.35px"}
              lineHeight={"150%"}
              color={"primary.400"}
            >
              Head of Automation @ InvoiceAI
            </Text>
            <Flex gap={1}>
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar key={i} color="#fbbf24" />
              ))}
            </Flex>
            <Text
              fontWeight="400"
              fontSize={"15px"}
              lineHeight={"144%"}
              color={"primary.400"}
              maxW="700px"
              textAlign="center"
            >
              This is absolutely revolutionary. I’ve been waiting on an
              accountant for 12 years and this can be game changing for heavy
              analytics and categorized receipts & invoices.
            </Text>
          </VStack>
        </Box>
      </ModalContent>
    </Modal>
  );
};

export default SmartInvoiceModal;
