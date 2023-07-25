import React, { useState } from 'react';
import './App.css';

export function AboutMenu() {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };
  return (
    <div
      className="App-dropdown"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="App-dropbtn">About</button>
      {isExpanded && (
        <div className="App-dropdown-content">
            <button>About GANs</button>
          <button>About the Author</button>
          <button>About the code</button>
          <button>Why "Chidori"</button>
        </div>
      )}
    </div>
  );
}

export function TitleCard(){
    return(
        <div>
            <p> Chidori</p>
        </div>
    )
}
