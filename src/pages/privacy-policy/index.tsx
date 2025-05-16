import { Box, Heading, ListItem, Text, UnorderedList } from "@chakra-ui/react";

const PrivacyPolicy = () => {
  return (
    <Box maxW="4xl" mx="auto" p={6}>
      <Heading size="lg" mb={4}>
        Privacy Policy for OverOS AI
      </Heading>
      <Text mb={2}>
        <strong>Effective Date:</strong> May 16th, 2025
      </Text>
      <Text mb={4}>
        <strong>Last Updated:</strong> May 17th, 2025
      </Text>

      <Text mb={4}>
        Welcome to OverOS AI (“we,” “us,” or “our”). Your privacy is important
        to us. This Privacy Policy explains how we collect, use, disclose, and
        safeguard your information when you visit our website at www.overos.xyz
        (the “Site”) and use our AI tools and related services (collectively,
        the “Services”).
      </Text>

      <Heading size="md" mt={6} mb={2}>
        1. Information We Collect
      </Heading>
      <Text fontWeight="semibold" mb={1}>
        a. Personal Information
      </Text>
      <Text mb={2}>Information you voluntarily provide to us when you:</Text>
      <UnorderedList mb={2}>
        <ListItem>Create an account</ListItem>
        <ListItem>Subscribe to updates or contact us</ListItem>
        <ListItem>Use our Services or participate in demos</ListItem>
      </UnorderedList>
      <Text mb={2}>This may include:</Text>
      <UnorderedList mb={4}>
        <ListItem>Name</ListItem>
        <ListItem>Email address</ListItem>
        <ListItem>Company name</ListItem>
        <ListItem>Billing information (if applicable)</ListItem>
      </UnorderedList>

      <Text fontWeight="semibold" mb={1}>
        b. Usage Data
      </Text>
      <Text mb={2}>
        We automatically collect information about your interactions with the
        Site and Services, such as:
      </Text>
      <UnorderedList mb={4}>
        <ListItem>IP address</ListItem>
        <ListItem>Browser type and version</ListItem>
        <ListItem>Device type</ListItem>
        <ListItem>Pages viewed</ListItem>
        <ListItem>Time spent on pages</ListItem>
        <ListItem>Referring website addresses</ListItem>
      </UnorderedList>

      <Text fontWeight="semibold" mb={1}>
        c. Uploaded or Generated Content
      </Text>
      <Text mb={4}>
        When you use OverOS AI’s tools, we may collect and store content you
        submit or generate (e.g., prompts, workflows, documents, code snippets).
      </Text>

      <Heading size="md" mt={6} mb={2}>
        2. How We Use Your Information
      </Heading>
      <UnorderedList mb={4}>
        <ListItem>Provide, maintain, and improve our Services</ListItem>
        <ListItem>Personalize your experience</ListItem>
        <ListItem>Communicate with you (e.g., support, newsletters)</ListItem>
        <ListItem>Analyze usage and improve functionality</ListItem>
        <ListItem>
          Detect, prevent, and address technical or security issues
        </ListItem>
        <ListItem>Comply with legal obligations</ListItem>
      </UnorderedList>

      <Heading size="md" mt={6} mb={2}>
        3. Sharing of Information
      </Heading>
      <Text mb={2}>
        We do not sell your personal information. We may share your data with:
      </Text>
      <UnorderedList mb={2}>
        <ListItem>
          Service providers who help operate our platform (e.g., hosting,
          analytics, payment processors)
        </ListItem>
        <ListItem>Legal or regulatory bodies if required by law</ListItem>
        <ListItem>
          Affiliates or acquirers in the event of a merger, sale, or asset
          transfer
        </ListItem>
      </UnorderedList>
      <Text mb={4}>
        All third parties are contractually obligated to keep your information
        secure and confidential.
      </Text>

      <Heading size="md" mt={6} mb={2}>
        4. Your Rights and Choices
      </Heading>
      <Text mb={2}>
        Depending on your jurisdiction, you may have the right to:
      </Text>
      <UnorderedList mb={2}>
        <ListItem>Access the personal data we hold about you</ListItem>
        <ListItem>Correct inaccurate data</ListItem>
        <ListItem>Request deletion of your data</ListItem>
        <ListItem>Object to or restrict processing</ListItem>
        <ListItem>Request a copy of your data in a portable format</ListItem>
      </UnorderedList>
      <Text mb={4}>
        To exercise these rights, please email us at{" "}
        <strong>info@overos.xyz</strong>
      </Text>

      <Heading size="md" mt={6} mb={2}>
        5. Data Retention
      </Heading>
      <Text mb={4}>
        We retain your information as long as needed to provide the Services and
        fulfill legal obligations. You can request deletion of your data at any
        time.
      </Text>

      <Heading size="md" mt={6} mb={2}>
        6. Cookies and Tracking Technologies
      </Heading>
      <Text mb={2}>We use cookies and similar technologies to:</Text>
      <UnorderedList mb={2}>
        <ListItem>Remember your preferences</ListItem>
        <ListItem>Analyze traffic and usage patterns</ListItem>
        <ListItem>Improve user experience</ListItem>
      </UnorderedList>
      <Text mb={4}>
        You can control cookies through your browser settings. For more details,
        see our [Cookie Policy].
      </Text>

      <Heading size="md" mt={6} mb={2}>
        7. Security
      </Heading>
      <Text mb={4}>
        We implement reasonable administrative, technical, and physical
        safeguards to protect your data. However, no method of transmission over
        the internet is 100% secure.
      </Text>

      <Heading size="md" mt={6} mb={2}>
        8. Children’s Privacy
      </Heading>
      <Text mb={4}>
        OverOS AI is not intended for use by individuals under the age of 13. We
        do not knowingly collect data from children.
      </Text>

      <Heading size="md" mt={6} mb={2}>
        9. Changes to This Policy
      </Heading>
      <Text mb={4}>
        We may update this Privacy Policy from time to time. Any changes will be
        posted on this page with a revised “Last Updated” date.
      </Text>

      <Heading size="md" mt={6} mb={2}>
        10. Contact Us
      </Heading>
      <Text mb={1}>
        <strong>Email:</strong> info@overos.xyz
      </Text>
      <Text>
        <strong>Website:</strong> www.overos.xyz
      </Text>
    </Box>
  );
};

export default PrivacyPolicy;
