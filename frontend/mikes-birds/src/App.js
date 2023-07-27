import React, { useState } from 'react';
import './App.css';
import {queryApiForBirds } from './api';
import SocialMediaLinks from './Links';
import {AboutMenu, TitleCard, AboutCard} from './components';
import _ from 'lodash';

function App() {
  const [birds, setBirds] = useState(null)
  const [aboutGansOpen, setAboutGansOpen] = useState(false)
  const [aboutAuthorOpen, setAboutAuthorOpen] = useState(false)
  const [aboutCodeOpen, setAboutCodeOpen] = useState(false)
  const [whyChidoriOpen, setWhyChidoriOpen] = useState(false)

  const handleGenerateClick = async () => {
    try {
      setBirds(await queryApiForBirds());
      console.log(birds)
    } catch (error) {
      console.log(error);
    }
  };

  const debouncedHandleGenerateClick = _.debounce(async()=>{
    handleGenerateClick();
  }, 500);

  const handleCloseDialog = () => {
    setAboutGansOpen(false);
    setAboutAuthorOpen(false);
    setAboutCodeOpen(false);
    setWhyChidoriOpen(false);
  };
  const HandleAboutMenuClicks = (code) => {
    switch(code){
      case 0:
        setAboutGansOpen(true);
        break;
      case 1:
        setAboutAuthorOpen(true);
        break;
      case 2:
        setAboutCodeOpen(true);
        break;
      case 3:
        setWhyChidoriOpen(true);
        break;
      default:
        console.log('error--invalid menu select')
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <AboutMenu
        _handleAboutMenuClicks={HandleAboutMenuClicks}/>
        <TitleCard/>
      </header>
      <div className='App-body'>
      <AboutCard
        open={aboutGansOpen}
        onClose={handleCloseDialog}
        title="What is a GAN?"
        content="gans are cool and stuff. its a type of machine learning model that can generate images, among other things. They have a discriminator and a generator. they learn together and make things. its dope."
      />
      <AboutCard
        open={aboutAuthorOpen}
        onClose={handleCloseDialog}
        title="its ya boi mike "
        content="you should hire me :) I'm cool and my girlfriend says I'm handsome and smart and not insane :)"
      />
        <AboutCard
        open={aboutCodeOpen}
        onClose={handleCloseDialog}
        title="this is a pretty cool app"
        content="I should talk about it. This is almost documentation. that probably means I can code ? maybe???"
      />
      <AboutCard
        open={whyChidoriOpen}
        onClose={handleCloseDialog}
        title="Why did I name this chidori?"
        content="so it's like a reference to a japanese myth which is also a cringe anime reference. it means 1000 birds, heres like a hyperlink:"
      />
      <div>
      {birds ? (
          <img src={`data:image/png;base64,${birds}`} alt="Generated Bird" sizes='400' />
        ) : (
          <p>No bird image generated yet.</p>
        )}
        </div>
        <div><button className='App-button' onClick={debouncedHandleGenerateClick}>Generate</button></div>
        <p style={{scale:'0.5'}}> powered by generative ai</p>
        </div>
      <div className='App-footer'><p>Like what you see? Check out my socials</p> <SocialMediaLinks/> </div>  
    </div>
  );
}

export default App;
