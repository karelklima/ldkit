import React, { useState, useRef, useCallback } from "react";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";

import { Todos, getRandomId, store } from "../store";

export const Add: React.FC = () => {
  const [isOpen, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>();

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleAdd = useCallback(() => {
    const value = inputRef.current?.value;
    console.log(value);
    if (!value) {
      return;
    }
    const id = getRandomId();
    Todos.insert(id, { description: value });
    setOpen(false);
  }, [inputRef, setOpen]);

  return (
    <>
      <Fab
        color="primary"
        aria-label="add"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        onClick={handleClickOpen}
      >
        <AddIcon />
      </Fab>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>To do...</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            autoComplete="off"
            margin="dense"
            id="name"
            label="New TODO item"
            type="email"
            fullWidth
            variant="filled"
            inputRef={inputRef}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
