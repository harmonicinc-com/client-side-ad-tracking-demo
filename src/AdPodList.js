import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { SessionContext } from './SessionService';
import './AdPodList.css'

function AdPodList() {
  const session = React.useContext(SessionContext);

  const pods = session.adPods;

  return (
    <div className="ad-pod-list">
      {pods ?
        <ListGroup>
          {pods.map((pod) =>
            <ListGroup.Item key={pod.id} className={pod.start < session.playheadTime && session.playheadTime < pod.start + pod.duration ? 'ad-pod-on-air' : 'inactive'}>
              <div>
                Ad Pod: {pod.id}
              </div>
              <div>
                Time: {new Date(pod.start).toLocaleString()} - {new Date(pod.start + pod.duration).toLocaleString()}
              </div>
              <ListGroup>
                {pod.ads.map((ad) =>
                  <ListGroup.Item key={ad.id} className={ad.start < session.playheadTime && session.playheadTime < ad.start + ad.duration ? 'ad-on-air' : 'inactive'}>
                    <div>
                      Ad: {ad.id}
                    </div>
                    <div>
                      Time: {new Date(ad.start).toLocaleString()} - {new Date(ad.start + ad.duration).toLocaleString()}
                    </div>
                    {ad.trackingUrls ? 
                      <ListGroup variant="flush">
                        {ad.trackingUrls.map((trackingUrl,index) =>
                          <ListGroup.Item key={index}>
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
