import './App.css';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AdPodList from './AdPodList';
import AdTrackingPlaybackSessionProvider from './AdTrackingPlaybackSessionProvider';
import PlayerContainer from './PlayerContainer';
import InfoSection from './InfoSection';
import { Route, BrowserRouter as Router } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}));

function App() {
  const classes = useStyles();

  return (
    <Router>
      <Route exact path="/">
        <AdTrackingPlaybackSessionProvider>
          <Container>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Paper square className={classes.paper}>
                  <InfoSection/>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper square className={classes.paper}>
                  <PlayerContainer/>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Paper square className={classes.paper}>
                  <Tabs
                    value={0}
                    indicatorColor="primary"
                    textColor="primary">
                    <Tab label="Tracking Events" />
                  </Tabs>
                  <AdPodList />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </AdTrackingPlaybackSessionProvider>
      </Route>
    </Router>
  );
}

export default App;
