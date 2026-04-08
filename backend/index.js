const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// test routes
app.listen(5000, () => console.log("Server running on port 5000"));

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// end test routes

async function FindLatLong(url){
  try{
    console.log("FindingLatLong on URL: " + url);
    const res = await fetch(url, {
      headers:{
        "User-Agent": "Road Trip Cost/1.0 (mletnyre@gmail.com)",
        "Accept": "application/json"
      }
    });

    const data = await res.json();
    console.log(data);

    const {lat, lon} = data[0];

    return {lat,lon};

  } catch(err){
    console.error("Error converting address to coordinates " + err + "\nURL: "+ url);
    return null;
  }
}

app.post("/api/route", async (req, res) => { 
  console.log("Calculating Route...")
  const {start, end} = req.body;

  console.log("Starting Address: " + start);
  console.log("Ending Address: " + end);

  const startURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(start)}&format=json`;
  const endURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(end)}&format=json`;

  const startLatLong = await FindLatLong(startURL);
  const endLatLong = await FindLatLong(endURL);

  console.log("Starting (Lat,Lon) ("+startLatLong.lat +","+startLatLong.lon+")")
  console.log("Ending   (Lat,Lon) ("+endLatLong.lat +","+endLatLong.lon+")")

  
  const coords ={
    start: startLatLong,
    end: endLatLong
  };

  let routeInfo = await CallOSMR(coords);
  console.log("Route Info" , routeInfo)

  res.json({
    routeInfo
  })
});

async function CallOSMR(coordinates){
  console.log("using data:" ,coordinates);

  const startLat = coordinates.start.lat;
  const startLon = coordinates.start.lon;
  const endLat   = coordinates.end.lat;
  const endLon   = coordinates.end.lon;

  console.log("Starting (Lat,Lon) ("+startLat +","+startLon+")")
  console.log("Ending   (Lat,Lon) ("+endLat +","+endLon+")")

  const url = `http://router.project-osrm.org/route/v1/driving/${startLon},${startLat};${endLon},${endLat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  console.log(res);
  const data = await res.json();

  const route = data.routes[0];

  const miles = (route.distance * 0.000621371).toFixed(1);
  const min = (route.duration / 60).toFixed(1);

  console.log("Distance (m):", route.distance);
  console.log("Distance (Mi):", miles);
  console.log("Duration (s):", route.duration);
  console.log("Duration (min)", min)
  //console.log("Coordinates:", route.geometry.coordinates);

  return {miles, min};
}