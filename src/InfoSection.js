import { useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Link, Snackbar, TextField, Typography } from '@material-ui/core';
import MuiAlert from '@material-ui/lab/Alert';
import { ErrorContext } from './ErrorContext';
import SessionContext from './SessionContext';

const useStyles = makeStyles((theme) => ({
  buttons: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
  }
}));

function InfoSection() {
  const classes = useStyles();

  const errorContext = useContext(ErrorContext);

  const sessionContext = useContext(SessionContext);

  const sessionInfo = sessionContext.sessionInfo;

  const urlInputRef = useRef();

  const preventDefault = (event) => event.preventDefault();

  const load = async () => {
    await sessionContext.load(urlInputRef.current.value);
  }

  const unload = () => {
    sessionContext.unload();
  }

  const closeAlert = (errorKey) => {
    errorContext.acknowledgeError(errorKey);
  }

  return (
    <div>
      {
        Object.entries(errorContext.errors).map(([key, error]) => (
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={!error.acknowledged}>
            <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => closeAlert(key)}>
              {error.message}
            </MuiAlert>
          </Snackbar>  
        ))
      }

      <Typography variant="h5" gutterBottom>
        Harmonic Client Side Ad Tracking Demo
      </Typography>
      <TextField inputRef={urlInputRef} label="Media URL" fullWidth={true} defaultValue={sessionInfo.mediaUrl || ''} />
      <Box className={classes.buttons} width={1} paddingTop={2} display="flex" flexDirection="row">
        <Button variant="contained" color="primary" onClick={load}>
          Load
        </Button>
        <Button variant="contained" onClick={unload}>
          Unload
        </Button>
      </Box>
      <Box width={1} paddingTop={2} display="flex" flexDirection="row">
        <Link href="#" color="inherit" onClick={preventDefault}>
          {sessionInfo.manifestUrl ? sessionInfo.manifestUrl : ''}
        </Link>
      </Box>
      <Box width={1} paddingTop={1} display="flex" flexDirection="row">
        <Link href="#" color="inherit" onClick={preventDefault}>
          {sessionInfo.adTrackingMetadataUrl ? sessionInfo.adTrackingMetadataUrl : ''}
        </Link>
      </Box>
    </div>
  );
}

export default InfoSection;