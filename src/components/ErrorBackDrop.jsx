import React from "react";
import Backdrop from "@mui/material/Backdrop";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from '@mui/material'

const ErrorBackDrop = ({setshowCatchError, showCatchError}) => {
//   const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setshowCatchError(false)
  };

  return (
    <div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showCatchError}
        onClick={handleClose}
      >
        <Dialog
          open={showCatchError}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Use Google's location service?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Let Google help apps determine location. This means sending
              anonymous location data to Google, even when no apps are running.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>ok</Button>
          </DialogActions>
        </Dialog>
      </Backdrop>
    </div>
  );
};

export default ErrorBackDrop;
