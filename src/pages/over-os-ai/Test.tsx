import { useGetLinkedinAuthUrl } from "@/utils/apis/linkedin.api";
import { Button } from "@chakra-ui/react";

const Test = () => {
  const { refetch, isFetching } = useGetLinkedinAuthUrl();

  const handleLogin = async () => {
    try {
      const { data } = await refetch(); // manually refetch the LinkedIn URL

      const originalUrl = data?.linkedin_login_url || data?.url;
      if (!originalUrl) {
        console.error("LinkedIn login URL missing in API response");
        return;
      }

      const url = new URL(originalUrl);
      url.searchParams.set(
        "redirect_uri",
        "https://overos.xyz/linkedin/callback"
      );

      window.location.href = url.toString();
    } catch (err) {
      console.error("Failed to fetch LinkedIn auth URL:", err);
    }
  };

  return (
    <Button colorScheme="blue" onClick={handleLogin} isLoading={isFetching}>
      {isFetching ? "Redirecting..." : "Login with LinkedIn"}
    </Button>
  );
};

export default Test;
