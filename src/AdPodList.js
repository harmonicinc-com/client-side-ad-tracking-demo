import React from 'react';
import ListGroup from 'react-bootstrap/ListGroup';
import { SessionContext } from './SessionService';

function AdPodList() {
  const session = React.useContext(SessionContext);

  const pods = session.getAdPods();

  return (
    <div>
      <ListGroup>
        {pods.map((pod) =>
          <ListGroup.Item key={pod.id}>
            Ad Pod: {pod.id}
            <ListGroup>
              {pod.ads.map((ad) =>
                <ListGroup.Item key={ad.id}>
                  Ad: {ad.id}
                  {ad.trackingUrls ? 
                    <ListGroup variant="flush">
                      {ad.trackingUrls.map((trackingUrl,index) =>
                        <ListGroup.Item key={index}>
                          URL: {trackingUrl.url}
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
    </div>
  );
}

export default AdPodList;
