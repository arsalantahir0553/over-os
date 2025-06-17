import { useGetLinkedinDetails } from "@/utils/apis/linkedin.api";
import React from "react";
import { useLocation } from "react-router-dom";

const LinkedInCallback = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code") || "";
  const state = params.get("state") || "";

  const { data, isLoading, error } = useGetLinkedinDetails(code, state);

  React.useEffect(() => {
    if (data) {
      console.log("✅ LinkedIn Details:", data);
    }
    if (error) {
      console.error("❌ Error fetching LinkedIn details:", error);
    }
  }, [data, error]);

  return (
    <div>
      <h2>LinkedIn Callback</h2>
      {isLoading && <p>Loading...</p>}
      {!isLoading && !error && (
        <>
          <p>
            <strong>Code:</strong> {code}
          </p>
          <p>
            <strong>State:</strong> {state}
          </p>
        </>
      )}
      {error && <p>Something went wrong fetching LinkedIn data.</p>}
    </div>
  );
};

export default LinkedInCallback;
