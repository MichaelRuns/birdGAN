import React, { useState } from 'react';
import './App.css';
import { queryApiForBirds } from './api';
import SocialMediaLinks from './Links';
import { AboutMenu, TitleCard} from './components';

function App() {
  const [birds, setBirds] = useState(null)
  const handleGenerateClick = async () => {
    try {
      setBirds(await queryApiForBirds());
      console.log(birds)
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="App">
      <header className="App-header">
        <AboutMenu/>
        <TitleCard/>
      </header>
      <div className='App-body'>
      <div>
      {birds ? (
          <img src={`data:image/png;base64,${birds}`} alt="Generated Bird" sizes='400'/>
        ) : (
          <p>No bird image generated yet.</p>
        )}
        </div>
        <div><button className='App-button' onClick={handleGenerateClick}>Generate</button></div>
        </div>
      <div className='App-footer'><p>Like what you see? Check out my socials</p> <SocialMediaLinks/> </div>  
    </div>
  );
}

export default App;
