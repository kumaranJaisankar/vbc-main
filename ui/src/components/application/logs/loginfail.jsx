import React, { Fragment, useEffect, useState } from "react";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Media,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";
import { Search, loginfail } from "../../../constant";

import { Upload, PlusSquare, HelpCircle } from "react-feather";
import DatePicker from "react-datepicker";
const LoginFail = (props, initialValues) => {
  const [data, setData] = useState([]);
  const [startDate, setstartDate] = useState(new Date());
  const [endDate, setendDate] = useState(new Date());
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/api/user-edit-table.json`)
      .then((res) => setData(res.data));
  }, []);

  const handleChange = (date) => {
    setstartDate(date);
  };
  const addDays = (date) => {
    setstartDate(date, 4);
  };

  const setEndDate = (date) => {
    setendDate(date);
  };

  const handleSearchform = (e) => {
    e.persist();
    setInputs((inputs) => ({ ...inputs, [e.target.name]: e.target.value }));
  };

  const validate = (inputs) => {
    const errors = {};
    //mobilenumber error
    if (inputs.filtermobilenumber) {
      var pattern = new RegExp(/^[6789]\d{9}$/);
      if (
        !pattern.test(inputs.filtermobilenumber) ||
        inputs.filtermobilenumber.length != 10
      ) {
        // errors.onlynumber='Please enter only number';
        errors.filtermobilenumber = (
          <i
            style={{ color: "#FB6059", fontSize: "23px" }}
            className="icofont icofont-exclamation-circle"
          ></i>
        );
      }
    }
    //email
    if (inputs.filteremail) {
      var pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );
      if (!pattern.test(inputs.filteremail)) {
        // errors.validemail = 'Please enter valid email';
        errors.filteremail = (
          <i
            style={{ color: "#FB6059", fontSize: "23px" }}
            className="icofont icofont-exclamation-circle"
          ></i>
        );
      }
    }
    return errors;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate(inputs);
    const noErrors = Object.keys(validationErrors).length === 0;
    setErrors(validationErrors);
    if (noErrors) {
      console.log(inputs);
    } else {
      console.log("errors try again", validationErrors);
    }
  };

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <div className="edit-profile">
          <Row>
            <Col sm="12">
              <Form className="card" onSubmit={handleSubmit}>
                <CardHeader>
                  <Col sm="12">
                    <input
                      className="form-control"
                      type="text"
                      placeholder="Search.."
                    />
                    <Search className="search-icon" />
                  </Col>
                </CardHeader>

                <CardBody>
                  <Row>
                    <Col sm="3">
                      <label>Start Date</label>
                      <DatePicker
                        className="form-control digits"
                        selected={startDate}
                        onChange={handleChange}
                        placeholderText="Select Date"
                      />
                    </Col>
                    <Col sm="3">
                      <label>End Date</label>
                      <DatePicker
                        className="form-control digits"
                        selected={endDate}
                        onChange={setEndDate}
                        placeholderText="Select date "
                      />
                    </Col>

                    <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Username</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Ip Address</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                  <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Notes</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                  </Row>
                </CardBody>
                {/* </Card> */}
              </Form>
            </Col>

            <Col md="12" className="project-list">
              <Card>
                <Row>
                  <Col sm="4">
                    <FormGroup className="row">
                      <Label className="col-form-label">Show</Label>
                      <Col sm="3">
                        <Input type="select" name="status">
                          <option selected>All</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </Col>
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup className="row">
                      <Label className="col-sm-3 col-form-label">
                        Total Results Found : 0
                      </Label>
                    </FormGroup>
                  </Col>
                </Row>
              </Card>
            </Col>

            <Col md="12">
              <Card>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead>
                      <tr>
                        {loginfail.map((items, i) => (
                          <th key={i}>{items}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((items, i) => (
                        <tr>
                          <td>1</td>
                          <td>admin</td>
                          <td>157.48.180.126</td>
                          <td>2021-06-12 17:18:36</td>
                          <td>Session duplication detected user forcelogout done by system!!</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default LoginFail;
