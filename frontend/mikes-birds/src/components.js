import React, {useState} from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import './App.css';

export function AboutMenu() {
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  return (
    <div>
    <Button onClick={toggleMenu}> About</Button>
      <Menu open={menuOpen}>
      <MenuItem onClick={toggleMenu}>About GANs</MenuItem>
        <MenuItem onClick={toggleMenu}>About the Author</MenuItem>
        <MenuItem onClick={toggleMenu}>About the code</MenuItem>
        <MenuItem onClick={toggleMenu}>Why "Chidori"</MenuItem>
      </Menu>
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
