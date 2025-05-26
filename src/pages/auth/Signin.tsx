import GoogleLoginButton from "@/components/GoogleLoginButton";
import { useLogin, useSignup, useVerifyEmail } from "@/utils/apis/auth.api";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import OverOsLogo from "../../assets/svgs/overos-ai-beta-auth-logo.svg";

const Signin = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [step, setStep] = useState<"email" | "login" | "signup">("email");
  const toast = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const verifyEmail = useVerifyEmail();
  const signup = useSignup();
  const login = useLogin();
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleContinue = async () => {
    if (!form.email) return;
    if (!captchaToken) {
      toast({
        title: "CAPTCHA required",
        description: "Please verify you're not a robot.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    try {
      const res = await verifyEmail.mutateAsync(form.email);
      setStep(res.isNewUser ? "signup" : "login");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        title: "Error verifying email",
        description: "Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleAuth = async () => {
    try {
      if (step === "login") {
        const res = await login.mutateAsync({
          email: form.email,
          password: form.password,
        });
        localStorage.setItem("token", res.token);
        toast({ title: "Login successful", status: "success" });
        navigate("/dashboard");
      } else {
        await signup.mutateAsync(form);
        toast({
          title:
            "Signup Successfull, Please check you inbox for verification email",
          status: "success",
        });
        navigate("/verify");
        // navigate("/dashboard");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast({
        title: "Authentication Failed",
        description: err.response?.data?.message || "Check credentials",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const loading = verifyEmail.isPending || signup.isPending || login.isPending;

  return (
    <>
      <Box pl={10} pt={10}>
        <Image
          src={OverOsLogo}
          cursor={"pointer"}
          onClick={() => navigate("/dashboard")}
        />
      </Box>
      <Flex minH="85vh" align="center" justify="center" bg="white">
        <VStack spacing={6} w="full" maxW="469px" px={6}>
          <Text fontSize="30px" letterSpacing={"8%"} fontWeight={700}>
            Welcome Back
          </Text>

          {step === "signup" && (
            <FormControl id="name" position="relative">
              <FormLabel
                position="absolute"
                top="-3"
                left="4"
                bg="white"
                px="1"
                fontSize="sm"
                fontWeight="semibold"
                color="blue.600"
                zIndex={10}
              >
                Name
              </FormLabel>
              <Input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                h="55px"
                pl={4}
                borderColor="blue.500"
                focusBorderColor="blue.600"
              />
            </FormControl>
          )}

          <FormControl id="email" position="relative">
            <FormLabel
              position="absolute"
              top="-3"
              left="4"
              bg="white"
              px="1"
              fontSize="sm"
              fontWeight="semibold"
              color="blue.600"
              zIndex={10}
            >
              Email Address
            </FormLabel>
            <Input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              isDisabled={step !== "email"}
              h="55px"
              pl={4}
              borderColor="blue.500"
              focusBorderColor="blue.600"
            />
          </FormControl>
          {(step === "login" || step === "signup") && (
            <FormControl id="password" position="relative">
              <FormLabel
                position="absolute"
                top="-3"
                left="4"
                bg="white"
                px="1"
                fontSize="sm"
                fontWeight="semibold"
                color="blue.600"
                zIndex={10}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  h="55px"
                  pl={4}
                  borderColor="blue.500"
                  focusBorderColor="blue.600"
                />
                <InputRightElement h="full" pr={3}>
                  <Button
                    variant="ghost"
                    opacity={0.8}
                    size={"2px"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? <EyeClosedIcon /> : <EyeIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>
          )}

          <Button
            colorScheme="blue"
            w="full"
            h="55px"
            onClick={step === "email" ? handleContinue : handleAuth}
            isLoading={loading}
          >
            {step === "email"
              ? "Continue"
              : step === "login"
              ? "Login"
              : "Signup"}
          </Button>

          {step === "login" && (
            <Text
              fontSize="sm"
              color="blue.500"
              alignSelf="flex-end"
              cursor="pointer"
              onClick={() =>
                navigate(
                  `/request-reset?email=${encodeURIComponent(form.email)}`
                )
              }
            >
              Forgot password?
            </Text>
          )}

          <HStack w="full" align="center" my={2}>
            <Divider />
            <Text fontSize="sm" color="gray.500" px={2}>
              OR
            </Text>
            <Divider />
          </HStack>

          <VStack spacing={3} w="full">
            <GoogleLoginButton />
          </VStack>

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token: string | null) => setCaptchaToken(token)}
          />
        </VStack>
      </Flex>
    </>
  );
};

export default Signin;
