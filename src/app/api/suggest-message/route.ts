import ollama from "ollama";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const result = await ollama.chat({
      model: "llama3.2:3b",
      messages: [
        {
      role: "system",
      content: `
       You are a message writing assistant.

        Generate 3 different message suggestions based on the user's idea.

        Always return ONLY valid JSON.
        Never change the keys.

        The response must always have exactly these keys:

        {
          "suggestion1": "",
          "suggestion2": "",
          "suggestion3": ""
        }

         Rules:
        - Convert short input into a meaningful short message.
        - Make each suggestion different.
        - Keep messages natural and emotional.
        - Do not explain anything.
      `,
    },
    {
      role: "user",
      content: `Suggest messages for: "${message}"`,
    },
      ],
    });

   const aiResponse = JSON.parse(result.message.content);

const suggestions = {
  suggestion1: aiResponse.suggestion1 || "",
  suggestion2: aiResponse.suggestion2 || "",
  suggestion3: aiResponse.suggestion3 || "",
};

return Response.json(suggestions);

  } catch (error) {
    return Response.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}