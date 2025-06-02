import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
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
import { CheckCircleIcon, StarIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const peopleList = [
  "Accountants and bookkeepers to speedup their calculations",
  "Freelancers and consultants",
  "Small to mid-sized business owners",
  "Finance teams handling recurring vendor invoices and receipts",
];

const benefitsList = [
  "Eliminate time-consuming manual entry by automating invoice processing and categorization",
  "Minimize human mistakes like typos, duplicates, and misclassifications with AI-driven precision",
  "Invoices are intelligently classified using historical data, vendor profiles, and spending patterns",
];

const SmartInvoiceModal = ({ isOpen, onClose }: Props) => {
  const navigate = useNavigate();
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
              onClick={() => {
                navigate("/demo");
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

          <EnhancedInfoSection />

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

const InfoCard = ({
  title,
  subtitle,
  items,
  icon,
  color,
}: {
  title: string;
  subtitle?: string;
  items: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  color: string;
}) => (
  <Box
    flex="1"
    minW="280px"
    borderRadius="2xl"
    p={6}
    bgGradient={`linear(to-br, ${color}.50, white)`}
    boxShadow="md"
    border={`1px solid`}
    borderColor={`${color}.200`}
    transition="all 0.3s"
    _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
  >
    <Text fontSize="30px" fontWeight={40} fontFamily="Joan" mb={2}>
      {title}
    </Text>
    {subtitle && (
      <Text fontSize="sm" color="gray.500" mb={4}>
        {subtitle}
      </Text>
    )}

    <VStack align="start" spacing={3}>
      {items.map((item, idx) => (
        <Flex key={idx}>
          <Icon as={icon} mt={"5px"} color={`${color}.500`} mr={2} />
          <Text fontSize="15" fontWeight={350} color="gray.700">
            {item}
          </Text>
        </Flex>
      ))}
    </VStack>
  </Box>
);

const EnhancedInfoSection = () => {
  return (
    <Flex
      justify="space-between"
      mx={{ base: 4, md: 10 }}
      gap={8}
      mt={20}
      wrap="wrap"
      mb={16}
    >
      <InfoCard
        title="Who This Is For"
        subtitle="Ideal users who’ll benefit the most"
        items={peopleList}
        icon={StarIcon}
        color="blue"
      />

      <InfoCard
        title="Key Benefits"
        subtitle="What you gain by using our workflows"
        items={benefitsList}
        icon={CheckCircleIcon}
        color="green"
      />
    </Flex>
  );
};
