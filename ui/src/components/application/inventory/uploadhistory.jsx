import React, { Fragment, useEffect, useState } from "react";
// import Breadcrumb from "../../layout/breadcrumb";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Button,
} from "reactstrap";
import axios from "axios";

import { Search, uploadhistory } from "../../../constant";

const UploadHistory = (props, initialValues) => {
  const [upImg, setUpImg] = useState();
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

  const onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setUpImg(reader.result));
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  return (
    <Fragment>
      <br />
     
      <Container fluid={true}>
      <div className="text-left">
        <button className="btn btn-primary" type="submit">
          Add Stock
        </button>
      </div>
      <br/>
        <div className="edit-profile">
          <Row>
            <Col sm="12">
              <Form className="card" onSubmit={handleSubmit}>
                <CardBody>
                  <Row>
                    <Col sm="12" xl="12">
                      <Row>
                        <Col sm="3">
                          <Form className="theme-form">
                            <FormGroup className="form-row">
                              <label className="col-sm-3 col-form-label text-left">
                                Show
                              </label>
                              <div className="col-xl-4 col-sm-9">
                                <div className="input-group">
                                  <Input type="select" name="status">
                                    <option selected>All</option>
                                    <option value="25">Low</option>
                                    <option value="25">Medium</option>

                                    <option value="25">High</option>
                                  </Input>
                                </div>
                              </div>
                            </FormGroup>
                          </Form>
                        </Col>
                        <Col sm="5">
                          <div className="text-left">
                            <Button outline color="light-2x txt-dark">
                              Print
                            </Button>
                          </div>
                        </Col>

                        <Col sm="4">
                          <div className="text-right">
                            <input
                              className="form-control"
                              type="text"
                              placeholder="Search.."
                            />
                            <Search className="search-icon" />
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <br />
                </CardBody>
              </Form>
            </Col>

            <Col md="12">
              <Card>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead>
                      <tr>
                        {uploadhistory.map((items, i) => (
                          <th key={i}>{items}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <p style={{ padding: "20px" }}>
                        No data available in table
                      </p>
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

export default UploadHistory;
