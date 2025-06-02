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
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import OverOsLogo from "../../assets/svgs/overos-ai-beta-auth-logo.svg";

const inputStyle = {
  h: "55px",
  pl: 4,
  borderRadius: "8px",
  border: "1px solid",
  borderColor: "gray.300",
  bg: "white",
  _placeholder: { color: "gray.400" },
  _focus: {
    borderColor: "blue.500",
    boxShadow: "0 0 0 1px #3182ce",
  },
  fontSize: "sm",
};

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
            "Signup Successful, Please check your inbox for verification email",
          status: "success",
        });
        navigate("/verify");
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
    <Box bg={"#f5f5f5"}>
      <Box pl={10} pt={10}>
        <Image
          src={OverOsLogo}
          cursor={"pointer"}
          onClick={() => navigate("/dashboard")}
        />
      </Box>
      <Flex
        direction={"column"}
        minH="85vh"
        align="center"
        justify="center"
        bg={"#f5f5f5"}
        gap={10}
      >
        <VStack>
          <Text
            fontSize="30px"
            letterSpacing={"8%"}
            fontWeight={400}
            fontFamily={"Joan"}
          >
            {step === "signup" ? "Sign Up Page" : "Welcome Back"}
          </Text>

          <Text
            textAlign={"center"}
            fontSize={"14px"}
            lineHeight={"23px"}
            fontWeight={400}
            color={"black"}
            opacity={0.7}
            maxW={"570px"}
          >
            {step === "signup"
              ? "Create your account to unlock a powerful, AI-driven platform that simplifies your work, automates tasks, and connects seamlessly with your tools."
              : "Welcome back! Log in to access your personalized workspace, resume your tasks, and continue where you left off."}
          </Text>
        </VStack>
        <VStack spacing={3} w="full">
          <GoogleLoginButton />
        </VStack>
        <VStack spacing={6} w="full" maxW="450px" px={6}>
          <HStack w="full" align="center" my={2}>
            <Divider />
            <Text fontSize="sm" color="gray.500" px={2}>
              OR
            </Text>
            <Divider />
          </HStack>

          {step === "signup" && (
            <FormControl id="name">
              <FormLabel fontSize="sm" color="gray.700">
                Name
              </FormLabel>
              <Input
                {...inputStyle}
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
              />
            </FormControl>
          )}

          <FormControl id="email">
            <FormLabel fontSize="sm" color="gray.700">
              Email Address
            </FormLabel>
            <Input
              {...inputStyle}
              type="email"
              name="email"
              value={form.email}
              placeholder="name@email.com"
              onChange={handleChange}
              isDisabled={step !== "email"}
            />
          </FormControl>

          {(step === "login" || step === "signup") && (
            <FormControl id="password">
              <FormLabel fontSize="sm" color="gray.700">
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  {...inputStyle}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="********"
                />
                <InputRightElement h="full" pr={3}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword((prev) => !prev)}
                    p={0} // Optional: removes extra padding from button
                  >
                    {showPassword ? (
                      <EyeClosedIcon fontSize="16px" />
                    ) : (
                      <EyeIcon fontSize="16px" />
                    )}
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

          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token: string | null) => setCaptchaToken(token)}
          />
        </VStack>
      </Flex>
    </Box>
  );
};

export default Signin;
