import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { SessionContext } from './SessionService';
import './AdPodList.css'

const useStyles = makeStyles((theme) => ({
  adItem: {
    fontSize: 13,
    // whiteSpace: "nowrap",
    // overflow: "hidden",
    // textOverflow: "ellipsis"
  },
  podOnAir: {
    backgroundColor: "#368cee"
  },
  adOnAir: {
    backgroundColor: "#71B4FF"
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
            <ListItem key={pod.id} className={pod.start < playheadInMs && playheadInMs < pod.start + pod.duration ? classes.podOnAir : ''}>
              <ListItemText disableTypography className={classes.adItem}>
                <div>
                  Ad Pod: {pod.id}
                </div>
                <div>
                  Time: {(pod.start / 1000).toFixed(1)}s, Duration: {(pod.duration / 1000).toFixed(1)}s
                </div>
                <List>
                  {pod.ads.map((ad) =>
                    <ListItem key={ad.id} className={ad.start < playheadInMs && playheadInMs < ad.start + ad.duration ? classes.adOnAir : ''}>
                      <ListItemText disableTypography className={classes.adItem}>
                        <div>
                          Ad: {ad.id}
                        </div>
                        <div>
                          Time: {(ad.start / 1000).toFixed(1)}s, Duration: {(ad.duration / 1000).toFixed(1)}s
                        </div>
                        {ad.trackingUrls ? 
                          <List variant="flush">
                            {ad.trackingUrls.map((trackingUrl,index) =>
                              <ListItem key={index}>
                                <ListItemText disableTypography className={classes.adItem}>
                                  <div>
                                    Event: {trackingUrl.event}
                                  </div>
                                  <div>
                                    URL: {trackingUrl.url}
                                  </div>
                                  <div>
                                    Sent: {trackingUrl.sent ? 'Yes' : ''}
                                  </div>
                                </ListItemText>
                              </ListItem>
                            )}
                          </List>
                          : null
                        }
                      </ListItemText>
                    </ListItem>
                  )}
                </List>
              </ListItemText>
            </ListItem>
          )}
        </List>
        : null
      }
    </div>
  );
}

export default AdPodList;
