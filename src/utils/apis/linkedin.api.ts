import { useQuery } from "@tanstack/react-query"; // ← use from `@tanstack/react-query` instead of Chakra
import axios from "axios";

const getLinkedinAuthUrl = async () => {
  const response = await axios.get(`https://server.overos.xyz/linkedin/api/`);
  return response.data;
};

export const useGetLinkedinAuthUrl = () => {
  return useQuery({
    queryKey: ["linkedinAuth"],
    queryFn: getLinkedinAuthUrl,
  });
};
