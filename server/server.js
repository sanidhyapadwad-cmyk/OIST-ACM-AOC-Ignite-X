require("dotenv").config();

const express = require("express");
const cors = require("cors");

const analyzeReport = require("./gemini");

const incidentAgent = require("./agents/incidentAgent");
const medicalAgent = require("./agents/medicalAgent");
const resourceAgent = require("./agents/resourceAgent");
const routeAgent = require("./agents/routeAgent");
const communicationAgent = require("./agents/communicationAgent");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ResQAI Disaster Response Server Running");
});

/*
  Demo contacts only.
  Final deployment me verified local authority numbers use karna.
*/
const emergencyContacts = [
  {
    keywords: ["ambulance", "medical", "hospital", "medical team"],
    name: "Ambulance Service",
    number: "1000000001",
    icon: "🚑",
  },
  {
    keywords: ["fire", "fire brigade", "water tanker"],
    name: "Fire & Emergency Team",
    number: "1000000002",
    icon: "🚒",
  },
  {
    keywords: [
      "rescue",
      "rescue team",
      "rescue boat",
      "boat",
      "life jackets",
    ],
    name: "Disaster Rescue Team",
    number: "1000000003",
    icon: "🛟",
  },
  {
    keywords: [
      "police",
      "security",
      "traffic",
      "road block",
      "evacuation",
    ],
    name: "Police Control Room",
    number: "1000000004",
    icon: "🚓",
  },
  {
    keywords: [
      "food",
      "water",
      "food packets",
      "shelter",
      "relief",
      "supplies",
    ],
    name: "Relief Supply Team",
    number: "1000000005",
    icon: "📦",
  },
];

function createCallingResources(resources = []) {
  const selectedContacts = [];

  resources.forEach((resource) => {
    const resourceText = resource.toLowerCase();

    const matchedContact = emergencyContacts.find((contact) =>
      contact.keywords.some((keyword) =>
        resourceText.includes(keyword)
      )
    );

    if (matchedContact) {
      const alreadyAdded = selectedContacts.some(
        (item) => item.name === matchedContact.name
      );

      if (!alreadyAdded) {
        selectedContacts.push({
          ...matchedContact,
          reason: resource,
        });
      }
    }
  });

  if (selectedContacts.length === 0) {
    selectedContacts.push({
      name: "Central Emergency Control Room",
      number: "1000000000",
      icon: "☎️",
      reason: "General emergency assistance",
    });
  }

  return selectedContacts;
}

function runLocalAgents(report, location) {
  const incident = incidentAgent(report);
  const medical = medicalAgent(report);

  const resource = resourceAgent(
    incident.disasterType,
    incident.severity
  );

  const route = routeAgent(
    location,
    incident.disasterType
  );

  const communication = communicationAgent({
    incident,
    medical,
    resource,
    route,
  });

  const callingResources = createCallingResources(
    resource.resources
  );

  return {
    success: true,
    source: "Local Multi-Agent Fallback",
    incident,
    medical,
    resource,
    route,
    communication,
    callingResources,
  };
}

app.post("/api/report", async (req, res) => {
  const { report, location } = req.body;

  if (!report || !location) {
    return res.status(400).json({
      success: false,
      message: "Report and location are required",
    });
  }

  try {
    console.log("Gemini is analysing the disaster report...");

    const aiResult = await analyzeReport(report, location);

    const resources = aiResult.resources || [];

    const finalResponse = {
      success: true,
      source: "Gemini AI",

      incident: {
        disasterType: aiResult.disasterType,
        severity: aiResult.severity,
      },

      medical: {
        priority: aiResult.medicalPriority,
      },

      resource: {
        resources,
      },

      route: {
        location,
        suggestion: aiResult.routeSuggestion,
      },

      communication: {
        message: aiResult.alertMessage,
      },

      callingResources: createCallingResources(resources),
    };

    console.log("Gemini analysis completed");

    return res.json(finalResponse);
  } catch (error) {
    console.log("Gemini unavailable:", error.message);
    console.log("Switching to local agents...");

    const fallbackResponse = runLocalAgents(
      report,
      location
    );

    return res.json(fallbackResponse);
  }
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});