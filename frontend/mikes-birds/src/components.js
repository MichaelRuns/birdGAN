import React, {useState} from 'react';
import {Button, Menu, MenuItem, Typography, Dialog, DialogTitle, DialogContent, DialogActions} from '@mui/material';

import './App.css';

export function AboutMenu(props) {
  const {_handleAboutMenuClicks} = props
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div>
    <Button style={{color: 'white'}} onClick={handleClick}> About</Button>
    <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
      <MenuItem onClick={() => {_handleAboutMenuClicks(0); handleClose();}}>About GANs</MenuItem>
        <MenuItem onClick={() => {_handleAboutMenuClicks(1); handleClose();}}>About the Author</MenuItem>
        <MenuItem onClick={() => {_handleAboutMenuClicks(2); handleClose();}}>About the code</MenuItem>
        <MenuItem onClick={() => {_handleAboutMenuClicks(3); handleClose();}}>Why "Chidori"</MenuItem>
      </Menu>
    </div>
  );
}

export function TitleCard(){
    return(
        <Typography variant='h1' style={{color: 'white'}}>Chidori</Typography>
    )
}

export function AboutCard({open, onClose, title, content }){
  return(
 <Dialog open={open} onClose={onClose}>
  <DialogTitle>{title}</DialogTitle>

  <DialogContent>
    <p>{content}</p>
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Close</Button>
  </DialogActions>
</Dialog>
  );
}
