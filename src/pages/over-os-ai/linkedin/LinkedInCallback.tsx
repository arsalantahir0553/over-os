import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const LinkedInCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);

  const userId = params.get("user_id");

  useEffect(() => {
    if (userId) {
      localStorage.setItem("linkedin_user_id", userId);
      console.log("✅ LinkedIn User ID saved:", userId);

      // Optionally redirect to dashboard or wherever
      // navigate("/workflow/linkedin", { replace: true });
    } else {
      console.error("❌ user_id not found in URL.");
    }
  }, [userId, navigate]);

  return (
    <div>
      <h2>LinkedIn Callback</h2>
      {userId ? (
        <p>Saving your LinkedIn login...</p>
      ) : (
        <p>Missing user ID in the callback URL.</p>
      )}
    </div>
  );
};

export default LinkedInCallback;
