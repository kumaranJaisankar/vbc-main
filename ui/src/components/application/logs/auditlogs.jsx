import React, { Fragment, useEffect, useState } from "react";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  CardHeader,
  CardBody,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";
import axios from "axios";
import {
  Search,
} from "../../../constant";

import DatePicker from "react-datepicker";
const AuditLogs = ( initialValues) => {
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
                      <FormGroup>
                        <Label>Audit Type</Label>
                        <Input
                          type="select"
                          name="area"
                          placeholder="Select Status"
                          className="form-control digits"
                        >
                          <option selected>Select Type</option>
                          <option value="25">Administration</option>
                          <option value="25">Franchaise Management</option>
                          <option value="25">Radius Cpanel</option>
                          <option value="25">User</option>
                          <option value="25">Complaints</option>
                          <option value="25">Leads</option>
                          <option value="25">Inventory</option>
                          <option value="25">Network Management</option>
                          <option value="25">Tools</option>
                          <option value="25">Tickets</option>
                          <option value="25">With Management</option>
                          <option value="25">Business Analytics</option>
                        </Input>
                      </FormGroup>
                    </Col>
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
                        <Label className="form-label">Search Key</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Ipaddress</Label>
                        <Input className="form-control" type="text" />
                      </FormGroup>
                    </Col>
                    <Col sm="3">
                      <FormGroup>
                        <Label className="form-label">Performed By</Label>
                        <Input type="select" name="status">
                          <option selected>All Users</option>
                          <option value="25">LB Nagar</option>
                          <option value="50">ECIL</option>
                        </Input>
                      </FormGroup>
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

export default AuditLogs;
