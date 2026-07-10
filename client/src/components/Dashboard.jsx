import AgentCard from "./AgentCard";

function Dashboard({ result }) {
  if (!result) {
    return <p>No disaster report submitted yet.</p>;
  }

  const isGeminiActive = result.source === "Gemini AI";

  const handleCall = (resource) => {
    const confirmCall = window.confirm(
      `Call ${resource.name} at ${resource.number}?`
    );

    if (confirmCall) {
      window.location.href = `tel:${resource.number}`;
    }
  };

  return (
    <div className="dashboard">
      <h2>AI Agent Response</h2>

      <p
        className={`response-source ${
          isGeminiActive ? "online" : "offline"
        }`}
      >
        {isGeminiActive
          ? "🟢 AI Status: Gemini AI Active"
          : "🟡 AI Status: Local Multi-Agent (Fallback Mode)"}
      </p>

      <AgentCard title="🚨 Incident Agent">
        <p>
          Type:{" "}
          <strong>
            {result.incident.disasterType}
          </strong>
        </p>

        <p>
          Severity:{" "}
          <strong>{result.incident.severity}</strong>
        </p>
      </AgentCard>

      <AgentCard title="🏥 Medical Agent">
        <p>{result.medical.priority}</p>
      </AgentCard>

      <AgentCard title="📦 Resource Agent">
        {result.resource.resources.map(
          (resource, index) => (
            <p key={index}>✅ {resource}</p>
          )
        )}
      </AgentCard>

      <AgentCard title="🗺️ Route Agent">
        <p>
          Location:{" "}
          <strong>{result.route.location}</strong>
        </p>

        <p>{result.route.suggestion}</p>
      </AgentCard>

      <AgentCard title="📢 Communication Agent">
        <pre>{result.communication.message}</pre>
      </AgentCard>

      <div className="calling-panel">
        <h3>📞 Emergency Resource Calling System</h3>

        <p className="calling-description">
          AI-selected emergency teams based on the
          current situation
        </p>

        <div className="calling-list">
          {result.callingResources?.map(
            (resource, index) => (
              <div
                className="calling-resource"
                key={index}
              >
                <div className="resource-info">
                  <span className="resource-icon">
                    {resource.icon}
                  </span>

                  <div>
                    <h4>{resource.name}</h4>

                    <p>
                      Required for: {resource.reason}
                    </p>

                    <small>
                      Contact: {resource.number}
                    </small>
                  </div>
                </div>

                <button
                  className="call-button"
                  onClick={() =>
                    handleCall(resource)
                  }
                >
                  📞 Call Now
                </button>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;