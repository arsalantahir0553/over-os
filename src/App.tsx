import { Container } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/home";
import WaitingList from "./pages/waiting-list";
import ContactUs from "./pages/contact-us";

const App = () => {
  return (
    <Router>
      <Layout>
        <Toaster position="top-center" />
        <Container maxW="7xl" px={{ base: 2, md: 8 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waiting-list" element={<WaitingList />} />
            <Route path="/contact-us" element={<ContactUs />} />
          </Routes>
        </Container>
      </Layout>
    </Router>
  );
};

export default App;
