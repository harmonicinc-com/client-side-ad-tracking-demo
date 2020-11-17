import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { SessionContext } from './SessionService';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
  }
}));

function InfoSection() {
  const classes = useStyles();

  const session = React.useContext(SessionContext);

  const load = () => {
    session.load();
  }

  return (
    <div className={classes.root}>
      <TextField label="Manifest URL" fullWidth={true} defaultValue={session.manifestUrl} />
      <Box paddingTop={2}>
        <Button variant="contained" color="primary" onClick={load}>
          Load
        </Button>
      </Box>
    </div>
  );
}

export default InfoSection;