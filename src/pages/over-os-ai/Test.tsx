import { useGetLinkedinAuthUrl } from "@/utils/apis/linkedin.api";
import { Button, Spinner } from "@chakra-ui/react";
import { useEffect } from "react";

const Test = () => {
  const { data, refetch, isFetching } = useGetLinkedinAuthUrl();

  useEffect(() => {
    if (data?.url) {
      window.location.href = data.url;
    }
  }, [data]);

  return (
    <Button
      colorScheme="linkedin"
      onClick={() => refetch()}
      isLoading={isFetching}
    >
      {isFetching ? <Spinner size="sm" /> : "Login with LinkedIn"}
    </Button>
  );
};

export default Test;
