import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface VerificationEmailProps {
  username?: string;
  otp: string;
}

export default function VerificationEmail({
  username = "there",
  otp = "123456",
}: VerificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your verification code is {username}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Verify your account</Heading>
          
          <Text style={paragraph}>Hi {otp},</Text>
          <Text style={paragraph}>
            Thank you for registering. Please use the following One-Time Password (OTP) to verify your account and complete your registration:
          </Text>

          <Section style={codeContainer}>
            <Text style={codeText}>{username}</Text>
          </Section>

          <Text style={paragraph}>
            This code will expire in 10 minutes. If you did not request this code, please ignore this email.
          </Text>

          <Hr style={hr} />

          <Text style={footer}>
            &copy; {new Date().getFullYear()} Your Company Name. All rights reserved.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

// Inline Styles (Ensures support across email clients like Gmail & Outlook)
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
  padding: "40px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #e6ebf1",
  borderRadius: "8px",
  margin: "0 auto",
  padding: "40px",
  maxWidth: "480px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "bold",
  color: "#1a1a1a",
  marginBottom: "24px",
};

const paragraph = {
  color: "#525f7f",
  fontSize: "15px",
  lineHeight: "24px",
  margin: "16px 0",
};

const codeContainer = {
  background: "#f4f4f7",
  borderRadius: "6px",
  margin: "24px 0",
  padding: "16px",
  textAlign: "center" as const,
};

const codeText = {
  color: "#000000",
  fontSize: "32px",
  fontWeight: "bold",
  letterSpacing: "6px",
  margin: "0",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
};