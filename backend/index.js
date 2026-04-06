const express = require('express');
const cors = require('cors'); // import cors
const app = express();
const PORT = 5000;

app.use(cors()); // allow all origins (you can restrict later)
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.get("/api/:start/:end", async (req, res) => {
  const { start, end } = req.params;

  try {
    // 1. Geocode start
    const startGeoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(start)}&format=json`
    );
    const startData = await startGeoRes.json();
    if (!startData || startData.length === 0) {
      return res.status(400).json({ message: "Start address not found" });
    }
    const startCoords = `${startData[0].lat},${startData[0].lon}`;

    // 2. Geocode end
    const endGeoRes = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(end)}&format=json`
    );
    const endData = await endGeoRes.json();
    if (!endData || endData.length === 0) {
      return res.status(400).json({ message: "End address not found" });
    }
    const endCoords = `${endData[0].lat},${endData[0].lon}`;

    // 3. Call OSRM with coordinates
    const osrmUrl = `http://router.project-osrm.org/route/v1/driving/${startCoords};${endCoords}?overview=false`;
    const osrmRes = await fetch(osrmUrl);
    const osrmData = await osrmRes.json();

    const routeInfo = {
      distance: osrmData.routes[0].distance,
      duration: osrmData.routes[0].duration,
      message: `Distance: ${osrmData.routes[0].distance} meters, ETA: ${Math.round(
        osrmData.routes[0].duration / 60
      )} minutes`,
    };

    res.json(routeInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating route" });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});