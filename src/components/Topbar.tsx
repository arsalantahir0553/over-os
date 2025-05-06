import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerPositioner,
  Flex,
  IconButton,
  Image,
  Input,
  Text,
  VStack,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { FiMenu } from "react-icons/fi";
import { LuSearch } from "react-icons/lu";
import Logo from "../assets/svgs/logo.svg";
import { CustomDialog } from "./CustomModal";
import { useJoinWaitingList } from "@/utils/apis/waiting-list.api";
import toast from "react-hot-toast";

const TopBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { onOpen, onClose } = useDisclosure();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const [form, setForm] = useState({
    fullName: "",
    workEmail: "",
    linkedInProfile: "",
    referralSource: "",
    interestDescription: "",
  });

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

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;

    mutate(form, {
      onSuccess: () => {
        toast.success("Successfully joined the waitlist!");
        setIsOpen(false);
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
    <Box as="header" px={{ base: 4, md: 10 }} py={4}>
      <Flex align="center" justify="space-between">
        <Image src={Logo} maxH="40px" />

        {isMobile ? (
          <Drawer.Root>
            <Drawer.Trigger asChild>
              <IconButton
                aria-label="Open menu"
                variant="ghost"
                onClick={onOpen}
              >
                <FiMenu />
              </IconButton>
            </Drawer.Trigger>
            <DrawerPositioner>
              <DrawerContent>
                <DrawerBody mt={10}>
                  <VStack align="start" gap={6}>
                    {["Home", "Features", "Pricing", "Contact"].map((text) => (
                      <Text key={text} cursor="pointer" onClick={onClose}>
                        {text}
                      </Text>
                    ))}
                    <Button
                      colorScheme="blue"
                      borderRadius="full"
                      width="100%"
                      onClick={() => {
                        onClose();
                        setIsOpen(true);
                      }}
                    >
                      Get Started
                    </Button>
                  </VStack>
                </DrawerBody>
              </DrawerContent>
            </DrawerPositioner>
          </Drawer.Root>
        ) : (
          <Flex align="center" gap={12}>
            <Flex align="center" gap={6}>
              {["Home", "Features", "Pricing", "Contact"].map((text) => (
                <Text key={text} cursor="pointer">
                  {text}
                </Text>
              ))}
            </Flex>
            <Flex align="center" gap={4}>
              <IconButton aria-label="Search" variant="ghost">
                <LuSearch />
              </IconButton>
              <Button
                colorScheme="blue"
                borderRadius="full"
                size="lg"
                onClick={() => setIsOpen(true)}
              >
                Get Started
              </Button>
            </Flex>
          </Flex>
        )}
      </Flex>

      <CustomDialog
        open={isOpen}
        onOpenChange={setIsOpen}
        headerText="Join Our Waitlist"
        cancelText="Close"
        submitText="Join Waitlist"
        onSubmit={handleSubmit}
        isLoading={isPending}
      >
        <Box>
          <Flex direction="column" gap={4}>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Name</Text>
              <Input
                placeholder="John Doe"
                name="fullName"
                value={form.fullName}
                onChange={handleInputChange}
              />
              {errors.fullName && (
                <Text color="red.500" fontSize="sm">
                  {"Name is Required"}
                </Text>
              )}
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Work Email</Text>
              <Input
                placeholder="johndoe@example.com"
                type="email"
                name="workEmail"
                value={form.workEmail}
                onChange={handleInputChange}
              />
              {errors.workEmail && (
                <Text color="red.500" fontSize="sm">
                  {"Email is Required"}
                </Text>
              )}
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">LinkedIn Profile (optional)</Text>
              <Input
                placeholder="https://linkedin.com/in/username"
                type="text"
                name="linkedInProfile"
                value={form.linkedInProfile}
                onChange={handleInputChange}
              />
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">How did you hear about us?</Text>
              <Input
                placeholder="Social Media"
                name="referralSource"
                value={form.referralSource}
                onChange={handleInputChange}
              />
              {errors.referralSource && (
                <Text color="red.500" fontSize="sm">
                  {"Referral source is Required"}
                </Text>
              )}
            </Flex>
            <Flex direction="column" gap={1.5}>
              <Text fontSize="14px">Your Interest</Text>
              <Input
                placeholder="Tell us about your interests"
                name="interestDescription"
                value={form.interestDescription}
                onChange={handleInputChange}
              />
              {errors.interestDescription && (
                <Text color="red.500" fontSize="sm">
                  {"Interest description is Required"}
                </Text>
              )}
            </Flex>
          </Flex>
        </Box>
      </CustomDialog>
    </Box>
  );
};

export default TopBar;
