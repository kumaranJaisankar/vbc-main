import React, { Fragment, useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  FormGroup,
  CardBody,
  CardFooter,
  Button,
  Media,
  Form,
  Label,
  Input,
} from "reactstrap";
// import { COD, Fast, Submit, Cancel } from "../../../constant";

const FeedBack = (props) => {
  const [dispplay, setDisplay ] = useState(true)
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12" xl="4 xl-100 box-col-12"></Col>
          <Col sm="12" xl="4 xl-100 box-col-12">
            <Card>
              <CardBody className="megaoptions-border-space-sm">
                <Row>
                  <Col>
                    <h5 style={{ textAlign: "center" }}>Spark Radius</h5>
                    <br />
                    <h6 style={{ textAlign: "center", fontWeight: "bold" }}>
                      {
                        "Please share feeback on your latest interaction with Spark Radius Excutive against the Service Request."
                      }
                    </h6>
                    <br />
                    <h6 style={{ textAlign: "center", fontWeight: "bold" }}>
                      {"Ticket ID: 123456"}
                    </h6>
                  </Col>
                </Row>
                <br />
                <Form>
                  <Row>
                    <Col>
                      <Media>
                        <Media body>
                          <p className="feebacks">
                            <span className="badge pull-left digits" style={{backgroundColor:"#ffcccc"}}>
                              {"1"}
                            </span>
                          </p>
                          <br />
                          <span className="mt-0">{"Very Poor"}</span>
                        </Media>
                      </Media>
                    </Col>
                    <Col>
                      <Media>
                        <Media body>
                          <p className="feebacks">
                            <span className="badge b pull-left digits" style={{backgroundColor:"#ff9999"}}>
                              {"2"}
                            </span>
                          </p>
                          <br />
                          <span className="mt-0">{" Poor"}</span>
                        </Media>
                      </Media>
                    </Col>
                    <Col>
                      <Media>
                        <Media body>
                          <p className="feebacks">
                            <span className="badge  pull-left digits" style={{backgroundColor:"#ff1a1a"}}>
                              {"3"}
                            </span>
                          </p>
                          <br />
                          <span className="mt-0">{"Average"}</span>
                        </Media>
                      </Media>
                    </Col>
                    <Col>
                      <Media>
                        <Media body>
                          <p className="feebacks">
                            <span className="badge pull-left digits" style={{backgroundColor:"#b3ffb3"}}>
                              {"4"}
                            </span>
                          </p>
                          <br />
                          <span className="mt-0">{"Good"}</span>
                        </Media>
                      </Media>
                    </Col>
                    <Col>
                      <Media>
                        <Media body>
                          <p className="feebacks">
                            <span className="badge  pull-left digits" style={{backgroundColor:"#009900"}}>
                              {"5"}
                            </span>
                          </p>
                          <br />
                          <span className="mt-0">{"Very Good"}</span>
                        </Media>
                      </Media>
                    </Col>
                  </Row>
                
                <br /> <br />
                <Row>
                  <Col>
                    <hr />
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col>
                    <h6 style={{ textAlign: "center", fontWeight: "bold" }}>
                      {"Please do tell us where are we could have been better?"}
                    </h6>
                  </Col>
                </Row>
                <br/>
                <Row style={{textAlign:"center"}}>
                  <Col>
                  <Button
                  type="button"
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-secondary"
                >
                  <span
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    Quality of Resolution
                  </span>
                </Button>
                   
                  </Col>
                </Row>
                <br/>
                <Row style={{textAlign:"center"}}>
                  <Col>
                  <Button
                  type="button"
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-secondary"
                >
                  <span
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    &nbsp; &nbsp;&nbsp; Resolution Speed &nbsp;&nbsp; &nbsp; 
                  </span>
                </Button>
                    
                  </Col>
                </Row>
                <br/>
                <Row style={{textAlign:"center"}}>
                  <Col>
                  <Button
                  type="button"
                  style={{
                    whiteSpace: "nowrap",
                    marginRight: "15px",
                    fontSize: "medium",
                  }}
                  class="btn btn-secondary"
                >
                  <span
                    style={{
                      cursor: "pointer",
                      position: "relative",
                      top: "2px",
                    }}
                  >
                    Interaction with Agent
                  </span>
                </Button>
                  </Col>
                </Row>
                <br/>
                <Row>
                  <Col>
                  <p style={{ textAlign: "center"}}>We Appreciate your feedback. Please share any additional details that could help us improve.</p>
                  </Col>
                </Row>
                <br/>
                <Row>
                    <Col>
                      <FormGroup className="mb-0">
                        <Input type="textarea" className="form-control"  rows="3"/>
                      </FormGroup>
                    </Col>
                  </Row>
                  </Form>
              </CardBody>

              <CardFooter className=" text-center">
                <Button color="primary" className="m-r-15" type="submit">
                  {'Submit'}
                </Button>
               
              </CardFooter>
            </Card>
          </Col>
          <Col sm="12" xl="4 xl-100 box-col-12"></Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default FeedBack;
