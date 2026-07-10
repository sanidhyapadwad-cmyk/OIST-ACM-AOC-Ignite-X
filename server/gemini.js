const { GoogleGenAI, Type } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Gemini ko maximum 5 seconds denge
const TIMEOUT = 5000;

function timeoutPromise() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("GEMINI_TIMEOUT"));
    }, TIMEOUT);
  });
}

async function generateGeminiResponse(report, location) {
  const prompt = `
You are the coordinator agent of a disaster response system.

Analyze this disaster report and provide a short, practical response.

Location:
${location}

Citizen Report:
${report}

Instructions:
1. Identify the disaster type.
2. Select severity: Low, Medium, High or Critical.
3. Give a short medical priority.
4. Suggest necessary rescue resources.
5. Give a safe route recommendation.
6. Generate a short citizen emergency alert.
7. Keep every response concise.
8. Do not invent victim counts.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",

    contents: prompt,

    config: {
      responseMimeType: "application/json",

      responseSchema: {
        type: Type.OBJECT,

        properties: {
          disasterType: {
            type: Type.STRING,
          },

          severity: {
            type: Type.STRING,
            enum: ["Low", "Medium", "High", "Critical"],
          },

          medicalPriority: {
            type: Type.STRING,
          },

          resources: {
            type: Type.ARRAY,
            items: {
              type: Type.STRING,
            },
          },

          routeSuggestion: {
            type: Type.STRING,
          },

          alertMessage: {
            type: Type.STRING,
          },
        },

        required: [
          "disasterType",
          "severity",
          "medicalPriority",
          "resources",
          "routeSuggestion",
          "alertMessage",
        ],
      },
    },
  });

  if (!response.text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(response.text);
}

async function analyzeReport(report, location) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is missing");
  }

  if (!report || !location) {
    throw new Error("Report and location are required");
  }

  console.log("Fast Gemini analysis started...");

  const result = await Promise.race([
    generateGeminiResponse(report, location),
    timeoutPromise(),
  ]);

  console.log("Gemini response received successfully");

  return result;
}

module.exports = analyzeReport;