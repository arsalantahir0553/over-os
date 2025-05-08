import { Container } from "@chakra-ui/react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layout";
import Home from "./pages/home";
import WaitingList from "./pages/waiting-list";

const App = () => {
  return (
    <Router>
      <Layout>
        <Toaster position="top-center" />
        <Container maxW="7xl" px={{ base: 2, md: 8 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/waiting-list" element={<WaitingList />} />
          </Routes>
        </Container>
      </Layout>
    </Router>
  );
};

export default App;
