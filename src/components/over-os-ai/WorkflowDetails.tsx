import { useGetWorkflowById } from "@/utils/apis/workflow.api";
import {
  Box,
  Button,
  Center,
  Divider,
  Flex,
  Icon,
  Image,
  Spinner,
  Tag,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import { CheckCircleIcon, StarIcon } from "lucide-react";
import { FaStar } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import graphImage from "../../assets/images/graph.png";
import TestimonialImage from "../../assets/images/testimonial.png";
// import { useGetLinkedinAuthUrl } from "@/utils/apis/linkedin.api";
import { LoginRequiredModal } from "@/pages/over-os-ai/chat/LoginRequiredModal";
import { useQBLogin } from "@/utils/apis/overos.api";

const WorkflowDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data: workflow, isLoading, isError } = useGetWorkflowById(id!);
  // const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutate: triggerLogin, isPending } = useQBLogin();
  const {
    isOpen: isQuickbooksOpen,
    onOpen: onQuickbooksOpen,
    onClose: onQuickbooksClose,
  } = useDisclosure();
  // const { refetch, isFetching } = useGetLinkedinAuthUrl();

  // const handleLogin = async () => {
  //   try {
  //     const { data } = await refetch();
  //     const originalUrl = data?.linkedin_login_url || data?.url;
  //     if (!originalUrl) {
  //       console.error("LinkedIn login URL missing in API response");
  //       return;
  //     }
  //     window.location.href = originalUrl;
  //   } catch (err) {
  //     console.error("Failed to fetch LinkedIn auth URL:", err);
  //   }
  // };

  const handleQBLogin = async () => {
    await triggerLogin(undefined, {
      onSuccess: (data) => {
        localStorage.setItem("from_demo", "true");
        window.location.href = data.auth_url;
      },
      onError: (error) => {
        console.error("❌ Login API call failed:", error);
      },
    });
  };

  const handleTryNow = (workflowId: string) => {
    if (workflowId === "30579017-12c7-4058-859b-54825547b345") {
      navigate(`/workflow/linkedin`);
      // onOpen();
    } else if (workflowId === "9bfc211a-8b9c-47f1-b955-7312747ddf57") {
      onQuickbooksOpen();
    } else {
      navigate(`/dashboard?id=${workflowId}`);
    }
  };

  if (isLoading) {
    return (
      <Center py={20}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isError || !workflow) {
    return (
      <Center py={20}>
        <Text color="red.500">Failed to load workflow details.</Text>
      </Center>
    );
  }

  return (
    <Box
      maxW="1062px"
      mx="auto"
      p={{ base: 0, md: 6 }}
      borderRadius="xl"
      bg="surface"
    >
      <Box pt={6}>
        <Text
          fontSize={{ base: "28px", md: "36px" }}
          fontWeight="400"
          fontFamily="Joan"
          textAlign="center"
          mb={3}
          color="text"
        >
          {workflow.title}
        </Text>

        <Text
          textAlign="center"
          color="text"
          opacity={0.75}
          mb={6}
          fontWeight={300}
          fontSize="15px"
          maxW={"820px"}
          mx="auto"
        >
          {workflow.longDescription}
        </Text>

        <Center mb={6} w="full">
          <Button
            bg="surfaceButton"
            color="white"
            _hover={{ bg: "primary", opacity: 0.9 }}
            _active={{ bg: "primary", opacity: 0.8 }}
            borderRadius="8px"
            fontSize={{ base: "18px", md: "22px" }}
            size="md"
            fontWeight={400}
            px={{ base: 16, md: 16 }}
            fontFamily="Inter"
            onClick={() => handleTryNow(workflow.id)}
          >
            Try Now
          </Button>
        </Center>

        <Flex justify="center" gap={2} mb={6} wrap="wrap">
          {workflow.tags?.map((tag) => (
            <Tag
              key={tag}
              size={{ md: "lg", base: "sm" }}
              px={{ md: 6, base: 2 }}
              py={{ md: 2, base: 1.5 }}
              variant="outline"
              borderColor="border"
              color="text"
              borderRadius="full"
              cursor="pointer"
              _hover={{ bg: "cardBg" }}
            >
              {tag}
            </Tag>
          ))}
        </Flex>

        <Box position="relative" mt={{ base: 12, md: 32 }}>
          <Box
            bg="surfaceCardBg"
            w={{ base: "100%", md: "980px" }}
            mx="auto"
            borderRadius="15px"
            h={{ base: "100px", md: "295px" }}
            minH={{ md: "180px", base: "100px" }}
          >
            <Image
              src={workflow.bannerImage || graphImage}
              alt="Workflow Diagram"
              borderRadius="lg"
              position="absolute"
              top={{ base: -6, md: -12 }}
              left={{ base: "50%", md: "90px" }}
              transform={{ base: "translateX(-50%)", md: "none" }}
              w={{ base: "90%", md: "830px" }}
              mb={6}
            />
          </Box>
        </Box>

        <EnhancedInfoSection
          peopleList={workflow.whoIsItFor || []}
          benefitsList={workflow.keyBenefits || []}
        />

        <Divider mb={6} borderColor="border" />

        <VStack spacing={4} pb={10}>
          <Text
            fontWeight="400"
            fontFamily="Joan"
            fontSize={{ base: "24px", md: "30px" }}
            color="text"
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
          <Text
            fontWeight="400"
            fontSize="21.8px"
            lineHeight="150%"
            color="text"
          >
            Arsalan Hanif
          </Text>
          <Text
            fontWeight="400"
            fontSize="16.35px"
            lineHeight="150%"
            color="primary"
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
            fontSize="15px"
            lineHeight="144%"
            color="text"
            opacity={0.8}
            maxW="700px"
            textAlign="center"
          >
            This is absolutely revolutionary. I’ve been waiting on an accountant
            for 12 years and this can be game changing for heavy analytics and
            categorized receipts & invoices.
          </Text>
        </VStack>
      </Box>

      <LoginRequiredModal
        isOpen={isQuickbooksOpen}
        onClose={onQuickbooksClose}
        onLogin={handleQBLogin}
        isPending={isPending}
      />
    </Box>
  );
};

export default WorkflowDetails;

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
    minW={{ base: "100%", md: "280px" }}
    borderRadius="2xl"
    p={6}
    bg="surface2"
    border="1px solid"
    borderColor="border"
    transition="all 0.3s"
    _hover={{ boxShadow: "xl", transform: "translateY(-4px)" }}
  >
    <Text fontSize="30px" fontWeight={40} fontFamily="Joan" mb={2} color="text">
      {title}
    </Text>
    {subtitle && (
      <Text fontSize="sm" color="gray.400" mb={4}>
        {subtitle}
      </Text>
    )}
    <VStack align="start" spacing={3}>
      {items.map((item, idx) => (
        <Flex key={idx}>
          <Icon as={icon} mt="5px" color={`${color}.400`} mr={2} />
          <Text fontSize="15" fontWeight={350} color="text">
            {item}
          </Text>
        </Flex>
      ))}
    </VStack>
  </Box>
);

const EnhancedInfoSection = ({
  peopleList,
  benefitsList,
}: {
  peopleList: string[];
  benefitsList: string[];
}) => {
  return (
    <Flex
      direction={{ base: "column", md: "row" }}
      justify="space-between"
      mx={{ base: 0, md: 10 }}
      gap={8}
      mt={20}
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
