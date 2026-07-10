function routeAgent(location, disasterType) {
  let suggestion = "Use the nearest safe road.";

  if (disasterType === "Flood") {
    suggestion = "Avoid low-lying and waterlogged roads.";
  } else if (disasterType === "Fire") {
    suggestion = "Avoid roads near the fire-affected area.";
  } else if (disasterType === "Earthquake") {
    suggestion = "Avoid damaged buildings and blocked roads.";
  } else if (disasterType === "Landslide") {
    suggestion = "Avoid hilly roads and unstable areas.";
  }

  return {
    location,
    suggestion,
  };
}

module.exports = routeAgent;