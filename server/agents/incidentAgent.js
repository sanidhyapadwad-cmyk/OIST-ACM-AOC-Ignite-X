function incidentAgent(report) {
  const text = report.toLowerCase();

  let disasterType = "Unknown Disaster";

  if (text.includes("flood")) {
    disasterType = "Flood";
  } else if (text.includes("fire")) {
    disasterType = "Fire";
  } else if (text.includes("earthquake")) {
    disasterType = "Earthquake";
  } else if (text.includes("landslide")) {
    disasterType = "Landslide";
  }

  let severity = "Low";

  if (
    text.includes("trapped") ||
    text.includes("injured") ||
    text.includes("death")
  ) {
    severity = "High";
  } else if (text.includes("damage")) {
    severity = "Medium";
  }

  return {
    disasterType,
    severity,
  };
}

module.exports = incidentAgent;