// import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Nav from 'react-bootstrap/Nav';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import AdPodList from './AdPodList';
import { SessionProvider } from './SessionService';
import PlayerContainer from './PlayerContainer';
import InfoSection from './InfoSection';

function App() {
  return (
    <SessionProvider>
      <Container fluid>
        <Row>
          <Col>
            <InfoSection/>
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <PlayerContainer/>
          </Col>
          <Col md={6}>
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
