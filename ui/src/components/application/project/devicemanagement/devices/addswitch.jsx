import React, { Fragment, useState } from "react";
import { Container, Row, Col, FormGroup, Label, Input, Form ,Button} from "reactstrap";

const AddSwitch = (props) => {
  const [togglesnmpState, setTogglesnmpState] = useState("off");
  const [isShow, setIsShow] = React.useState(false);
  function togglesnmp() {
    setTogglesnmpState(togglesnmpState === "off" ? "on" : "off");
    setIsShow(!isShow);
  }

  const [toggleState, setToggleState] = useState("off");
  const [istelShow, setTelIsShow] = React.useState(false);
  function togglesnmp1() {
    setToggleState(toggleState === "off" ? "on" : "off");
    setTelIsShow(!istelShow);
  }
  const [togglesnmpState2, setTogglesnmpState2] = useState("on");
  function togglesnmp2() {
    setTogglesnmpState2(togglesnmpState2 === "off" ? "on" : "off");
  }

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="email-wrap bookmark-wrap">
          <Form className="theme-form mega-form">
            <Row>
              <h6 style={{ paddingLeft: "20px" }}> Basic Information</h6>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="type"
                      className="form-control digits"
                    >
                      <option value=""></option>
                      <option value="25">GOLI SAMBASIVA RAO</option>
                      <option value="50">KAKINADA</option>
                      <option value="70">SAI PRASAD</option>
                      <option value="100">VBC ON FIBER</option>
                    </Input>
                    <Label className="placeholder_styling">Franchise</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="type"
                      className="form-control digits"
                    >
                      <option value=""></option>
                      <option value="25">Branch1</option>
                      <option value="50">Branch2</option>
                      <option value="70">Branch3</option>
                      <option value="100">Branch4</option>
                    </Input>
                    <Label className="placeholder_styling">Branch</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="type"
                      className="form-control digits"
                    >
                      <option value=""></option>
                      <option value="25">Olt1</option>
                      <option value="50">Olt2</option>
                      <option value="70">Olt3</option>
                      <option value="100">Olt4</option>
                    </Input>
                    <Label className="placeholder_styling">OLT</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> Name </Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> IP Address </Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> MAC</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> Serial No</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> No Of Ports</Label>
                  </div>
                </FormGroup>
              </Col>

              <Col sm="4">
                <Label className="placeholder_styling">Status</Label>
                <FormGroup>
                  <div
                    className={`franchise-switch ${togglesnmpState2}`}
                    onClick={togglesnmp2}
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <h6 style={{ paddingLeft: "20px" }}> Location Information</h6>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling">Location</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> Latitude</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      className="form-control"
                      type="text"
                      name="first_name"
                      // value={inputs.first_name}
                      maxLength="15"
                    />
                    <Label className="placeholder_styling"> Longitude</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <h6 style={{ paddingLeft: "20px" }}> Device Information</h6>
            </Row>
            <Row>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="type"
                      className="form-control digits"
                    >
                      <option value=""></option>
                      <option value="25">Router</option>
                      <option value="50">CPE</option>
                      <option value="70">OLT</option>
                      <option value="100">ONU</option>
                    </Input>
                    <Label className="placeholder_styling">Device Type</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="4">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="select"
                      name="type"
                      className="form-control digits"
                    >
                      <option value=""></option>
                      <option value="25">Cisco</option>
                      <option value="50">Nokia</option>
                      <option value="70">Mikrotik</option>
                    </Input>
                    <Label className="placeholder_styling">Brand</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>

            <Row>
              <Col sm="4">
                <Label className="placeholder_styling"> SNMP</Label>
                <FormGroup>
                  <div
                    className={`franchise-switch ${togglesnmpState}`}
                    onClick={togglesnmp}
                  />
                </FormGroup>
              </Col>
            </Row>
            {isShow ? (
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> SNMP IP</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling">
                        {" "}
                        SNMP Community
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> SNMP Port</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            ) : (
              <div></div>
            )}

            <Row>
              <Col sm="4">
                <Label className="placeholder_styling"> Telnet</Label>
                <FormGroup>
                  <div
                    className={`franchise-switch ${toggleState}`}
                    onClick={togglesnmp1}
                  />
                </FormGroup>
              </Col>
            </Row>
            {istelShow ? (
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> Telnet IP</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> Username</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> Password</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="first_name"
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label className="placeholder_styling"> Port</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
            ) : (
              <div></div>
            )}

            <Row>
              <Col>
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="textarea"
                      className="form-control"
                      name="notes"
                      rows="3"
                    />
                    <Label className="placeholder_styling">Description</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col>
                <FormGroup className="mb-0">
                  <Button
                    color="btn btn-primary"
                    type="submit"
                    className="mr-3"
                  >
                    Add
                  </Button>
                  <Button type="reset" color="btn btn-primary" id="resetid">
                    Reset
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>
      </Container>
    </Fragment>
  );
};
export default AddSwitch;
