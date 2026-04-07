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
    const res = await fetch(url);
    const data = await res.json();

    console.log(data);

    const lat=data[0].lat;
    const lon=data[0].lon;

    console.log("lat: ", lat, "long:", lon);

    return {lat,lon};
  } catch(err){
    console.error("Error converting address to coordinates " + err + "\nURL: "+ url);
    return null;
  }
}

app.get("/api/route", async (req, res) => { 
  console.log("Calculating Route...")
  const {start, end} = req.query;

  console.log("Starting Address: " + start);
  console.log("Ending Address: " + end);


  //sanatize the url.........
  const cleanStart = start.replace(/"/g, '').trim();
  const cleanEnd = end.replace(/"/g, '').trim();

  const startURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanStart)}&format=json`;
  const endURL = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cleanEnd)}&format=json`;

  const startLatLong = await FindLatLong(startURL);
  const endLatLong = await FindLatLong(endURL);

  res.send();
});

