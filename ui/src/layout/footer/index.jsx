import React, { Fragment } from "react";
import { Container, Row, Col } from "reactstrap";
const Footer = (props) => {
  return (
    <Fragment>
      <footer className="footer" style={{ position: "relative", top: "50px" }}>
        <Container fluid={true}>
          <Row>
            <Col
              md="12"
              className="footer-copyright text-center"
              // style={{ position: "relative", bottom: "-95px", left: "50px" }}
            >
              <p className="mb-0">{" Powered by SPARK RADIUS"}</p>
            </Col>
          </Row>
        </Container>
      </footer>
    </Fragment>
  );
};

export default Footer;
