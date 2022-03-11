import { useContext, useState } from 'react';
import makeStyles from '@mui/styles/makeStyles';
import { Collapse, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import MovieIcon from '@mui/icons-material/Movie';
import FolderIcon from '@mui/icons-material/Folder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import AdTrackingContext from './AdTrackingContext';
import {theme} from "./App";
import {Ad, AdBreak} from "../types/AdBeacon";

const useStyles = makeStyles(() => ({
  itemText: {
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  podItem: {
  },
  podItemOnAir: {
    backgroundColor: "#42a5f5",
    '&:hover': {
      background: "#2196f3",
    }
  },
  adItem: {
    paddingLeft: theme.spacing(4),
  },
  adItemOnAir: {
    paddingLeft: theme.spacing(4),
    backgroundColor: "#90caf9",
    '&:hover': {
      background: "#64b5f6",
    }
  },
  trackingUrlItem: {
    paddingLeft: theme.spacing(8),
    paddingTop: theme.spacing(0),
    paddingBottom: theme.spacing(1)
  },
  greenIcon: {
    color: 'green'
  },
  redIcon: {
    color: 'red'
  }
}));

function AdPodList() {
  const classes = useStyles();

  const adTrackingContext = useContext(AdTrackingContext);

  if (adTrackingContext === undefined) {
    throw new Error('AdTrackingContext is undefined');
  }

  const [expandPods, setExpandPods] = useState<{[key: string]: boolean}>({});

  const [expandAds, setExpandAds] = useState<{[key: string]: boolean}>({});

  const pods = adTrackingContext.adPods || [];

  const playheadInMs = adTrackingContext.lastPlayheadTime;

  const presentationStartTime = adTrackingContext.presentationStartTime;

  const shouldExpandPod = (pod: AdBreak): boolean => {
    const keepPastPodFor = 2000;
    if (pod.id in expandPods) {
      return expandPods[pod.id];
    } else {
      return playheadInMs !== null && playheadInMs < pod.startTime + pod.duration + keepPastPodFor;
    }
  }

  const toggleExpandPod = (pod: AdBreak) => {
    const newState = {
      ...expandPods,
      [pod.id]: !shouldExpandPod(pod)
    };
    Object.keys(expandPods)
      .filter(key => !pods.find(p => p.id === key))
      .forEach(key => delete newState[key]);
    setExpandPods(newState);
  }

  const shouldExpandAd = (ad: Ad, pod: AdBreak) => {
    const keepPastAdFor = 2000;
    if (pod.id + '/' + ad.id in expandAds) {
      return expandAds[pod.id + '/' + ad.id];
    } else {
      return playheadInMs !== null && playheadInMs < ad.startTime + ad.duration + keepPastAdFor;
    }
  }

  const toggleExpandAd = (ad: Ad, pod: AdBreak) => {
    const newState = {
      ...expandAds,
      [pod.id + '/' + ad.id]: !shouldExpandAd(ad, pod)
    };
    Object.keys(expandAds)
      .filter(key => !pods.find(p => key.startsWith(p.id + '/')))
      .forEach(key => delete newState[key]);
    setExpandAds(newState);
  };

  const getPlayhead = (rawTime: number) => rawTime + presentationStartTime;

  return (
    <div className="ad-pod-list">
      {pods ?
        <List>
          {pods.map((pod) =>
            <div key={pod.id}>
              <ListItem button onClick={() => toggleExpandPod(pod)} className={pod.startTime < playheadInMs && playheadInMs < pod.startTime + pod.duration ? classes.podItemOnAir : classes.podItem}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText disableTypography className={classes.itemText}>
                  <div>
                    Ad Pod: {pod.id}
                  </div>
                  <div>
                    Time: {new Date(getPlayhead(pod.startTime)).toLocaleString()}, Duration: {(pod.duration / 1000).toFixed(1)}s
                  </div>
                </ListItemText>
                {shouldExpandPod(pod) ? <ExpandLess /> : <ExpandMore />}
              </ListItem>
              <Collapse key={pod.id + ".ads"} in={shouldExpandPod(pod)} timeout="auto" unmountOnExit>
                <List>
                  {pod.ads.map((ad) =>
                    <div key={ad.id}>
                      <ListItem button onClick={() => toggleExpandAd(ad, pod)} className={ad.startTime < playheadInMs && playheadInMs < ad.startTime + ad.duration ? classes.adItemOnAir : classes.adItem}>
                        <ListItemIcon>
                          <MovieIcon />
                        </ListItemIcon>
                        <ListItemText disableTypography className={classes.itemText}>
                          <div>
                            Ad: {ad.id}
                          </div>
                          <div>
                            Time: {new Date(getPlayhead(ad.startTime)).toLocaleString()}, Duration: {(ad.duration / 1000).toFixed(1)}s
                          </div>
                        </ListItemText>
                        {shouldExpandAd(ad, pod) ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse key={ad.id + ".trackingUrls"} in={shouldExpandAd(ad, pod)} timeout="auto" unmountOnExit>
                        <List>
                          {ad.trackingEvents ?
                            ad.trackingEvents.map((trackingUrl,index) =>
                              <ListItem key={index} className={classes.trackingUrlItem}>
                                <ListItemIcon>
                                  {trackingUrl.reportingState === "IDLE" ? <RadioButtonUncheckedIcon /> : null}
                                  {trackingUrl.reportingState === "REPORTING" ? <HourglassFullIcon /> : null}
                                  {trackingUrl.reportingState === "DONE" ? <CheckCircleIcon className={classes.greenIcon} /> : null}
                                  {trackingUrl.reportingState === "ERROR" ? <ErrorIcon className={classes.redIcon} /> : null}
                                </ListItemIcon>
                                <ListItemText disableTypography className={classes.itemText}>
                                  <div>
                                    Event: {trackingUrl.event}
                                  </div>
                                  <div>
                                    URL: {trackingUrl.signalingUrls}
                                  </div>
                                  {trackingUrl.startTime ?
                                    <div>
                                      Time: {new Date(getPlayhead(trackingUrl.startTime)).toLocaleString()}
                                    </div>
                                    : null}
                                </ListItemText>
                              </ListItem>
                            )
                            : null
                          }
                        </List>
                      </Collapse>
                    </div>
                  )}
                </List>
              </Collapse>
            </div>
          )}
        </List>
        : null
      }
    </div>
  );
}

export default AdPodList;
