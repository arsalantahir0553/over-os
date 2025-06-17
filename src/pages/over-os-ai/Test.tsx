import { buildLinkedinAuthUrl } from "@/utils/apis/linkedin.api";
import { Button } from "@chakra-ui/react";

const Test = () => {
  const handleLogin = () => {
    const authUrl = buildLinkedinAuthUrl();
    window.location.href = authUrl;
  };

  return (
    <Button colorScheme="linkedin" onClick={handleLogin}>
      Login with LinkedIn
    </Button>
  );
};

export default Test;
