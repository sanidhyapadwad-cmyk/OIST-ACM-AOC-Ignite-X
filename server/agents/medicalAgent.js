function medicalAgent(report) {
  const text = report.toLowerCase();

  let priority = "Medical Team on Standby";

  if (
    text.includes("injured") ||
    text.includes("bleeding") ||
    text.includes("unconscious")
  ) {
    priority = "Immediate Medical Help Required";
  }

  return {
    priority,
  };
}

module.exports = medicalAgent;