import { useState } from "react";

export default function DefaultForm() {
  
  const [oneway, setOneWay] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);

  function enterData(event) {
    event.preventDefault(); // prevent page reload
    const formData = new FormData(event.target);

    const start = formData.get("fstart");
    const end = formData.get("fend");
    const mpg = formData.get("fmpg");

    console.log("using: mpg: " + mpg + " end: " + end + " start: " + start);

    CalculateRoute(start, end);
  }

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
    const data = await res.json();

    const route = data.routes[0];

    const miles = (route.distance * 0.000621371).toFixed(1);
    const min = (route.duration / 60).toFixed(1);

    console.log("Distance (m):", route.distance);
    console.log("Distance (Mi):", miles);
    console.log("Duration (s):", route.duration);
    console.log("Duration (min)", min)
    console.log("Coordinates:", route.geometry.coordinates);

    setRouteInfo({miles, min})
  }

  function CalculateRoute(start, end) {
    if(!start || !end){
      console.log("YOU MUST FILL BOTH START AND END FIELDS");
      alert("You must enter both start and end")
      return;
    }
    const data = { start, end }
    fetch(`http://localhost:5000/api/route`,{
      method: "POST",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        console.log("backend response:", json)
        return json;
      })
      .then(res => CallOSMR(res))
      .catch((err) => console.error(err));
 
  }

  function RenderTripType(){
    if(oneway){
      return <div>One Way Trip</div>
    }
    else{
      return <div>Return Trip Included</div>
    }
  }

  return (
    <div>
      <form onSubmit={enterData} className="defaultform">
        <label htmlFor="fstart">start: </label>
        <input id="fstart" name="fstart" type="text" />
        <br />

        <label htmlFor="fend">end: </label>
        <input id="fend" name="fend" type="text" />
        <br />

        <label htmlFor="fmpg">mpg: </label>
        <input id="fmpg" name="fmpg" type="text" />
        <br/>
        <button 
          type="button"
          className="toggle"
          id="togglebtn" 
          onClick={() => {
            setOneWay(!oneway); 
            console.log("This is a one way trip:" + oneway)}}
            >
          Click To Toggle Return Trip
        <div className="TripType">{RenderTripType()}</div>
        </button>
        <button className="submit"id="submit" type="submit">Submit</button>
      </form>
      {routeInfo && oneway &&(
        <div>
          <p>Distance: {routeInfo.miles} miles</p>
          <p>Duration: {routeInfo.min} minutes</p>
        </div>
      )}
      {routeInfo && !oneway &&( 
        <div>
          <p>Distance: {routeInfo.miles * 2} miles</p>
          <p>Duration: {routeInfo.min * 2} minutes</p>
        </div>
      )}
      <footer className="footer">This uses OpenStreetMap for all the map stuff</footer>
    </div>
  );
}