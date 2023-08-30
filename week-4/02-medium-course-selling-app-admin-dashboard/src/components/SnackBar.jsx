import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import { useRecoilState,useRecoilValue, useSetRecoilState } from 'recoil';
import { isOpen } from '../store/selectors/isOpen';
import { message } from '../store/selectors/message';
import { severity } from '../store/selectors/severity';
import { flashState } from "../store/atoms/flash";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar() {
  const open = useRecoilValue(isOpen);
  const messageAll = useRecoilValue(message);
  const severityALL = useRecoilValue(severity);
  const setSnackbar = useSetRecoilState(flashState);

  const handleClose = () => {
    setSnackbar({
        open: false,
        message: "",
        severity: "",
    })
  };

  return (
      <Snackbar 
        open={open} 
        autoHideDuration={2000} 
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal:'right' }}
      >
        <Alert onClose={handleClose} severity={severityALL} sx={{ width: '100%' }}>
          {messageAll}
        </Alert>
      </Snackbar>
  );
}

