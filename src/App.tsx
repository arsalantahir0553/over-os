import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Home from "./pages/home";
import ContactUs from "./pages/contact-us";
import WaitingList from "./pages/waiting-list";
import OverOsLayout from "./pages/over-os-ai/layout";
import Layout from "./layout";
import DashboardHome from "./pages/over-os-ai";
import ChatLoading from "./pages/over-os-ai/chat-loading";

const App = () => {
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public-facing pages */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/waiting-list" element={<WaitingList />} />
          <Route path="/contact-us" element={<ContactUs />} />
        </Route>

        {/* Dashboard routes with OverOs layout */}
        <Route element={<OverOsLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/search" element={<ChatLoading />} />
          {/* Add more internal routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
