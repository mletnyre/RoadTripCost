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

  res.json({
    start: startLatLong,
    end: endLatLong
  });
});

