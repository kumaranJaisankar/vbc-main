import React, { Fragment, useState, useRef, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  CardHeader,
  TabPane,
  TabContent,
  NavItem,
  NavLink,
  CardBody,
  Nav,
  Card,
} from "reactstrap";
import ImageUploader from "react-images-upload";

import axios from "axios";
import { toast } from "react-toastify";
// import { addNewProject } from "../../../../redux/project-app/action";
import { useDispatch } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { SimpleMaterialTab, UploadFile ,SelectMonth, SelectYear} from "../../../constant";

const ModeofPayment = () => {
  const [BasicLineTab, setBasicLineTab] = useState("1");
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Card>
          <br/>
             <Col sm="2">

                  <h6>Mode Of Payment</h6>
             </Col>
             

              <CardBody>
                <Nav className="border-tab" tabs>
                  <NavItem>
                    <NavLink
                      href="#javascript"
                      className={BasicLineTab === "1" ? "active" : ""}
                      onClick={() => setBasicLineTab("1")}
                    >
                      Cash
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#javascript"
                      className={BasicLineTab === "2" ? "active" : ""}
                      onClick={() => setBasicLineTab("2")}
                    >
                      Cheque
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#javascript"
                      className={BasicLineTab === "3" ? "active" : ""}
                      onClick={() => setBasicLineTab("3")}
                    >
                      UPI
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#javascript"
                      className={BasicLineTab === "4" ? "active" : ""}
                      onClick={() => setBasicLineTab("4")}
                    >
                      Card Details
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      href="#javascript"
                      className={BasicLineTab === "5" ? "active" : ""}
                      onClick={() => setBasicLineTab("5")}
                    >
                      Bank Transfer
                    </NavLink>
                  </NavItem>
                </Nav>

                <TabContent activeTab={BasicLineTab}>
                  <TabPane className="fade show" tabId="1">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Enter Amount
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Any change return
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Total amount
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12" style={{paddingLeft:"1px"}}>
                        {/* <FormGroup className="row"> */}
                        <Label className="col-sm-1 col-form-label">Upload Pic:</Label>
                        <br/>
                        <Col sm="3">
                          <Input className="form-control" type="file" style={{display:"block",paddingTop:"3px"}} />
                        </Col>
                      {/* </FormGroup> */}
                      </Col>
                    </Row>
                    <br/>
                    <Row>
                      <div className="col-1">
                        <Button color="primary" className="btn-block">
                          Pay
                        </Button>
                      </div>
                    </Row>
                  </TabPane>
                  <TabPane tabId="2">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Enter Cheque number
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="12" style={{paddingLeft:"1px"}}>
                        {/* <FormGroup className="row"> */}
                        <Label className="col-sm-1 col-form-label">Upload Pic:</Label>
                        <br/>
                        <Col sm="3">
                          <Input className="form-control" type="file" style={{display:"block",paddingTop:"3px"}} />
                        </Col>
                      {/* </FormGroup> */}
                      </Col>
                    </Row><br/>
                    {/* <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              cheque pic
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <div className="col-1">
                        <Button color="primary" className="btn-block">
                          Pay
                        </Button>
                      </div>
                    </Row>
                  
                  </TabPane>
                  <TabPane tabId="3">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Mobile Number
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Request Amount
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">Send</Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <div className="col-1">
                        <Button color="primary" className="btn-block">
                          Pay
                        </Button>
                      </div>
                    </Row>
                  </TabPane>
                  <TabPane tabId="4">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Enter card number
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Card Holders Name
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <div className="col-12">
                    <label className="col-form-label p-t-0">
                      ExpirationDate
                    </label>
                  </div>
                  <FormGroup className="col-3 p-r-0">
                    <select className="form-control" size="1">
                      {SelectMonth.map((months,i) => 
                       <option key={i}>{months}</option>
                      )}
                    </select>
                  </FormGroup>
                  <FormGroup className="col-3">
                    <select className="form-control" size="1">
                      {SelectYear.map((years,i) => 
                       <option key={i}>{years}</option>
                      )}
                    </select>
                  </FormGroup>
                    {/* <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">Exp date</Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <div className="col-1">
                        <Button color="primary" className="btn-block">
                          Pay
                        </Button>
                      </div>
                    </Row>
                  </TabPane>
                  <TabPane tabId="5">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              type="select"
                              name="status"
                              className="form-control digits"
                              onChange={(event) => {
                                //   handleInputChange(event);
                              }}
                              // onBlur={checkEmptyValue}
                            >
                              <option value=""></option>

                              <option value="OPEN">Axis Bank</option>
                              <option value="QL">HDFC Bank</option>
                            </Input>
                            <Label className="placeholder_styling">
                              {" "}
                              Bank Name
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Username
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Password
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Enter Amount
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Transfer to account
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <div className="input_wrap">
                            <Input
                              className="form-control"
                              type="text"
                              name="username"
                              // onChange={handleInputChange}
                              // onBlur={checkEmptyValue}
                            />
                            <Label className="placeholder_styling">
                              Confirm Transfer to account
                            </Label>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>



                    <Row>
                      <div className="col-1">
                        <Button color="primary" className="btn-block">
                          Pay
                        </Button>
                      </div>
                    </Row>
                  </TabPane>
                </TabContent>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default ModeofPayment;
