import { useContext, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Collapse, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import MovieIcon from '@material-ui/icons/Movie';
import FolderIcon from '@material-ui/icons/Folder';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import AdTrackingContext from './AdTrackingContext';

const useStyles = makeStyles((theme) => ({
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

  const [expandPods, setExpandPods] = useState({});

  const [expandAds, setExpandAds] = useState({});

  const pods = adTrackingContext.adPods ? adTrackingContext.adPods : [];

  const playheadInMs = adTrackingContext.lastPlayheadTime;

  const shouldExpandPod = (pod) => {
    const keepPastPodFor = 2000;
    if (pod.id in expandPods) {
      return expandPods[pod.id];
    } else {
      return playheadInMs !== null && playheadInMs < pod.startTime + pod.duration + keepPastPodFor;
    }
  }

  const toggleExpandPod = (pod) => {
    const newState = {
      ...expandPods,
      [pod.id]: !shouldExpandPod(pod)
    };
    Object.keys(expandPods)
      .filter(key => !pods.find(p => p.id === key))
      .forEach(key => delete newState[key]);
    setExpandPods(newState);
  }

  const shouldExpandAd = (ad, pod) => {
    const keepPastAdFor = 2000;
    if (pod.id + '/' + ad.id in expandAds) {
      return expandAds[pod.id + '/' + ad.id];
    } else {
      return playheadInMs !== null && playheadInMs < ad.startTime + ad.duration + keepPastAdFor;
    }
  }

  const toggleExpandAd = (ad, pod) => {
    const newState = {
      ...expandAds,
      [pod.id + '/' + ad.id]: !shouldExpandAd(ad, pod)
    };
    Object.keys(expandAds)
      .filter(key => !pods.find(p => key.startsWith(p.id + '/')))
      .forEach(key => delete newState[key]);
    setExpandAds(newState);
  };

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
                    Time: {new Date(pod.startTime).toLocaleString()}, Duration: {(pod.duration / 1000).toFixed(1)}s
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
                            Time: {new Date(ad.startTime).toLocaleString()}, Duration: {(ad.duration / 1000).toFixed(1)}s
                          </div>
                        </ListItemText>
                        {shouldExpandAd(ad, pod) ? <ExpandLess /> : <ExpandMore />}
                      </ListItem>
                      <Collapse key={ad.id + ".trackingUrls"} in={shouldExpandAd(ad, pod)} timeout="auto" unmountOnExit>
                        <List>
                          {ad.trackingUrls ? 
                            ad.trackingUrls.map((trackingUrl,index) =>
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
                                    URL: {trackingUrl.url}
                                  </div>
                                  {trackingUrl.startTime ?
                                    <div>
                                      Time: {new Date(trackingUrl.startTime).toLocaleString()}
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
