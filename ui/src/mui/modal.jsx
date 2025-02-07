import React from 'react';
import PropTypes from 'prop-types';
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

const Modal = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2)
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1)
  }
}));

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  
  return (
    <DialogTitle sx={{ m: 0, p: 1.5 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
    ) : null}
    </DialogTitle>
  );
};
  
BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export { 
  Modal,
  BootstrapDialogTitle as ModalTitle,
  DialogContent as ModalContent,
  DialogActions as ModalActions 
}