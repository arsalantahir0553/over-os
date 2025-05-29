import { useGetUserId } from "@/utils/apis/overos.api";
import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Callback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { mutate: getUserId } = useGetUserId();

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const realmId = searchParams.get("realmId");

    if (code && state && realmId) {
      getUserId(
        { code, state, realmId }, // optional
        {
          onSuccess: (data) => {
            localStorage.setItem("user_id", data.user_id);
            localStorage.setItem("realm_id", data.realm_id);
            navigate("/chat");
          },
          onError: (error) => {
            console.error("OAuth callback failed:", error);
            alert("Authentication failed. Please try again.");
          },
        }
      );
    }
  }, [searchParams, getUserId, navigate]);

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h2>Authenticating...</h2>
      <p>Please wait while we process your login.</p>
    </div>
  );
};

export default Callback;
