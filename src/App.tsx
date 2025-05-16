import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Layout from "./layout";
import ContactUs from "./pages/contact-us";
import Home from "./pages/home";
import WaitingList from "./pages/waiting-list";
import PrivacyPolicy from "./pages/privacy-policy";
import EULA from "./pages/eula/EULA";

const App = () => {
  return (
    <Router>
      <Layout>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/waiting-list" element={<WaitingList />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/eula" element={<EULA />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
