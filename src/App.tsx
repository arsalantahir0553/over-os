import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./layout";
import ContactUs from "./pages/contact-us";
import Home from "./pages/home";
import DashboardHome from "./pages/over-os-ai";
import OverOsLayout from "./pages/over-os-ai/layout";
import WaitingList from "./pages/waiting-list";
import Chat from "./pages/over-os-ai/chat";
import WorkflowLibrary from "./pages/over-os-ai/workflow-library";

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
          <Route path="/chat" element={<Chat />} />
          <Route path="/explore" element={<WorkflowLibrary />} />
          {/* Add more internal routes here */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
