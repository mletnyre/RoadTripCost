export default function DefaultForm() {

  function enterData(event) {
    event.preventDefault(); // prevent page reload
    const formData = new FormData(event.target);

    const start = formData.get("fstart");
    const end = formData.get("fend");
    const mpg = formData.get("fmpg");

    console.log("using: mpg: " + mpg + " end: " + end + " start: " + start);

    CalculateRoute(start, end);
  }

  function CalculateRoute(start, end) {
    fetch(`http://localhost:5000/api/route?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`,{
      headers:{
        'User-Agent': 'Road Trip Cost/1.0 (mletnyre@gmail.com)'
      }
    })
      .then((data) => setMessage(data.message))
      .catch((err) => console.error(err));
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
        <br />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
}