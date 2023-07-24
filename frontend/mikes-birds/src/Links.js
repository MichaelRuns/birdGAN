import React from 'react';
import './App.css';
const SocialMediaLinks = () => {
  const socialMediaLinks = [
    {
      platform: 'Github',
      link: 'https://github.com/MichaelRuns',
      logo: process.env.PUBLIC_URL + '/png-transparent-github-social-media-computer-icons-logo-android-github-logo-computer-wallpaper-banner-thumbnail.png',
    },
    {
      platform: 'LinkedIn',
      link: 'https://www.linkedin.com/in/michaelvernau/',
      logo: process.env.PUBLIC_URL + '/png-transparent-linkedin-free-text-telephone-call-trademark-thumbnail.png',
    },
    // Add more social media platforms as needed
  ];

  return (
    <div className='Links-container'>
      {socialMediaLinks.map((item, index) => (
        <a key={index} href={item.link} target="_blank" rel="noopener noreferrer">
          <img src={item.logo} alt={item.platform} width="30" height="30" />
        </a>
      ))}
    </div>
  );
};

export default SocialMediaLinks;
