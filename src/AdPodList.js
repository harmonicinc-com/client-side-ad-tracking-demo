import React from 'react';
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
import { SessionContext } from './SessionService';
import './AdPodList.css'

const useStyles = makeStyles((theme) => ({
  itemText: {
    fontSize: 13,
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis"
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
    color: 'green',
  }
}));

function AdPodList() {
  const classes = useStyles();

  const session = React.useContext(SessionContext);

  const pods = session.adPods ? session.adPods : [];

  const playheadInMs = session.currentTime * 1000;

  return (
    <div className="ad-pod-list">
      {pods ?
        <List>
          {pods.map((pod) =>
            <>
              <ListItem key={pod.id} className={pod.start < playheadInMs && playheadInMs < pod.start + pod.duration ? classes.podItemOnAir : classes.podItem}>
                <ListItemIcon>
                  <FolderIcon />
                </ListItemIcon>
                <ListItemText disableTypography className={classes.itemText}>
                  <div>
                    Ad Pod: {pod.id}
                  </div>
                  <div>
                    Time: {(pod.start / 1000).toFixed(1)}s, Duration: {(pod.duration / 1000).toFixed(1)}s
                  </div>
                </ListItemText>
              </ListItem>
              <List>
                {pod.ads.map((ad) =>
                  <>
                    <ListItem key={ad.id} className={ad.start < playheadInMs && playheadInMs < ad.start + ad.duration ? classes.adItemOnAir : classes.adItem}>
                      <ListItemIcon>
                        <MovieIcon />
                      </ListItemIcon>
                      <ListItemText disableTypography className={classes.itemText}>
                        <div>
                          Ad: {ad.id}
                        </div>
                        <div>
                          Time: {(ad.start / 1000).toFixed(1)}s, Duration: {(ad.duration / 1000).toFixed(1)}s
                        </div>
                      </ListItemText>
                    </ListItem>
                    {ad.trackingUrls ? 
                      <List>
                        {ad.trackingUrls.map((trackingUrl,index) =>
                          <ListItem key={index} className={classes.trackingUrlItem}>
                            <ListItemIcon>
                              {trackingUrl.sent ? <CheckCircleIcon className={classes.greenIcon} /> : <RadioButtonUncheckedIcon />}
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
                                  Time: {trackingUrl.startTime}
                                </div>
                                : null}
                            </ListItemText>
                          </ListItem>
                        )}
                      </List>
                      : null
                    }
                  </>
                )}
              </List>
            </>
          )}
        </List>
        : null
      }
    </div>
  );
}

export default AdPodList;
