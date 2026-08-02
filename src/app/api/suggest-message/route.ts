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
        You are a message suggestion AI.

        Always return ONLY valid JSON.
        Never change the keys.

        The response must always have exactly these keys:

        {
          "suggestion1": "",
          "suggestion2": "",
          "suggestion3": ""
        }

        Fill all three values with short, natural chat replies.
      `,
    },
    {
      role: "user",
      content: `Suggest replies for: "${message}"`,
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