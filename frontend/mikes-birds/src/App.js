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
        content={<div>
          <p>Generative Adversarial Networks, or GANs for short, are a form of generative neural networks. They consist of two components:
            a discriminator, and a generator. Given a set of examples, 
            they are trained adversarially, where the generator creates fake images (starting from random noise), and the discriminator tries to differentiate them</p>
          <img src={process.env.PUBLIC_URL + '/GAN.jpeg'} alt='model.jpeg' width={600} height={400}/>
          <p>Think of this as a game of counterfeighter and police officer. Over time, as both get more adept, the counterfeight images get increasingly indistinguishable from the original images. These images are what you see here.</p>
        </div>}
      />
      <AboutCard
        open={aboutAuthorOpen}
        onClose={handleCloseDialog}
        title="About Me"
        content={<div>
          <img src={process.env.PUBLIC_URL+'/Vernau_Michael.jpg'} alt='mike.jpg' height={400}></img>
          <p>Hi, I'm Michael Vernau! I am a professional software engineer passionate about AI and full stack development. I graduated with my BS in CS from Stanford in 2022. Originally a biology student,
            I switched to computer science after falling in love with machine learning during my junior year. I still love biology and find my favorite projects involve the analysis of biodata.
             I'd describe myself as a full stack ML engineer, and one day I hope to work on bio integrated systems.</p> 
             <p> I am a retired NCAA distance runner,
             and working out is still super import to me. If you see me, chances are I'm on the keys or out getting my mileage in! </p>
        </div>}
      />
        <AboutCard
        open={aboutCodeOpen}
        onClose={handleCloseDialog}
        title="How does this website work?"
        content={
          <div>
            <p> This website is a react.js front end connected to a FastAPI python backend. The front end requests an image from the backend whenenver the user presses generate.
              The backend then uses a pretrained GAN model to generate a bird image, and returns it to the front end. The front end then displays the image to the user.
              I trained the GAN model on a dataset of over 10,000 images of birds, written and trained in pytorch.
              The code for this entire repository can be found publicly on my github <a href='https://github.com/MichaelRuns/birdGAN' target="_blank" rel="noopener noreferrer"> here</a>
            </p>
          </div>
        }
      />
      <AboutCard
        open={whyChidoriOpen}
        onClose={handleCloseDialog}
        title="Why is this called Chidori?"
        content={<div>
          <p>
            The name Chidori comes from a story about famous samurai Tachibana Dōsetsu: Tachibana was in possession of a famous sword called Chidori (千鳥, literally meaning: A Thousand Birds). One day, while he was still a young man, he was taking shelter under a tree, as it was raining. 
            
            Suddenly, a bolt of lightning struck him. However, Tachibana used his Chidori to cut the Thunder God inside the lightning bolt, allowing him to survive. After this incident, he renamed his Chidori to Raikiri (雷切, literally meaning: Lightning Cutter).
          </p>
          <ul></ul>
          <p> In the context of this app, I wanted to reference the large number of generated birds and pay homage to my childhood.</p>
          <img src={process.env.PUBLIC_URL + '/chidori.jpeg'} alt='sasuke.jpeg' style={{display:'flex', flexDirection:'row', justifyContent:'center'}}/>
          </div>}
      />
      <div className='App-picture'>
      {birds ? (
          <img src={`data:image/png;base64,${birds}`} alt="Generated Bird" sizes='400' />
        ) : (
          <p>No bird image generated yet.</p>
        )}
        <div><button className='App-button' onClick={debouncedHandleGenerateClick}>Generate</button></div>
        <p style={{scale:'0.5'}}> powered by generative ai</p>
      </div>
        </div>
      <div className='App-footer'><p>Like what you see? Check out my socials</p> <SocialMediaLinks/> </div>  
    </div>
  );
}

export default App;
