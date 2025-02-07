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
import { campaignaxios, franchiseaxios, servicesaxios } from "../../../axios";

import { default as axiosBaseURL } from "../../../axios";
import { adminaxios } from "../../../axios";
import { BasciInformation, Add, Cancel, InputSizing } from "../../../constant";
import { toast } from "react-toastify";
import {  statusType,billingMode ,billingType} from "./emaildropdowns";


const EmailFields = (props, initialValues) => {
  //setting state for package
  const [service, setService] = useState([]);
  //set branch
  const [branch,setBranch] = useState([]);
  //set franchise
  const [franchise,setFranchise] = useState([]);

  const [assign, setAssign] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    franchise: "",
    branch: "",
    username: "",
    name: "",
    // mobile_number: "",
    account_status: "",
    template_id:"",
    // nas: "",
    // olt: "",
    // dp: "",
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
      // mobile_number: "",
      account_status: "",
      template_id:"",
      // nas: "",
      // olt: "",
      // dp: "",
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
    //onclick of submit submit data
    campaignaxios
      .post("search/users", formData, config)
      .then((response) => {
        console.log(response.data);
        // props.onUpdate(response.data);
        props.setUserlist(response.data);
        resetformmanually();
        toast.success("Successfully searched", {
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

  //ui field on blue event
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
  //package field from api
  useEffect(() => {
    console.log(formData);
    servicesaxios
      .get(`/plans/create`)
      .then((res) => {
        console.log(res);
        // let { branch_name } = res.data;
        setService([...res.data]);
      })
      .catch((error) => console.log(error));
  }, []);
  //end
  //branch apis
  useEffect(() => {
    console.log(formData);
    adminaxios
      .get(`/accounts/options/all`)
      .then((res) => {
        console.log(res);
       
        setBranch([...res.data.branches]);
      })
      .catch((error) => console.log(error));
  }, []);
  //end
  //franchise axios
  useEffect(() => {
    console.log(formData);
    franchiseaxios
      .get(`/franchise/display`)
      .then((res) => {
        console.log(res);
       
        setFranchise([...res.data]);
      })
      .catch((error) => console.log(error));
  }, [])
  //end
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
                        name="franchise"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {franchise.map((franchise) => (
                          <option
                            key={franchise.id}
                            value={franchise.id}
                          >
                            {franchise.franchise_name}
                          </option>
                        ))}
                      </Input>
                      
                      <Label className="placeholder_styling" style={{whiteSpace:"nowrap"}}>
                        Franchise
                      </Label>
                    </div>
                          
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="branch"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option style={{ display: "none" }}></option>

                        {branch.map((branchess) => (
                          <option
                            key={branchess.id}
                            value={branchess.name}
                          >
                            {branchess.name}
                          </option>
                        ))}
                      </Input>
                      
                      <Label className="placeholder_styling" style={{whiteSpace:"nowrap"}}>
                        Branch
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
                        name="username"
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
                        name="name"
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
                        name="template_id"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Template Id</Label>
                    </div>

                   
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="account_status"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {statusType.map((status) => {
                          return (
                            <option value={status.id}>{status.name}</option>
                          );
                        })}
                      </Input>
                      <Label className="placeholder_styling">Status</Label>
                    </div>
                  
                  </FormGroup>
                </Col>
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
              </Row> */}
              <Row>
                <Col sm="4">
                  {/* <Label className="placeholder_styling">Expiry To</Label> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="expiry_from"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        maxLength="15"
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        Expiry From
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
               
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="billing_type"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {billingType.map((mode) => {
                          return (
                            <option value={mode.id}>{mode.name}</option>
                          );
                        })}
                      </Input>
                      <Label className="placeholder_styling">Billing Type</Label>
                    </div>
                  
                  </FormGroup>
                </Col>

               
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="payment_mode"
                        className="form-control digits"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>

                        {billingMode.map((mode) => {
                          return (
                            <option value={mode.id}>{mode.name}</option>
                          );
                        })}
                      </Input>
                      <Label className="placeholder_styling">Billing Mode</Label>
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
                          name="package"
                          className="form-control digits"
                          // onChange={handleInputChange}
                          onChange={(event) => {
                            handleInputChange(event);
                          
                          }}
                          onBlur={checkEmptyValue}
                          value={formData && formData.package}
                        >
                          <option style={{ display: "none" }}></option>

                          {service.map((typesplan) => (
                            <option key={typesplan.id} value={typesplan.id}>
                              {typesplan.package_name}
                            </option>
                          ))}
                        </Input>
                        <Label
                          className="placeholder_styling"
                          style={{ whiteSpace: "nowrap" }}
                        >
                          Plan *
                        </Label>
                      </div>
                      <span className="errortext">
                        {errors.service_plan && "Select service plan"}
                      </span>
                    </FormGroup>
                  </Col>
                <Col sm="4">
                  {/* <Label className="placeholder_styling">Expiry To</Label> */}
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control digits not-empty"
                        type="datetime-local"
                        id="meeting-time"
                        name="expiry_to"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
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

export default EmailFields;
