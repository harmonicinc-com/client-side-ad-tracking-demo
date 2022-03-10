import React, { useContext, useRef, MouseEvent } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Box, Button, Link, Snackbar, TextField, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { ErrorContext } from './ErrorContext';
import SessionContext from './SessionContext';
import {theme} from "./App";

const useStyles = makeStyles(() => ({
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

  if (sessionContext === undefined) {
    throw new Error('SessionContext is undefined');
  }

  const sessionInfo = sessionContext.sessionInfo;

  const urlInputRef = useRef<any>();

  const preventDefault = (event: MouseEvent<HTMLAnchorElement | HTMLSpanElement>) => event.preventDefault();

  const load = async () => {
    await sessionContext.load(urlInputRef.current.value);
  }

  const unload = () => {
    sessionContext.unload();
  }

  const closeAlert = (errorKey: string) => {
    errorContext.acknowledgeError(errorKey);
  }

  return (
    <div>
      {
        Object.entries(errorContext.errors).map(([key, error], i) => (
          <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'right' }} open={!error.acknowledged} key={i}>
            <MuiAlert elevation={6} variant="filled" severity="error" onClose={() => closeAlert(key)}>
              {error.message}
            </MuiAlert>
          </Snackbar>
        ))
      }

      <Typography variant="h5" gutterBottom>
        Harmonic Client Side Ad Tracking Demo
      </Typography>
      <TextField inputRef={urlInputRef} label="Media URL" fullWidth={true} defaultValue={sessionInfo.mediaUrl || ''} variant={'standard'} />
      <Box className={classes.buttons} width={1} paddingTop={2} display="flex" flexDirection="row">
        <Button variant="contained" color="primary" onClick={load}>
          Load
        </Button>
        <Button variant="contained" color="secondary" onClick={unload}>
          Unload
        </Button>
      </Box>
      <Box width={1} paddingTop={2} display="flex" flexDirection="row">
        <Link href="#" color="inherit" onClick={preventDefault} underline="hover">
          {sessionInfo.manifestUrl ? sessionInfo.manifestUrl : ''}
        </Link>
      </Box>
      <Box width={1} paddingTop={1} display="flex" flexDirection="row">
        <Link href="#" color="inherit" onClick={preventDefault} underline="hover">
          {sessionInfo.adTrackingMetadataUrl ? sessionInfo.adTrackingMetadataUrl : ''}
        </Link>
      </Box>
    </div>
  );
}

export default InfoSection;
