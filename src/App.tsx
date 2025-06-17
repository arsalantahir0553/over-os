import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Layout from "./layout";
import ContactUs from "./pages/contact-us";
import Home from "./pages/home";
import DashboardHome from "./pages/over-os-ai";
import OverOsLayout from "./pages/over-os-ai/layout";
import WaitingList from "./pages/waiting-list";
import PrivacyPolicy from "./pages/privacy-policy";
import EULA from "./pages/eula/EULA";
import Chat from "./pages/over-os-ai/chat";
import WorkflowLibrary from "./pages/over-os-ai/workflow-library";
import Signin from "./pages/auth/Signin";
import ResetPassword from "./pages/auth/ForgotPassword";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import VerifyEmailPage from "./pages/auth/VerifiyEmail";
import PleaseVerifyEmail from "./pages/auth/PleaseVerifyEmail";
import Callback from "./pages/over-os-ai/chat/Callback";
import PrivateRoute from "./components/PrivateRoute";
import { cleanExpiredUserMeta } from "./utils/helpers/auth.helper";
import { useEffect } from "react";
import DemoChat from "./pages/over-os-ai/chat/DemoChat";
import WorkflowDetails from "./components/over-os-ai/WorkflowDetails";
import Test from "./pages/over-os-ai/Test";
import LinkedInCallback from "./pages/over-os-ai/linkedin/LinkedInCallback";

const App = () => {
  useEffect(() => {
    cleanExpiredUserMeta();
  }, []);
  return (
    <Router>
      <Toaster position="top-center" />
      <Routes>
        {/* Public-facing pages with main Layout */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/waiting-list" element={<WaitingList />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/eula" element={<EULA />} />
        </Route>

        {/* Dashboard pages with OverOs layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<OverOsLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/workflow/demo/:id" element={<DemoChat />} />
            <Route path="/workflow/details/:id" element={<WorkflowDetails />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/linkedin/callback" element={<LinkedInCallback />} />
            <Route path="/test" element={<Test />} />
          </Route>
        </Route>
        <Route element={<OverOsLayout />}>
          <Route path="/explore" element={<WorkflowLibrary />} />
        </Route>

        <Route path="signin" element={<Signin />} />
        <Route path="request-reset" element={<ResetPassword />} />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="verify" element={<PleaseVerifyEmail />} />
      </Routes>
    </Router>
  );
};

export default App;
