import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { SessionContext } from './SessionService';
import './AdPodList.css'

function AdPodList() {
  const session = React.useContext(SessionContext);

  const pods = session.adPods ? session.adPods : [];

  const playheadInMs = session.currentTime * 1000;

  return (
    <div className="ad-pod-list">
      {pods ?
        <ListGroup>
          {pods.map((pod) =>
            <ListGroup.Item key={pod.id} className={pod.start < playheadInMs && playheadInMs < pod.start + pod.duration ? 'ad-pod-on-air' : 'inactive'}>
              <div>
                Ad Pod: {pod.id}
              </div>
              <div>
                Time: {(pod.start / 1000).toFixed(1)}s, Duration: {(pod.duration / 1000).toFixed(1)}s
              </div>
              <ListGroup>
                {pod.ads.map((ad) =>
                  <ListGroup.Item key={ad.id} className={ad.start < playheadInMs && playheadInMs < ad.start + ad.duration ? 'ad-on-air' : 'inactive'}>
                    <div>
                      Ad: {ad.id}
                    </div>
                    <div>
                      Time: {(ad.start / 1000).toFixed(1)}s, Duration: {(ad.duration / 1000).toFixed(1)}s
                    </div>
                    {ad.trackingUrls ? 
                      <ListGroup variant="flush">
                        {ad.trackingUrls.map((trackingUrl,index) =>
                          <ListGroup.Item key={index}>
                            <div>
                              Sent: {trackingUrl.sent ? 'Yes' : ''}
                            </div>
                            <div>
                              Event: {trackingUrl.event}
                            </div>
                            <div>
                              URL: {trackingUrl.url}
                            </div>
                          </ListGroup.Item>
                        )}
                      </ListGroup>
                      : null
                    }
                  </ListGroup.Item>
                )}
              </ListGroup>
            </ListGroup.Item>
          )}
        </ListGroup>
        : null
      }
    </div>
  );
}

export default AdPodList;
