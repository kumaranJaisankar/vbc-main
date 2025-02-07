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
import {
  MyProfile,
  Bio,
  MarkJecno,
  Designer,
  Password,
  Website,
  Save,
  EditProfile,
  Company,
  Username,
  UsersCountryMenu,
  AboutMe,
  UpdateProfile,
  UsersTableTitle,
  FirstName,
  LastName,
  Address,
  EmailAddress,
  PostalCode,
  Country,
  UsersTableHeader,
  City,
  Edit,
  Update,
  Delete,
  Search,
} from "../../../constant";

import { Upload, PlusSquare, HelpCircle } from "react-feather";
import DatePicker from "react-datepicker";
const RenewalReport = (props, initialValues) => {
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
                    <Col sm="2">
                      <FormGroup>
                        <Label className="form-label">Invoice Status</Label>
                        <Input type="select" name="status">
                          <option selected>All</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <FormGroup>
                        <Label>Invoice Type</Label>
                        <Input
                          type="select"
                          name="franchise"
                          className="form-control digits"
                        >
                          <option selected>All</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <FormGroup>
                        <Label>State</Label>
                        <Input
                          type="select"
                          name="franchise"
                          className="form-control digits"
                        >
                          <option selected>Select state</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>

                    <Col sm="2">
                      <FormGroup>
                        <Label>Select Franchise</Label>
                        <Input
                          type="select"
                          name="franchise"
                          className="form-control digits"
                        >
                          <option selected>All</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <FormGroup>
                        <Label> Package</Label>
                        <Input
                          type="select"
                          name="branch"
                          className="form-control digits"
                        >
                          <option selected>Select package</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <FormGroup>
                        <Label> Sub Package</Label>
                        <Input
                          type="select"
                          name="area"
                          placeholder="Select Status"
                          className="form-control digits"
                        >
                          <option selected>Select subpackage</option>
                          <option value="25">VALUES1</option>
                          <option value="50">VALUES2</option>
                          <option value="70">VALUES3</option>
                          <option value="100">VALUES4</option>
                        </Input>
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="2">
                      <FormGroup>
                        <Label>Invoice number </Label>
                        <Input
                          className="form-control"
                          type="tel"
                          name="filtermobilenumber"
                          onChange={handleSearchform}
                          value={inputs.filtermobilenumber}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "43%",
                            left: "80%",
                          }}
                        >
                          {errors.filtermobilenumber}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                    <FormGroup>
                        <Label className="form-label">A/C NO</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <FormGroup>
                        <Label className="form-label">Username</Label>
                        <Input
                          className="form-control"
                          type="text"
                          name="filteremail"
                          onChange={handleSearchform}
                        />
                        <div
                          style={{
                            position: "absolute",
                            top: "43%",
                            left: "80%",
                          }}
                        >
                          {errors.filteremail}
                        </div>
                      </FormGroup>
                    </Col>
                    <Col sm="2">
                      <label>Invoice Date From</label>
                      <DatePicker
                        className="form-control digits"
                        selected={startDate}
                        onChange={handleChange}
                        placeholderText="Select Date"
                      />
                    </Col>
                    <Col sm="2">
                      <label>Invoice Date To</label>
                      <DatePicker
                        className="form-control digits"
                        selected={endDate}
                        onChange={setEndDate}
                        placeholderText="Select date "
                      />
                    </Col>
                
                  </Row>
                
                  <div className="text-right">
                    <button className="btn btn-primary" type="submit">
                      Search
                    </button>
                  </div>
                </CardBody>
                {/* </Card> */}
              </Form>
            </Col>
          </Row>
        </div>
      </Container>
    </Fragment>
  );
};

export default RenewalReport;
