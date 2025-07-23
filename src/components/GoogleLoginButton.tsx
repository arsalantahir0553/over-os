import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function GoogleLoginButton() {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccess = async (credentialResponse: any) => {
    console.log("credentialResponse", credentialResponse);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_DJANGO_URL}/google/`,
        {
          access_token: credentialResponse.credential,
        }
      );
      console.log("res", res);
      localStorage.setItem("token", res.data.data.access);
      localStorage.setItem("refresh_token", res.data.data.refresh);
      localStorage.setItem(
        "is_linkedin_connected",
        res.data.data.is_linkedin_connected
      );
      localStorage.setItem(
        "user_name",
        res.data.data.first_name + " " + res.data.data.last_name
      );
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
    }
  };

  const handleError = () => {
    console.error("Login Failed");
  };

  return (
    <GoogleLogin
      width={"469px"}
      onSuccess={handleSuccess}
      onError={handleError}
      logo_alignment="center"
      text="continue_with"
      size="large"
      ux_mode="popup"
    />
  );
}

export default GoogleLoginButton;
