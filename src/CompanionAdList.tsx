import { Collapse, List, ListItem, ListItem as ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useContext, useState } from "react";
import { Ad, AdBreak, TrackingEvent } from "../types/AdBeacon";
import AdTrackingContext from "./AdTrackingContext";
import { theme } from "./App";
import FolderIcon from '@mui/icons-material/Folder';
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import MovieIcon from '@mui/icons-material/Movie';
import ImageIcon from '@mui/icons-material/Image';

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
  companionAdItem: {
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

export default function CompanionAdList() {
  const classes = useStyles();

  const adTrackingContext = useContext(AdTrackingContext);

  if (adTrackingContext === undefined) {
    throw new Error('AdTrackingContext is undefined');
  }

  const [expandPods, setExpandPods] = useState<{ [key: string]: boolean }>({});

  const [expandAds, setExpandAds] = useState<{ [key: string]: boolean }>({});

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

  const getTime = (o: AdBreak | Ad | TrackingEvent) => {
    return new Date(o.startTime + presentationStartTime).toLocaleString();
  }
  const getClass = (o: AdBreak | Ad | TrackingEvent) => {
    const startTime = o.startTime;
    return startTime < playheadInMs && playheadInMs < startTime + o.duration ? classes.podItemOnAir : classes.podItem
  }

  return (
    <div className="ad-pod-list">
      {pods.length > 0 ?
        <List>
          {pods.map((pod) =>
            <div key={pod.id}>
              <ListItemButton onClick={() => toggleExpandPod(pod)} className={getClass(pod)}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText disableTypography className={classes.itemText}>
                  <div>
                    Ad Pod: {pod.id}
                  </div>
                  <div>
                    Time: {getTime(pod)}, Duration: {(pod.duration / 1000).toFixed(1)}s
                  </div>
                </ListItemText>
                {shouldExpandPod(pod) ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse key={pod.id + ".ads"} in={shouldExpandPod(pod)} timeout="auto" unmountOnExit>
                <List>
                  {pod.ads.map((ad) =>
                    <div key={ad.id}>
                      <ListItemButton onClick={() => toggleExpandAd(ad, pod)} className={getClass(ad)}>
                        <ListItemIcon>
                          <MovieIcon />
                        </ListItemIcon>
                        <ListItemText disableTypography className={classes.itemText}>
                          <div>
                            Ad: {ad.id}
                          </div>
                          <div>
                            Time: {getTime(ad)}, Duration: {(ad.duration / 1000).toFixed(1)}s
                          </div>
                        </ListItemText>
                        {shouldExpandAd(ad, pod) ? <ExpandLess /> : <ExpandMore />}
                      </ListItemButton>
                      <Collapse key={ad.id + ".companionAds"} in={shouldExpandAd(ad, pod)} timeout="auto" unmountOnExit>
                        <List>
                          {ad.companionAds.length > 0 ?
                          ad.companionAds.map((companionAd, index) =>
                            <div key={`${ad.id}-companionAd-${index}`}>
                              <ListItemButton>
                                <ListItemText>
                                  Companion Ad #{index}
                                </ListItemText>
                              </ListItemButton>
                              <Collapse key={`${ad.id}-companion`} in={shouldExpandAd(ad, pod)} timeout="auto" unmountOnExit>
                                <List>
                                  {companionAd.companion.map((companion, index) =>
                                    <div key={`${ad.id}-companion-${index}`}>
                                      <ListItem className={classes.companionAdItem}>
                                        <ListItemIcon>
                                          <ImageIcon />
                                        </ListItemIcon>
                                        <ListItemText disableTypography className={classes.itemText}>
                                          <div>
                                            Companion ID: {companion.attributes.id}
                                          </div>
                                          <div>
                                            Slot dimensions: {companion.attributes.width} x {companion.attributes.height}
                                          </div>
                                          <div>
                                            Creative dimensions: {companion.attributes.assetWidth} x {companion.attributes.assetHeight}
                                          </div>
                                        </ListItemText>
                                      </ListItem>
                                    </div>
                                  )}
                                </List>
                              </Collapse>
                            </div>
                          )
                          : <div style={{padding: '32px 0'}} className={classes.itemText}>
                              No upcoming companion ads
                            </div>
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
        : <div style={{padding: '32px 0'}} className={classes.itemText}>
            No upcoming ads
          </div>
      }
    </div>
  );
}