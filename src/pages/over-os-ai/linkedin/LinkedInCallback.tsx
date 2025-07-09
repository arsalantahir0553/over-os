import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LinkedInCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const userId = params.get("user_id");
    const status = params.get("status");
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const tokenType = params.get("token_type");

    if (userId && accessToken && refreshToken && tokenType) {
      localStorage.setItem("linkedin_user_id", userId);
      localStorage.setItem("linkedin_status", status || "");
      localStorage.setItem("linkedin_access_token", accessToken);
      localStorage.setItem("linkedin_refresh_token", refreshToken);
      localStorage.setItem("linkedin_token_type", tokenType);

      console.log("✅ LinkedIn login data saved to localStorage");

      navigate("/workflow/linkedin", { replace: true });
    } else {
      console.error("❌ Missing one or more LinkedIn callback parameters");
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
