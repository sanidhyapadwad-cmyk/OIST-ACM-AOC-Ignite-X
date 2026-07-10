function resourceAgent(disasterType, severity) {
  let resources = ["Rescue Team"];

  if (disasterType === "Flood") {
    resources.push("Rescue Boat", "Life Jackets", "Food Packets");
  }

  if (disasterType === "Fire") {
    resources.push("Fire Brigade", "Water Tanker", "Ambulance");
  }

  if (disasterType === "Earthquake") {
    resources.push("Ambulance", "Debris Removal Team", "Medical Kits");
  }

  if (disasterType === "Landslide") {
    resources.push("Excavator", "Rescue Team", "Medical Team");
  }

  if (severity === "High") {
    resources.push("Emergency Medical Team");
  }

  return {
    resources,
  };
}

module.exports = resourceAgent;