import {
  Container,
  Heading,
  Icon,
  Text,
  VStack,
  Button,
} from "@chakra-ui/react";
import { MdEmail } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PleaseVerifyEmail = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="md" centerContent py={20}>
      <VStack spacing={6} textAlign="center">
        <Icon as={MdEmail} boxSize={16} color="blue.400" />
        <Heading as="h2" size="xl">
          Verify Your Email Address
        </Heading>
        <Text fontSize="lg" color="gray.600">
          We have sent a verification link to your email. Please check your
          inbox (and spam folder) and click on the link to activate your
          account.
        </Text>
        <Button colorScheme="blue" onClick={() => navigate("/signin")}>
          Back to Login
        </Button>
      </VStack>
    </Container>
  );
};

export default PleaseVerifyEmail;
