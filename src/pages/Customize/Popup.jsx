import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const ThankYouDialog = () => {
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    // Your form submission logic here

    // Open dialog
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Thank You!</DialogTitle>
        <DialogContent>
          <p>Your form has been submitted successfully.</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Ok
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ThankYouDialog;
