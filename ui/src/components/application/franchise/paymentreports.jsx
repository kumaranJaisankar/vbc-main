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
  FranchiseHeader,payment
} from "../../../constant";

import { Upload, PlusSquare, HelpCircle, MessageSquare } from "react-feather";
import DatePicker from "react-datepicker";

const PaymentReport = (props, initialValues) => {
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
              <Card>
                <Form onSubmit={handleSubmit}>
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
                          <Label>Reseller</Label>
                          <Input
                            type="select"
                            name="franchise"
                            className="form-control digits"
                          >
                            <option selected>All Resllers</option>
                            <option value="25">VALUES1</option>
                            <option value="50">VALUES2</option>
                            <option value="70">VALUES3</option>
                            <option value="100">VALUES4</option>
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
                </Form>
              </Card>
            </Col>
            <Col sm="12">
              <Card>
                <Form onSubmit={handleSubmit}>
                  <CardHeader>
                    <Col sm="12">
                      <h6>Total Summary</h6>
                    </Col>
                  </CardHeader>

                  <CardBody>
                    <Card>
                      <Row>
                        <Col sm="12">
                          <div className="navigation-btn">
                            
                            <div className="header-top"style={{padding:"20px",backgroundColor:"#7366FF",color:"white"}} >
                    <h6 className="m-0">Total Payments</h6>
                    
                  </div>
                  <div className="header-top"style={{padding:"20px"}} >
                    <h6 className="m-0">0 rs</h6>
                    
                  </div>
                           
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </CardBody>
                </Form>
              </Card>
            </Col>
            <Row>
              <Col
                sm="12"
                style={{ paddingBottom: "20px", paddingLeft: "34px" }}
              ></Col>
            </Row>
            <Col md="12">
              <Card>
                <div className="table-responsive">
                  <table className="table card-table table-vcenter text-nowrap">
                    <thead>
                      <tr>
                        {payment.map((items, i) => (
                          <th key={i}>{items}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((items, i) => (
                        <tr key={i}>
                          <td>789</td>
                          <td>names</td>
                          <td>
                            <span className="status-icon bg-success"></span>
                            {items.status}
                          </td>
                          <td>{items.date}</td>

                          <td>Franchise Role</td>
                          
                          <td>
                           
                          </td>
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

export default PaymentReport;
