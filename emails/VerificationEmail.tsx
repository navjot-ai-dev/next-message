import {
  Body,
  Container,
  Column,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Row,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface OTPEmailProps {
  username?: string;
  otp?: string;
  expiresInMinutes?: number;
}

export const OTPEmail = ({
  username = "there",
  otp = "482913",
  expiresInMinutes = 10,
}: OTPEmailProps) => {
  const digits = otp.split("");

  return (
    <Html>
      <Head>
        <style>{`
          body {
            margin: 0;
            padding: 40px 0;
            background-color: #f2f3f7;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          }

          .container {
            max-width: 460px;
            margin: 0 auto;
          }

          .logo-wrap {
            text-align: center;
            margin-bottom: 24px;
          }

          .logo-badge {
            display: inline-block;
            width: 44px;
            height: 44px;
            line-height: 44px;
            border-radius: 12px;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%);
            color: #ffffff;
            font-size: 20px;
            font-weight: 700;
            text-align: center;
          }

          .card {
            background-color: #ffffff;
            border-radius: 20px;
            border: 1px solid #e8e9ee;
            padding: 40px 36px;
            box-shadow: 0 1px 2px rgba(16,24,40,0.04), 0 12px 32px -8px rgba(16,24,40,0.08);
          }

          .heading {
            font-size: 22px;
            font-weight: 700;
            color: #101323;
            text-align: center;
            margin: 0 0 8px;
            letter-spacing: -0.3px;
          }

          .subtext {
            font-size: 15px;
            color: #666b7a;
            text-align: center;
            margin: 0 0 32px;
            line-height: 22px;
          }

          .subtext strong {
            color: #101323;
          }

          .otp-row {
            text-align: center;
          }

          .otp-digit {
            display: inline-block;
            width: 44px;
            height: 56px;
            line-height: 56px;
            margin: 0 4px;
            border-radius: 12px;
            background: linear-gradient(180deg, #f8f9fc 0%, #f0f1f7 100%);
            border: 1px solid #e3e5ec;
            font-size: 26px;
            font-weight: 700;
            color: #101323;
            text-align: center;
            font-variant-numeric: tabular-nums;
          }

          .expiry {
            font-size: 13px;
            color: #9a9fae;
            text-align: center;
            margin: 20px 0 0;
          }

          .divider {
            border-color: #eef0f4;
            margin: 32px 0 24px;
          }

          .fineprint {
            font-size: 13px;
            color: #9a9fae;
            text-align: center;
            margin: 0;
            line-height: 20px;
          }

          .footer {
            text-align: center;
            margin-top: 28px;
          }

          .footer-text {
            font-size: 12px;
            color: #a7abb8;
            margin: 0;
          }

          @media (prefers-color-scheme: dark) {
            body { background-color: #0b0d12 !important; }
            .card { background-color: #14171f !important; border-color: #262a35 !important; }
            .heading, .subtext strong, .otp-digit { color: #f4f5f7 !important; }
            .otp-digit { background: #1c1f29 !important; border-color: #2a2e3a !important; }
            .subtext, .expiry, .fineprint, .footer-text { color: #9a9fae !important; }
            .divider { border-color: #242833 !important; }
          }

          @media only screen and (max-width: 480px) {
            .container { width: 100% !important; padding: 0 16px; }
            .card { padding: 32px 20px; }
            .otp-digit { width: 38px; height: 48px; line-height: 48px; font-size: 22px; margin: 0 3px; }
          }
        `}</style>
      </Head>
      <Preview>Your next-message verification code is {otp}</Preview>
      <Body>
        <Container className="container">
          <Section className="logo-wrap">
            <div className="logo-badge">N</div>
          </Section>

          <Section className="card">
            <Heading className="heading">Verify it's you</Heading>

            <Text className="subtext">
              Hi {username}, use the code below to sign in to{" "}
              <strong>next-message</strong>.
            </Text>

            <Row>
              <Column className="otp-row">
                {digits.map((d, i) => (
                  <span className="otp-digit" key={i}>
                    {d}
                  </span>
                ))}
              </Column>
            </Row>

            <Text className="expiry">
              This code expires in {expiresInMinutes} minutes. Please check fast.
            </Text>

            <Hr className="divider" />

            <Text className="fineprint">
              Didn't request this? You can safely ignore this email — your
              account is still secure.
            </Text>
          </Section>

          <Section className="footer">
            <Text className="footer-text">
              © {new Date().getFullYear()} next-message · Sent because you
              requested a sign-in code
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

OTPEmail.PreviewProps = {
  username: "Sarah",
  otp: "482913",
  expiresInMinutes: 10,
} as OTPEmailProps;

export default OTPEmail;