import { Container, Text, VStack } from "@chakra-ui/react";
import Founders from "../founders";
import Hero from "../hero/Hero";
import HowWeWork from "../how-we-work";
import DashboardWorkflows from "../over-os-ai/DashboardWorkflows";

const Home = () => {
  return (
    <>
      <Container maxW="7xl" px={{ base: 2, md: 8 }}>
        <Hero />
        <VStack mt={8}>
          <Text color="blue.500" fontWeight="semibold" mb={6} fontSize="sm">
            — Workflows —
          </Text>
          <DashboardWorkflows fromDashboard />
        </VStack>
        <HowWeWork />
      </Container>
      <Founders />
    </>
  );
};

export default Home;
