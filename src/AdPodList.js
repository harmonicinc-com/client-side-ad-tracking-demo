import { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import MovieIcon from '@material-ui/icons/Movie';
import FolderIcon from '@material-ui/icons/Folder';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import SessionContext from './SessionContext';
import AdTrackingContext from './AdTrackingContext';
import './AdPodList.css'
import PlaybackContext from './PlaybackContext';

const useStyles = makeStyles((theme) => ({
  itemText: {
    fontSize: 13,
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  podItem: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0)
  },
  podItemOnAir: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0),
    backgroundColor: "#368cee"
  },
  adItem: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0)
  },
  adItemOnAir: {
    paddingLeft: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(0),
    backgroundColor: "#71B4FF"
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

  const sessionContext = useContext(SessionContext);

  const playbackContext = useContext(PlaybackContext);

  const adTrackingContext = useContext(AdTrackingContext);

  const pods = adTrackingContext.adPods ? adTrackingContext.adPods : [];

  const playheadInMs = sessionContext.presentationStartTime + playbackContext.currentTime * 1000;

  return (
    <div className="ad-pod-list">
      {pods ?
        <List>
          {pods.map((pod) =>
            <div key={pod.id}>
              <ListItem className={pod.startTime < playheadInMs && playheadInMs < pod.startTime + pod.duration ? classes.podItemOnAir : classes.podItem}>
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
              </ListItem>
              <List key={pod.id + ".ads"}>
                {pod.ads.map((ad) =>
                  <div key={ad.id}>
                    <ListItem className={ad.startTime < playheadInMs && playheadInMs < ad.startTime + ad.duration ? classes.adItemOnAir : classes.adItem}>
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
                    </ListItem>
                    <List key={ad.id + ".trackingUrls"}>
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
                  </div>
                )}
              </List>
            </div>
          )}
        </List>
        : null
      }
    </div>
  );
}

export default AdPodList;
