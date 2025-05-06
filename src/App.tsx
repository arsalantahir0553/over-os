import { Container } from "@chakra-ui/react";
import Layout from "./layout";
import Hero from "./pages/hero/Hero";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <Layout>
      <Toaster position="top-center" />
      <Container maxW="7xl" px={{ base: 2, md: 8 }}>
        <Hero />
      </Container>
    </Layout>
  );
};

export default App;
