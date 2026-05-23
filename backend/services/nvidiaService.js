const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: "https://integrate.api.nvidia.com/v1",
});

const analyzeResume = async (resumeText) => {
  resumeText = resumeText.slice(0, 3000);
  const completion = await client.chat.completions.create({

    model: "meta/llama-3.1-8b-instruct",

    messages: [
      {
        role: "system",
        content: `
        You are an expert ATS Resume Analyzer.

        Analyze resumes professionally.

        You MUST return ONLY valid JSON.

        Response format:

      {
        "score": number,
        "strengths": [],
        "weaknesses": [],
        "missingSkills": [],
        "suggestions": []
      }
        `,
      },

      {
        role: "user",
        content: resumeText,
      },
    ],

    temperature: 0.5,
    max_tokens: 500,
  });

  const rawText =
    completion.choices[0].message.content;

  // Clean markdown formatting if model adds it
  const cleanedText = rawText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleanedText);
};

module.exports = analyzeResume;