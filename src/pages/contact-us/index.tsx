import {
  Box,
  Button,
  Container,
  Flex,
  Input,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSendEmail } from "@/utils/apis/waiting-list.api";

const ContactUs = () => {
  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    linkedInProfile: "",
    referralSource: "",
    feedback: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [errors, setErrors] = useState({
    fullName: false,
    workEmail: false,
    referralSource: false,
  });

  const { mutate: sendEmail, isPending: isSendEmailPending } = useSendEmail();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = () => {
    const newErrors = {
      fullName: form.fullName.trim() === "",
      workEmail: form.workEmail.trim() === "",
      referralSource: form.referralSource.trim() === "",
    };

    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    sendEmail(
      {
        to: form.workEmail,
        subject: "OverOS - a new user submitted the contact us form",
        message: form,
      },
      {
        onSuccess: () => {
          toast.success("Email sent successfully!");
          setForm({
            fullName: "",
            workEmail: "",
            linkedInProfile: "",
            referralSource: "",
            feedback: "",
          });
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          const message =
            error?.response?.data?.message ||
            "Something went wrong. Please try again.";
          toast.error(message);
        },
      }
    );
  };

  return (
    <Container maxW="7xl" px={{ base: 2, md: 8 }}>
      <Box py={10} maxW="lg" mx="auto">
        <Text fontSize="2xl" fontWeight="bold" mb={6}>
          Express Your Interest
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
              name: "feedback",
              label: "How can we help?",
              placeholder: "",
              isTextarea: true,
            },
          ].map(({ name, label, placeholder, type = "text", isTextarea }) => (
            <Flex direction="column" gap={1} key={name}>
              <Text fontSize="14px">{label}</Text>
              {isTextarea ? (
                <Textarea
                  name={name}
                  placeholder={placeholder}
                  value={form[name as keyof typeof form]}
                  onChange={handleInputChange}
                />
              ) : (
                <Input
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={form[name as keyof typeof form]}
                  onChange={handleInputChange}
                />
              )}
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
            isLoading={isSendEmailPending}
          >
            Submit
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default ContactUs;
