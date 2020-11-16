// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdPodList from './AdPodList';
import { SessionProvider } from './SessionService';
import PlayerContainer from './PlayerContainer';

function App() {
  return (
    <SessionProvider>
      <Container>
        <Row>
          <Col md>
            <PlayerContainer/>
          </Col>
          <Col md>
            <Nav variant="tabs" defaultActiveKey="/home">
              <Nav.Item>
                <Nav.Link href="/home">Tracking Events</Nav.Link>
              </Nav.Item>
            </Nav>
            <AdPodList />
          </Col>
        </Row>
      </Container>
    </SessionProvider>
  );
}

export default App;
