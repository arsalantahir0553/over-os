import { Box, Button, Container, Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useJoinWaitingList } from "@/utils/apis/waiting-list.api";

const WaitingList = () => {
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    linkedInProfile: "",
    referralSource: "",
    interestDescription: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errors, setErrors] = useState({
    fullName: false,
    workEmail: false,
    referralSource: false,
    interestDescription: false,
  });

  const { mutate, isPending } = useJoinWaitingList();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    const newErrors = {
      fullName: form.fullName.trim() === "",
      workEmail: form.workEmail.trim() === "",
      referralSource: form.referralSource.trim() === "",
      interestDescription: form.interestDescription.trim() === "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    mutate(form, {
      onSuccess: () => {
        toast.success("Successfully joined the waitlist!");
        setForm({
          fullName: "",
          workEmail: "",
          linkedInProfile: "",
          referralSource: "",
          interestDescription: "",
        });
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ||
          "Something went wrong. Please try again.";
        toast.error(message);
      },
    });
  };

  return (
    <Container maxW="7xl" px={{ base: 2, md: 8 }}>
      <Box mt={10} maxW="lg" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Join Our Waiting List
        </Text>
        <Flex direction="column" gap={4}>
          {[
            { name: "fullName", label: "Name", placeholder: "John Doe" },
            {
              name: "workEmail",
              label: "Work Email",
              placeholder: "john@example.com",
              type: "email",
            },
            {
              name: "linkedInProfile",
              label: "LinkedIn Profile (optional)",
              placeholder: "https://linkedin.com/in/username",
            },
            {
              name: "referralSource",
              label: "How did you hear about us?",
              placeholder: "Social Media",
            },
            {
              name: "interestDescription",
              label: "Your Interest",
              placeholder: "Tell us about your interests",
            },
          ].map(({ name, label, placeholder, type = "text" }) => (
            <Flex direction="column" gap={1} key={name}>
              <Text fontSize="14px">{label}</Text>
              <Input
                name={name}
                type={type}
                placeholder={placeholder}
                value={form[name as keyof typeof form]}
                onChange={handleInputChange}
              />
              {errors[name as keyof typeof errors] && (
                <Text color="red.500" fontSize="sm">
                  {`${label} is required`}
                </Text>
              )}
            </Flex>
          ))}
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isPending}
          >
            Join Waitlist
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default WaitingList;
