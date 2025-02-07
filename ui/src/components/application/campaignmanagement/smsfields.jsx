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
} from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";
import ImageUploader from "react-images-upload";

import axios from "axios";
import { campaignaxios } from "../../../axios";
import { adminaxios } from "../../../axios";
import { BasciInformation, Add, Cancel, InputSizing } from "../../../constant";
import { toast } from "react-toastify";

const SmsFields = (props, initialValues) => {
  const [assign, setAssign] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    franchise: "",
    branch: "",
    username: "",
    name: "",
    mobile_number: "",
    account_status: "",
    nas: "",
    olt: "",
    dp: "",
    expiry_from: "",
    billing_type: "",
    payment_mode: "",
    package: "",
    expiry_to: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    event.persist();
    setInputs((inputs) => ({
      ...inputs,
      [event.target.name]: event.target.value,
    }));

    const target = event.target;
    var value = target.value;
    const name = target.name;

    setFormData((preState) => ({
      ...preState,
      [name]: value,
    }));
  };

  const resetformmanually = () => {
    setFormData({
      franchise: "",
      branch: "",
      username: "",
      name: "",
      mobile_number: "",
      account_status: "",
      nas: "",
      olt: "",
      dp: "",
      expiry_from: "",
      billing_type: "",
      payment_mode: "",
      package: "",
      expiry_to: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  const smssearch = (e) => {
    console.log(formData);
  };

  //validdations
  //close

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    //
    campaignaxios
      .post("search/users", formData, config)
      .then((response) => {
        console.log(response.data);
       // props.onUpdate(response.data);
        props.setUserlist(response.data);
        resetformmanually();
        toast.success("Successfully searched  ", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
      })
      .catch(function (error) {
        if (error.response && error.response.data) {
          setErrors(error.response.data);
        }
        toast.error("Something went wrong", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose:1000
        });
        console.error("Something went wrong!", error);
      });
    // console.log(formData);
    // const validationErrors = validate(formData);
    // const noErrors = Object.keys(validationErrors).length === 0;
    // setErrors(validationErrors);
    // if (noErrors) {
    //   console.log(formData);
    //   smssearch();
    // } else {
    //   console.log("errors try again", validationErrors);
    // }
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

  const resetInputField = () => {};
  const resetForm = function () {
    setInputs((inputs) => {
      var obj = {};
      for (var name in inputs) {
        obj[name] = "";
      }
      return obj;
    });
    setErrors({});
  };

  const form = useRef(null);

  //validation for fields
  const requiredFields = ["landmark"];
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Goli SambaShivaRao</option>
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
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Malakpet</option>
                      </Input>
                      <Label className="placeholder_styling">Branch</Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="email"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Username</Label>
                    </div>
                  </FormGroup>
                </Col>

                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="email"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">A/C No.</Label>
                    </div>
                  </FormGroup>
                </Col> */}
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="email"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Name</Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="mobile"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Mobile No.</Label>
                    </div>

                    <span className="errortext">{errors.mobile}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Pending</option>
                        <option value="">Active</option>
                        <option value="">Expired</option>
                        <option value="">Pending</option>
                        <option value="">Inactive</option>
                        <option value="">Onhold</option>
                        <option value="">Invoice Not paid users</option>
                        <option value="">Invoice Not and Suspended</option>
                      </Input>
                      <Label className="placeholder_styling">Status</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Nas</option>
                      </Input>
                      <Label className="placeholder_styling">Nas</Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">olt</option>
                      </Input>
                      <Label className="placeholder_styling">Olt</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">dp</option>
                      </Input>
                      <Label className="placeholder_styling">Dp</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="response_time"
                        // name="assigned_date"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // value={inputs.first_name}
                        maxLength="15"
                      />

                      <Label className="placeholder_styling">Expiry From</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">All</option>
                      </Input>
                      <Label className="placeholder_styling">
                        Billing Type
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Mode</option>
                      </Input>
                      <Label className="placeholder_styling">
                        Billing Mode
                      </Label>
                    </div>
                  </FormGroup>
                </Col>

                {/* <Col sm="4">
                 
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="response_time"
                        // name="assigned_date"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Last Stream From
                      </Label>
                    </div>
                  </FormGroup>
                </Col> */}
              </Row>
              {/* <Row>
               
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Sr nagar</option>
                      </Input>
                      <Label className="placeholder_styling">Area</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row> */}
              <Row>
                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">India</option>
                      </Input>
                      <Label className="placeholder_styling">Country</Label>
                    </div>
                  </FormGroup>
                </Col> */}
                {/* <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Building</option>
                      </Input>
                      <Label className="placeholder_styling">Building</Label>
                    </div>
                  </FormGroup>
                </Col> */}
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="assign"
                        className="form-control digits"
                        onChange={(event) => {
                          handleInputChange(event);
                          setAssign(event.target.value);
                        }}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="">Package</option>
                      </Input>
                      <Label className="placeholder_styling">Package</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  {/* <Label className="placeholder_styling">Expiry To</Label> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="response_time"
                        // name="assigned_date"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Expiry To
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                {/* <Col sm="4" style={{ paddingTop: "6%" }}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="mobile"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Static IP</Label>
                    </div>
                  </FormGroup>
                </Col> */}
                {/* <Col sm="4" style={{ paddingTop: "6%" }}>
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="mobile"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">MAC</Label>
                    </div>

                    <span className="errortext">{errors.mobile}</span>
                  </FormGroup>
                </Col> */}
              </Row>
              {/* <Row>
                <Col sm="4">
                  
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="response_time"
                        // name="assigned_date"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        // value={inputs.first_name}
                        maxLength="15"
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Last Stream To
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row> */}
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                    >
                      Search
                    </Button>
                    <Button type="reset" color="btn btn-primary" id="resetid">
                      Reset
                    </Button>
                  </FormGroup>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default SmsFields;
