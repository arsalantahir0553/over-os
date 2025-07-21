import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import { useEffect } from "react";
import PrivateRoute from "./components/PrivateRoute";
import CategoryWorkflows from "./components/over-os-ai/CategoryWorkflows";
import WorkflowDetails from "./components/over-os-ai/WorkflowDetails";
import Layout from "./layout";
import ResetPassword from "./pages/auth/ForgotPassword";
import PleaseVerifyEmail from "./pages/auth/PleaseVerifyEmail";
import ResetPasswordPage from "./pages/auth/ResetPassword";
import Signin from "./pages/auth/Signin";
import VerifyEmailPage from "./pages/auth/VerifiyEmail";
import ContactUs from "./pages/contact-us";
import EULA from "./pages/eula/EULA";
import Home from "./pages/home";
import LinkedinLayout from "./pages/layouts/LinkedinLayout";
import DashboardHome from "./pages/over-os-ai";
import Test from "./pages/over-os-ai/Test";
import Callback from "./pages/over-os-ai/chat/Callback";
import DemoChat from "./pages/over-os-ai/chat/DemoChat";
import TempChatResponse from "./pages/over-os-ai/chat/TempChatResponse";
import DashboardLayout from "./pages/over-os-ai/layout";
import LinkedInCallback from "./pages/over-os-ai/linkedin/LinkedInCallback";
import LinkedinHistoryDetails from "./pages/over-os-ai/linkedin/LinkedinHistoryDetails";
import LinkedinWorkflow from "./pages/over-os-ai/linkedin/LinkedinWorkflow";
import WorkflowLibrary from "./pages/over-os-ai/workflow-library";
import PrivacyPolicy from "./pages/privacy-policy";
import WaitingList from "./pages/waiting-list";
import HomeWorkflowDetails from "./pages/workflow-details";
import { cleanExpiredUserMeta } from "./utils/helpers/auth.helper";
import WorkflowTest from "./pages/test/WorkflowTest";

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
          <Route
            path="/workflow-details/:id"
            element={<HomeWorkflowDetails />}
          />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/eula" element={<EULA />} />
        </Route>

        {/* Dashboard pages with OverOs layout */}
        <Route element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            {/* Chat is not functional at the moment thats why using tempchat  */}
            {/* <Route path="/chat" element={<Chat />} /> */}
            <Route path="/chat" element={<TempChatResponse />} />
            <Route path="/workflow/demo/:id" element={<DemoChat />} />
            <Route path="/workflow/details/:id" element={<WorkflowDetails />} />
            <Route
              path="/workflow/category/:category"
              element={<CategoryWorkflows />}
            />
            <Route path="/callback" element={<Callback />} />
            <Route path="/linkedin/callback" element={<LinkedInCallback />} />
            <Route path="/test" element={<Test />} />
          </Route>

          <Route element={<LinkedinLayout />}>
            <Route path="/workflow/linkedin" element={<LinkedinWorkflow />} />
            <Route path="/workflow/linkedin-test" element={<WorkflowTest />} />
            <Route
              path="/workflow/linkedin/:historyId"
              element={<LinkedinHistoryDetails />}
            />
          </Route>
        </Route>
        <Route element={<DashboardLayout />}>
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
