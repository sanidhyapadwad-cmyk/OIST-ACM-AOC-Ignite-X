function communicationAgent(data) {

    const message =
`🚨 Disaster Alert

Disaster : ${data.incident.disasterType}

Severity : ${data.incident.severity}

Medical : ${data.medical.priority}

Resources :
${data.resource.resources.join(", ")}

Route :
${data.route.suggestion}

Stay Calm and Follow Rescue Team Instructions.`;

    return {
        message
    };
}

module.exports = communicationAgent;