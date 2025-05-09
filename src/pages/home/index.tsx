import { Container } from "@chakra-ui/react";
import Founders from "../founders";
import Hero from "../hero/Hero";
import HowWeWork from "../how-we-work";

const Home = () => {
  return (
    <>
      <Container maxW="7xl" px={{ base: 2, md: 8 }}>
        <Hero />
        <HowWeWork />
      </Container>
      <Founders />
    </>
  );
};

export default Home;
