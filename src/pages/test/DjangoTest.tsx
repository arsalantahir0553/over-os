import { useChat } from "@/utils/apis/chat-sessions";
import { Button, Spinner, Text } from "@chakra-ui/react"; // Optional: Chakra UI components

const DjangoTest = () => {
  const { mutate, data, isPending, isSuccess, isError, error } = useChat();

  const handleChat = () => {
    mutate("create a linkedin post for me regarding ai");
  };

  return (
    <div>
      <Button onClick={handleChat} colorScheme="teal">
        Send Prompt
      </Button>

      {isPending && <Spinner size="sm" ml={4} />}
      {isSuccess && (
        <Text mt={4} color="green.300">
          Response: {JSON.stringify(data)}
        </Text>
      )}
      {isError && (
        <Text mt={4} color="red.300">
          Error: {error.message}
        </Text>
      )}
    </div>
  );
};

export default DjangoTest;
