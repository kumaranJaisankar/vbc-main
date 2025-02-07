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
  Table,
} from "reactstrap";
import useFormValidation from "../../customhooks/FormValidation";

import axios from "axios";
import { default as axiosBaseURL } from "../../../axios";
import { adminaxios } from "../../../axios";
import { BasciInformation, Add, Cancel, InputSizing } from "../../../constant";
import { toast } from "react-toastify";

const Devicestatus = (props, initialValues) => {
  const [assign, setAssign] = useState();
  const [user, setUser] = useState();
  const [formData, setFormData] = useState({
    name: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const [filter, setFilter] = useState({
    first_name: "",
    // branch:"",
    // area:"",
    // leadsource: "",
  });

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
      name: "",
      email: "",
      mobile: "",
      landline: "",
      street: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

  //validdations

  const submit = (e) => {
    e.preventDefault();
    e = e.target.name;
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

  //validation
  const requiredFields = [];
  const { validate, Error } = useFormValidation(requiredFields);
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="date"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        From
                      </Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control not-empty"
                        type="date"
                        id="meeting-time"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label for="meeting-time" className="placeholder_styling">
                        To
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <Button
                    color="btn btn-primary"
                    type="submit"
                    className="mr-3"
                    onClick={resetInputField}
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col sm="4">
                  <button class="btn btn-primary">
                    <i
                      className="icon-share"
                      style={{
                        color: "white",
                        fontSize: "22px",
                        cursor: "pointer",
                      }}
                    ></i>
                    &nbsp;&nbsp;Export
                  </button>
                </Col>
              </Row>
              <br />
              <Row>
                <Col sm="12">
                  <p>
                    Note<span style={{ color: "red" }}>*</span>:From date should
                    always be less than to data
                  </p>
                </Col>
              </Row>
              <Row>
                <Table className="correact-lead-row-table">
                  <thead>
                    <td>Id</td>
                    <td>Platform</td>
                    <td>Os version</td>
                    <td>App version</td>
                    <td>Device Model</td>
                    <td>Network type</td>
                    <td>Battery percentage</td>
                    <td>Gps status</td>
                    <td>Network status</td>
                    <td>Captured on date time</td>
                  </thead>
                </Table>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};

export default Devicestatus;
