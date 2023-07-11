import React from 'react';
import { SnackbarContext } from './SnackbarContext';
import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';

function SnackbarAlert() {
  const { snackbarState, closeSnackbar } = React.useContext(SnackbarContext);

  const handleSnackbarClose = () => {
    closeSnackbar();
  };

  return (
    <Snackbar
      open={snackbarState.open}
      autoHideDuration={3000}
      onClose={handleSnackbarClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        onClose={handleSnackbarClose}
        severity={snackbarState.severity}
        sx={{ width: '100%' }}
      >
        {snackbarState.message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarAlert;