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
import { useState } from 'react';
import CompanionAdList from './components/CompanionAdList';
import CompanionAdContextProvider from './context/CompanionAdContextProvider';
import CompanionAd from './components/CompanionAd';

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

function App() {
  const classes = useStyles()
  const [tab, setTab] = useState(0)

  const handleTabChange = (_event: React.ChangeEvent<{}>, newValue: number) => {
    setTab(newValue)
  }

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>
        <BrowserRouter basename="/client-side-ad-tracking-demo">
          <Route exact path="/">
            <DefaultErrorContextProvider>
              <AdTrackingPlaybackSessionProvider>
                <CompanionAdContextProvider>
                  <Container>
                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <Paper square className={classes.paper}>
                          <InfoSection />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Paper square className={classes.paper}>
                          <PlayerContainer />
                        </Paper>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <CompanionAd adSlotId="1" />
                        <Paper square className={classes.paper}>
                          <Tabs
                            value={tab}
                            onChange={handleTabChange}
                            indicatorColor="primary"
                            textColor="primary">
                            <Tab label="Tracking Events" />
                            <Tab label="Companion Ads" />
                          </Tabs>
                          {tab === 0 && <AdPodList />}
                          {tab === 1 && <CompanionAdList />}
                        </Paper>
                      </Grid>
                    </Grid>
                  </Container>
                </CompanionAdContextProvider>
              </AdTrackingPlaybackSessionProvider>
            </DefaultErrorContextProvider>
          </Route>
        </BrowserRouter>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}

export default App
