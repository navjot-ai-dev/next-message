import {
  Html,
  Head,
  Body,
  Container,
  Text,
  Heading,
  Section,
  Hr,
  Tailwind,
  Preview,
} from "@react-email/components";


interface VerificationEmailProps {
  username: string;
  otp: string;
}


export default function VerificationEmail({
  username,
  otp,
}: VerificationEmailProps) {

  return (
    <Html>
      <Head />

      <Preview>
        Your verification code is {otp}
      </Preview>


      <Tailwind>

        <Body className="bg-gray-100 font-sans">

          <Container className="mx-auto my-10 max-w-md rounded-lg bg-white p-8 shadow-md">


            <Heading className="text-center text-2xl font-bold text-gray-900">
              Verify Your Email
            </Heading>


            <Text className="mt-5 text-base text-gray-700">
              Hello {username},
            </Text>


            <Text className="text-base text-gray-700">
              Thank you for creating an account.
              Please use the OTP below to verify your email address.
            </Text>



            <Section className="my-8 text-center">

              <Text
                className="
                rounded-lg
                bg-black
                px-8
                py-4
                text-center
                text-3xl
                font-bold
                tracking-widest
                text-white
                "
              >
                {otp}
              </Text>

            </Section>



            <Text className="text-sm text-gray-600">
              This OTP will expire in 10 minutes.
            </Text>



            <Hr className="my-6 border-gray-200" />


            <Text className="text-center text-xs text-gray-500">
              If you did not request this email,
              you can safely ignore it.
            </Text>


          </Container>


        </Body>

      </Tailwind>

    </Html>
  );
}