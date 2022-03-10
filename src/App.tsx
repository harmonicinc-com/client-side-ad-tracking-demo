import './App.css'
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import makeStyles from '@mui/styles/makeStyles';
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import AdPodList from './AdPodList'
import { DefaultErrorContextProvider } from './ErrorContext'
import AdTrackingPlaybackSessionProvider
  from './AdTrackingPlaybackSessionProvider'
import PlayerContainer from './PlayerContainer'
import InfoSection from './InfoSection'
import { Route, BrowserRouter } from 'react-router-dom'

export const theme = createTheme({
  palette: {
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#e0e0e0',
    },
  },
})

const useStyles = makeStyles(() => ({
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  },
}))

function App () {
  const classes = useStyles()

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/client-side-ad-tracking-demo">
          <Route exact path="/">
            <DefaultErrorContextProvider>
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
                          <Tab label="Tracking Events"/>
                        </Tabs>
                        <AdPodList/>
                      </Paper>
                    </Grid>
                  </Grid>
                </Container>
              </AdTrackingPlaybackSessionProvider>
            </DefaultErrorContextProvider>
          </Route>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App
