import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LinkedInCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const statusCode = params.get("status_code");

    if (statusCode === "200") {
      // Update LinkedIn connection status in local storage
      localStorage.setItem("is_linkedin_connected", "true");
      console.log("✅ LinkedIn connection successful");

      // Redirect to LinkedIn workflow page
      navigate("/workflow/linkedin", { replace: true });
    } else {
      console.error("❌ LinkedIn connection failed");
      // Optionally redirect to an error page or back to the login
      navigate("/workflow/linkedin", { replace: true });
    }
  }, [location.search, navigate]);

  return (
    <div>
      <h2>LinkedIn Callback</h2>
      <p>Processing your login...</p>
    </div>
  );
};

export default LinkedInCallback;
