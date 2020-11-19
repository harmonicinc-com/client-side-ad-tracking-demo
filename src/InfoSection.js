import { useContext, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Link, TextField } from '@material-ui/core';
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

  return (
    <div>
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