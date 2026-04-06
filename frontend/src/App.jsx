import { useEffect, useState } from 'react';
import DefaultForm from './DefaultForm.jsx'

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then(res => res.json())
      .then(data => setMessage(data.message))
      .catch(err => console.error(err));
  }, []);


  return (
    <>
    <div>
      <h1>React + Express Connection</h1>
      <p>{message}</p>
    </div>
    <DefaultForm />
    </>
  );
}

export default App;