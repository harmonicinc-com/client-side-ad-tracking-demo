import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Button, Link, TextField } from '@material-ui/core';
import { SessionContext } from './SessionService';

const useStyles = makeStyles((theme) => ({
  buttons: {
    '& > *': {
      marginRight: theme.spacing(1),
    },
  }
}));

function InfoSection() {
  const classes = useStyles();

  const session = React.useContext(SessionContext);

  const urlInputRef = React.createRef();

  const preventDefault = (event) => event.preventDefault();

  const load = async () => {
    await session.load(urlInputRef.current.value);
  }

  const unload = () => {
    session.unload();
  }

  return (
    <div>
      <TextField inputRef={urlInputRef} label="Media URL" fullWidth={true} defaultValue={session.mediaUrl} />
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
          {session.manifestUrl ? session.manifestUrl : ''}
        </Link>
      </Box>
      <Box width={1} paddingTop={1} display="flex" flexDirection="row">
        <Link href="#" color="inherit" onClick={preventDefault}>
          {session.adTrackingMetadataUrl ? session.adTrackingMetadataUrl : ''}
        </Link>
      </Box>
    </div>
  );
}

export default InfoSection;