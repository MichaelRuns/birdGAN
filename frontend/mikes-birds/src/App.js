import logo from './logo.svg';
import React, { useState } from 'react';
import './App.css';
import { queryApiForBirds } from './api';

function App() {
  const [birds, setBirds] = useState([0])
  const handleGenerateClick = async () => {
    try {
      setBirds(await queryApiForBirds());
      console.log('GOT BIRDSSSSS')
      console.log(birds)
    } catch (error) {
      console.log(error)
      console.log('error')
    }
  };
  return (
    <div className="App">
      <header className="App-header">
      {birds ? (
          <img src={`data:image/png;base64,${birds}`} alt="Generated Bird" />
        ) : (
          <p>No bird image generated yet.</p>
        )}
        <p>
          I  love you this much
        </p>
        <button onClick={handleGenerateClick}>Generate</button>
      </header>
    </div>
  );
}

export default App;
