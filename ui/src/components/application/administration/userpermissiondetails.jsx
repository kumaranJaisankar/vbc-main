import React, {
  Fragment,
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
} from "react";
import Skeleton from "react-loading-skeleton";
// import Breadcrumb from "../../layout/breadcrumb";
import * as XLSX from "xlsx";
import {
  CardBody,
  Card,
  CardHeader,
  Row,
  Col,
  Table,
  Label,
  Input,
  Container,
  FormGroup,Button
} from "reactstrap";
import {
  Search,
  ModalTitle,
  CopyText,
  Cancel,
  Close,
  SaveChanges,
  VerticallyCentered,
} from "../../../constant";
import { Accordion } from "react-bootstrap";
import { isEmpty } from "lodash/isEmpty";

// 1stSwitch    2ndSwitch 3rdSwitch
// 1stSwitch  ON  [row1:true, row2:true,row3:true,row4:true];
// 	row1:onChange('1stSwitch  ','row1' )=> set1stSwitch([...1stSwitch  , !1stSwitch.row1]);
// 2ndSwitch    OFF [row1:false, row2:false,row3:false,row4:false];
// 	row1:onChange('2ndSwitch    ','row3' )=> set1stSwitch([...1stSwitch  , !1stSwitch.row1]);
// 3rdSwitch    [row1:true, row2:false,row3:true,row4:false];

const UserPermissionDetails = (props, initialValues) => {
  const [toggleState, setToggleState] = useState("off");
  const [secondtoggleState, setSecondToggleState] = useState("off");
  const [thirdtoggleState, setThirdToggleState] = useState("off");
  //accor2
  const [accor2toggleState, setaccor2ToggleState] = useState("off");
  const [accor2secondtoggleState, setaccor2SecondToggleState] = useState("off");
  const [accor2thirdtoggleState, setaccor2ThirdToggleState] = useState("off");
  //

  const [checked, setChecked] = useState(false);
  const [secondchecked, setSecondChecked] = useState(false);
  const [thirdchecked, setThirdChecked] = useState(false);
  //accor2
  const [accor2checked, setaccor2Checked] = useState(false);
  const [accor2secondchecked, setaccor2SecondChecked] = useState(false);
  const [accor2thirdchecked, setaccor2ThirdChecked] = useState(false);
  //
  const [firstSwitch, setFirstSwitch] = useState({
    add: false,
    edit: false,
    delete: false,
  });

  useEffect(() => {
    setFirstSwitch({ ...props.lead.status });

    if (props.lead.status) {
      let values = Object.values(props.lead.status);
      if (values.includes(true)) {
        if (values.every((v) => v === true)) {
          setToggleState("on");
        } else {
          setToggleState("on intermediate");
        }
      } else {
        setToggleState("off");
      }
    }
  }, [props.lead.status]);

  const [secondSwitch, setSecondSwitch] = useState({
    row1: false,
    row2: false,
    row3: false,
  });
  const [thirdSwitch, setThirdSwitch] = useState({
    row1: false,
    row2: false,
    row3: false,
  });

  //switches for accordion 2
  const [accor2firstSwitch, setaccor2FirstSwitch] = useState({
    accorrow1: false,
    accorrow2: false,
    accorrow3: false,
  });
  const [accor2secondSwitch, setaccor2SecondSwitch] = useState({
    accorrow1: false,
    accorrow2: false,
    accorrow3: false,
  });
  const [accor2thirdSwitch, setaccor2ThirdSwitch] = useState({
    accorrow1: false,
    accorrow2: false,
    accorrow3: false,
  });
  //
  function toggle(obj) {
    // setChecked(!checked);
    if (toggleState === "on") {
      setFirstSwitch({
        add: false,
        edit: false,
        delete: false,
      });
      props.checkboxHandler(
        {
          add: false,
          edit: false,
          delete: false,
        },

        props.lead
      );
    } else {
      setFirstSwitch({
        add: true,
        edit: true,
        delete: true,
      });
      props.checkboxHandler(
        {
          add: true,
          edit: true,
          delete: true,
        },

        props.lead
      );
    }

    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setToggleState("on");
        } else {
          setToggleState("on intermediate");
        }
      } else {
        setToggleState("off");
      }
    } else {
      setToggleState(toggleState === "off" ? "on" : "off");
    }
  }

  function secondtoggle(obj) {
    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setSecondToggleState("on");
        } else {
          setSecondToggleState("on intermediate");
        }
      } else {
        setSecondToggleState("off");
      }
    } else {
      setSecondToggleState(secondtoggleState === "off" ? "on" : "off");
    }
    if (secondtoggleState === "on") {
      setSecondSwitch({
        row1: false,
        row2: false,
        row3: false,
      });
    } else {
      setSecondSwitch({
        row1: true,
        row2: true,
        row3: true,
      });
    }
  }
  function thirdtoggle(obj) {
    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setThirdToggleState("on");
        } else {
          setThirdToggleState("on intermediate");
        }
      } else {
        setThirdToggleState("off");
      }
    } else {
      setThirdToggleState(thirdtoggleState === "off" ? "on" : "off");
    }
    if (thirdtoggleState === "on") {
      setThirdSwitch({
        row1: false,
        row2: false,
        row3: false,
      });
    } else {
      setThirdSwitch({
        row1: true,
        row2: true,
        row3: true,
      });
    }
  }

  const handleCheckbox = (par1, checkboxStatus) => {
    if (par1 === "firstSwitch") {
      toggle({
        ...firstSwitch,
        [checkboxStatus]: !firstSwitch[checkboxStatus],
      });
      setFirstSwitch({
        ...firstSwitch,
        [checkboxStatus]: !firstSwitch[checkboxStatus],
      });

      props.checkboxHandler(
        {
          ...firstSwitch,
          [checkboxStatus]: !firstSwitch[checkboxStatus],
        },
        props.lead
      );
    }
    if (par1 === "secondSwitch") {
      secondtoggle({
        ...secondSwitch,
        [checkboxStatus]: !secondSwitch[checkboxStatus],
      });

      setSecondSwitch({
        ...secondSwitch,
        [checkboxStatus]: !secondSwitch[checkboxStatus],
      });
    }
    if (par1 === "thirdSwitch") {
      thirdtoggle({
        ...thirdSwitch,
        [checkboxStatus]: !thirdSwitch[checkboxStatus],
      });
      setThirdSwitch({
        ...thirdSwitch,
        [checkboxStatus]: !thirdSwitch[checkboxStatus],
      });
    }
  };
  //accordion2
  function accor2toggle(obj) {
    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setaccor2ToggleState("on");
        } else {
          setaccor2ToggleState("on intermediate");
        }
      } else {
        setaccor2ToggleState("off");
      }
    } else {
      setaccor2ToggleState(accor2toggleState === "off" ? "on" : "off");
    }

    // setChecked(!checked);
    if (accor2toggleState === "on") {
      setaccor2FirstSwitch({
        accorrow1: false,
        accorrow2: false,
        accorrow3: false,
      });
    } else {
      setaccor2FirstSwitch({
        accorrow1: true,
        accorrow2: true,
        accorrow3: true,
      });
    }
  }

  function accor2secondtoggle(obj) {
    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setaccor2SecondToggleState("on");
        } else {
          setaccor2SecondToggleState("on intermediate");
        }
      } else {
        setaccor2SecondToggleState("off");
      }
    } else {
      setaccor2SecondToggleState(
        accor2secondtoggleState === "off" ? "on" : "off"
      );
    }
    if (accor2secondtoggleState === "on") {
      setaccor2SecondSwitch({
        accorrow1: false,
        accorrow2: false,
        accorrow3: false,
      });
    } else {
      setaccor2SecondSwitch({
        accorrow1: true,
        accorrow2: true,
        accorrow3: true,
      });
    }
  }

  function accor2thirdtoggle(obj) {
    if (!isEmpty(obj)) {
      let objValues = Object.values(obj);
      if (objValues.includes(true)) {
        if (objValues.every((value) => value === true)) {
          setaccor2ThirdToggleState("on");
        } else {
          setaccor2ThirdToggleState("on intermediate");
        }
      } else {
        setaccor2ThirdToggleState("off");
      }
    } else {
      setaccor2ThirdToggleState(thirdtoggleState === "off" ? "on" : "off");
    }
    if (thirdtoggleState === "on") {
      setaccor2ThirdSwitch({
        accorrow1: false,
        accorrow2: false,
        accorrow3: false,
      });
    } else {
      setaccor2ThirdSwitch({
        accorrow1: true,
        accorrow2: true,
        accorrow3: true,
      });
    }
  }

  const accor2handleCheckbox = (par2, checkboxStatus1) => {
    if (par2 === "accor2firstSwitch") {
      accor2toggle({
        ...accor2firstSwitch,
        [checkboxStatus1]: !accor2firstSwitch[checkboxStatus1],
      });
      setaccor2FirstSwitch({
        ...accor2firstSwitch,
        [checkboxStatus1]: !accor2firstSwitch[checkboxStatus1],
      });
    }
    if (par2 === "accor2secondSwitch") {
      accor2secondtoggle({
        ...accor2secondSwitch,
        [checkboxStatus1]: !accor2secondSwitch[checkboxStatus1],
      });

      setaccor2SecondSwitch({
        ...accor2secondSwitch,
        [checkboxStatus1]: !accor2secondSwitch[checkboxStatus1],
      });
    }
    if (par2 === "accor2thirdSwitch") {
      accor2thirdtoggle({
        ...accor2thirdSwitch,
        [checkboxStatus1]: !accor2thirdSwitch[checkboxStatus1],
      });
      setaccor2ThirdSwitch({
        ...accor2thirdSwitch,
        [checkboxStatus1]: !accor2thirdSwitch[checkboxStatus1],
      });
    }
  };

  return (
    <Fragment>
      <br />
      <Container fluid={true}>  
        <Row>
          <Col sm="4">
            <FormGroup>
              <div className="input_wrap">
                <Input
                  className="form-control"
                  type="text"
                  name="description"
                  // onChange={handleInputChange}
                  // onBlur={checkEmptyValue}
                />
                <Label className="placeholder_styling">User Name</Label>
              </div>
            </FormGroup>
          </Col>

          <Col sm="4">
            <FormGroup>
              <div className="input_wrap">
                <Input
                  type="select"
                  className="form-control digits"
                  // onChange={handleInputChange}
                  // onBlur={checkEmptyValue}

                  name="department"
                >
                  <option value="" style={{ display: "none" }}></option>

                  <option value="DAY">1day</option>
                  <option value="WEEK">1week</option>
                  <option value="MONTH">1month</option>
                  <option value="PICK">Pick a date</option>
                </Input>
                <Label className="placeholder_styling">Select department</Label>
              </div>
            </FormGroup>
          </Col>

          {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="datetime-local"
                        id="meeting-time"
                        name="follow_up"
                        maxLength="15"
                      />
                      <Label
                        for="meeting-time"
                        className="placeholder_styling"
                      ></Label>
                    </div>
                  </FormGroup>
                </Col> */}
        </Row>
        <Accordion defaultActiveKey="0" style={{ width: "67%" }}>
          <CardHeader id="checkboxes_cardheader">
            <Row>
              <Col sm="6" style={{ marginLeft: "-38px" }}>
                <h2 className="mb-0">
                  <Accordion.Toggle
                    as={Card.Header}
                    className="btn btn-link"
                    color="default"
                    eventKey="0"
                    style={{ fontSize: "18px", marginTop: "-11px" }}
                  >
                    Lead
                  </Accordion.Toggle>
                </h2>
              </Col>
              <Col sm="3">
                <div
                  className={`franchise-switch ${toggleState}`}
                  onClick={() => toggle(firstSwitch)}
                />
              </Col>
              {/* <Col sm="3">
                  <div
                    className={`franchise-switch ${secondtoggleState}`}
                    onClick={() => secondtoggle()}
                  />
                </Col>
                <Col sm="3">
                  <div
                    className={`franchise-switch ${thirdtoggleState}`}
                    onClick={() => thirdtoggle()}
                  />
                </Col> */}
            </Row>
          </CardHeader>
          <Accordion.Collapse eventKey="0">
            <>
              <div className="table-responsive">
                <Table>
                  <tbody>
                    <tr>
                      <td style={{ width: "25%" }}>Add</td>
                      <td style={{ width: "25%" }}>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="firstSwitchrow1"
                            type="checkbox"
                            // checked={checked}
                            checked={firstSwitch && firstSwitch.add}
                            onClick={() => handleCheckbox("firstSwitch", "add")}
                          />

                          <Label className="mt-0" for="firstSwitchrow1"></Label>
                        </div>
                      </td>
                      {/* <td style={{ width: "25%" }}>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="secondSwitchrow1"
                              type="checkbox"
                              checked={secondSwitch.row1}
                              onClick={() =>
                                handleCheckbox("secondSwitch", "row1")
                              }
                            />
                            <Label
                              className="mt-0"
                              for="secondSwitchrow1"
                            ></Label>
                          </div>
                        </td> */}
                      {/* <td>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="thirdSwitchrow1"
                              type="checkbox"
                              checked={thirdSwitch.row1}
                              onClick={() =>
                                handleCheckbox("thirdSwitch", "row1")
                              }
                            />
                            <Label className="mt-0" for="thirdSwitchrow1"></Label>
                          </div>
                        </td> */}
                    </tr>
                    <tr>
                      <td>Edit</td>
                      <td>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="firstSwitchrow2"
                            type="checkbox"
                            // checked={checked}
                            checked={firstSwitch && firstSwitch.edit}
                            onClick={() =>
                              handleCheckbox("firstSwitch", "edit")
                            }
                          />
                          <Label className="mt-0" for="firstSwitchrow2"></Label>
                        </div>
                      </td>
                      {/* <td>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="secondSwitchrow2"
                              type="checkbox"
                              checked={secondSwitch.row2}
                              onClick={() =>
                                handleCheckbox("secondSwitch", "row2")
                              }
                            />
                            <Label
                              className="mt-0"
                              for="secondSwitchrow2"
                            ></Label>
                          </div>
                        </td>
                        <td>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="thirdSwitchrow2"
                              type="checkbox"
                              checked={thirdSwitch.row2}
                              onClick={() =>
                                handleCheckbox("thirdSwitch", "row2")
                              }
                            />
                            <Label className="mt-0" for="thirdSwitchrow2"></Label>
                          </div>
                        </td> */}
                    </tr>
                    <tr>
                      <td>Delete</td>
                      <td>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="firstSwitchrow3"
                            type="checkbox"
                            // checked={checked}
                            checked={firstSwitch && firstSwitch.delete}
                            onClick={() =>
                              handleCheckbox("firstSwitch", "delete")
                            }
                          />
                          <Label className="mt-0" for="firstSwitchrow3"></Label>
                        </div>
                      </td>
                      {/* <td>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="secondSwitchrow3"
                              type="checkbox"
                              checked={secondSwitch.row3}
                              onClick={() =>
                                handleCheckbox("secondSwitch", "row3")
                              }
                            />
                            <Label
                              className="mt-0"
                              for="secondSwitchrow3"
                            ></Label>
                          </div>
                        </td>
                        <td>
                          <div className="checkbox checkbox-dark m-squar">
                            <Input
                              id="thirdSwitchrow3"
                              type="checkbox"
                              checked={thirdSwitch.row3}
                              onClick={() =>
                                handleCheckbox("thirdSwitch", "row3")
                              }
                            />
                            <Label className="mt-0" for="thirdSwitchrow3"></Label>
                          </div>
                        </td> */}
                    </tr>
                  </tbody>
                </Table>
              </div>
            </>
          </Accordion.Collapse>

          {/* accordion2 */}

          <CardHeader id="checkboxes_cardheader">
            <Row>
              <Col sm="6" style={{ marginLeft: "-38px" }}>
                <h5 className="mb-0">
                  <Accordion.Toggle
                    as={Card.Header}
                    className="btn btn-link"
                    color="default"
                    eventKey="1"
                    style={{ fontSize: "18px", marginTop: "-11px" }}
                  >
                    Franchise
                  </Accordion.Toggle>
                </h5>
              </Col>
              {/* <Col sm="3">
                  <div
                    className={`franchise-switch ${accor2toggleState}`}
                    onClick={() => accor2toggle()}
                  />
                </Col> */}
              <Col sm="3">
                <div
                  className={`franchise-switch ${accor2secondtoggleState}`}
                  onClick={() => accor2secondtoggle()}
                />
              </Col>
              {/* <Col sm="3">
                  <div
                    className={`franchise-switch ${accor2thirdtoggleState}`}
                    onClick={() => accor2thirdtoggle()}
                  />
                </Col> */}
            </Row>
          </CardHeader>

          <Accordion.Collapse eventKey="1">
            <div className="table-responsive">
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: "26%" }}>Add</td>
                    {/* <td style={{ width: "25%" }}>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="accor2firstSwitchrow1"
                            type="checkbox"
                            checked={accor2firstSwitch.accorrow1}
                            onClick={() =>
                              accor2handleCheckbox(
                                "accor2firstSwitch",
                                "accorrow1"
                              )
                            }
                          />
  
                          <Label
                            className="mt-0"
                            for="accor2firstSwitchrow1"
                          ></Label>
                        </div>
                      </td> */}

                    <td style={{ width: "25%" }}>
                      <div className="checkbox checkbox-dark m-squar">
                        <Input
                          id="accor2secondSwitchrow1"
                          type="checkbox"
                          checked={accor2secondSwitch.accorrow1}
                          onClick={() =>
                            accor2handleCheckbox(
                              "accor2secondSwitch",
                              "accorrow1"
                            )
                          }
                        />
                        <Label
                          className="mt-0"
                          for="accor2secondSwitchrow1"
                        ></Label>
                      </div>
                    </td>
                    {/* <td>
                            <div className="checkbox checkbox-dark m-squar">
                              <Input
                                id="accor2thirdSwitchrow1"
                                type="checkbox"
                                checked={accor2thirdSwitch.accorrow1}
                                onClick={() =>
                                  accor2handleCheckbox("accor2thirdSwitch", "accorrow1")
                                }
                              />
                              <Label className="mt-0" for="accor2thirdSwitchrow1"></Label>
                            </div>
                          </td> */}
                  </tr>
                  <tr>
                    <td>Edit</td>
                    {/* <td>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="accor2firstSwitchrow2"
                            type="checkbox"
                            // checked={checked}
                            checked={accor2firstSwitch.accorrow2}
                            onClick={() =>
                              accor2handleCheckbox(
                                "accor2firstSwitch",
                                "accorrow2"
                              )
                            }
                          />
                          <Label
                            className="mt-0"
                            for="accor2firstSwitchrow2"
                          ></Label>
                        </div>
                      </td> */}
                    <td>
                      <div className="checkbox checkbox-dark m-squar">
                        <Input
                          id="accor2secondSwitchrow2"
                          type="checkbox"
                          checked={accor2secondSwitch.accorrow2}
                          onClick={() =>
                            accor2handleCheckbox(
                              "accor2secondSwitch",
                              "accorrow2"
                            )
                          }
                        />
                        <Label
                          className="mt-0"
                          for="accor2secondSwitchrow2"
                        ></Label>
                      </div>
                    </td>
                    {/* <td>
                            <div className="checkbox checkbox-dark m-squar">
                              <Input
                                id="accor2thirdSwitchrow2"
                                type="checkbox"
                                checked={accor2thirdSwitch.accorrow2}
                                onClick={() =>
                                  accor2handleCheckbox("accor2thirdSwitch", "accorrow2")
                                }
                              />
                              <Label className="mt-0" for="accor2thirdSwitchrow2"></Label>
                            </div>
                          </td> */}
                  </tr>
                  <tr>
                    <td>Delete</td>
                    {/* <td>
                        <div className="checkbox checkbox-dark m-squar">
                          <Input
                            id="accor2firstSwitchrow3"
                            type="checkbox"
                            // checked={checked}
                            checked={accor2firstSwitch.accorrow3}
                            onClick={() =>
                              accor2handleCheckbox(
                                "accor2firstSwitch",
                                "accorrow3"
                              )
                            }
                          />
                          <Label
                            className="mt-0"
                            for="accor2firstSwitchrow3"
                          ></Label>
                        </div>
                      </td> */}
                    <td>
                      <div className="checkbox checkbox-dark m-squar">
                        <Input
                          id="accor2secondSwitchrow3"
                          type="checkbox"
                          checked={accor2secondSwitch.accorrow3}
                          onClick={() =>
                            accor2handleCheckbox(
                              "accor2secondSwitch",
                              "accorrow3"
                            )
                          }
                        />
                        <Label
                          className="mt-0"
                          for="accor2secondSwitchrow3"
                        ></Label>
                      </div>
                    </td>
                    {/* <td>
                            <div className="checkbox checkbox-dark m-squar">
                              <Input
                                id="accor2thirdSwitchrow3"
                                type="checkbox"
                                checked={accor2thirdSwitch.accorrow3}
                                onClick={() =>
                                  accor2handleCheckbox("accor2thirdSwitch", "accorrow3")
                                }
                              />
                              <Label className="mt-0" for="accor2thirdSwitchrow3"></Label>
                            </div>
                          </td> */}
                  </tr>
                </tbody>
              </Table>
            </div>
          </Accordion.Collapse>

          {/* end of accordion */}
        </Accordion>
        <br/>
        <br/>
        <Row style={{paddingLeft:"20px"}}>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      // onClick={resetInputField}
                    >
                      Add
                    </Button>
                    <Button type="reset" color="btn btn-primary">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
      </Container>
    </Fragment>
  );
};

export default UserPermissionDetails;
