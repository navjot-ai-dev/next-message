import ollama from "ollama";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const result = await ollama.chat({
      model: "llama3.2:3b",
      format: "json",

      messages: [
        {
          role: "system",
          content: `
You are NOT a chatbot.
You are NOT answering the user.
You are a MESSAGE WRITER.

Your ONLY job is to rewrite or expand the user's text into 3
different messages that the USER can send to another person.

VERY IMPORTANT:

1. NEVER reply to the user's message.
2. NEVER have a conversation with the user.
3. NEVER say "How can I help you?"
4. NEVER answer questions contained in the input.
5. NEVER act as the recipient.
6. NEVER explain your answer.
7. NEVER say "Sure", "Of course","you mean" or similar.
8. Create messages FOR THE USER TO SEND.
9. Keep the original meaning of the input.
10. Make the 3 messages different from each other.
11. Keep messages natural, friendly and human.
12. The output must ONLY be JSON.

Examples:

INPUT:
Hello friend

CORRECT:
{
  "suggestion1": "Hello my dear friend, how have you been?",
  "suggestion2": "Hey buddy! It's great to hear from you.",
  "suggestion3": "Hello my friend, hope you're having a wonderful day!"
}

INPUT:
I miss you

CORRECT:
{
  "suggestion1": "I've really been missing you lately.",
  "suggestion2": "I miss you so much. I hope we can meet soon.",
  "suggestion3": "Just wanted to tell you that I miss having you around."
}

INPUT:
Good morning

CORRECT:
{
  "suggestion1": "Good morning! Wishing you a beautiful day ahead.",
  "suggestion2": "Good morning, my dear friend! Hope you slept well.",
  "suggestion3": "Morning! Hope your day starts with a big smile."
}

INPUT:
How are you?

CORRECT:
{
  "suggestion1": "Hey, just wanted to check in and see how you're doing.",
  "suggestion2": "Hi! I was thinking about you. How have things been?",
  "suggestion3": "Hey friend, hope everything is going well with you."
}

Remember:
The input is an IDEA for a message.
DO NOT respond to it.
WRITE the message that the user could send.

Return exactly:

{
  "suggestion1": "",
  "suggestion2": "",
  "suggestion3": ""
}
          `,
        },
        {
          role: "user",
          content: `Write 3 messages based on this idea. Do NOT reply to it.

IDEA:
${message}`,
        },
      ],
    });

    const aiResponse = JSON.parse(result.message.content);

    return Response.json({
      suggestion1: aiResponse.suggestion1 || "",
      suggestion2: aiResponse.suggestion2 || "",
      suggestion3: aiResponse.suggestion3 || "",
    });

  } catch (error) {
    console.error("Suggestion error:", error);

    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}