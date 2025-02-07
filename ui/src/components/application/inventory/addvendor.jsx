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
} from "reactstrap";
import { franchiseaxios } from "../../../axios";
import { toast } from "react-toastify";
import { Add } from "../../../constant";

const AddVendor = (props, initialValues) => {
  const [formData, setFormData] = useState({});
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

    if (target.type === "checkbox") {
      if (target.checked) {
        formData.hobbies[value] = value;
      } else {
        formData.hobbies.splice(value, 1);
      }
    } else {
      setFormData((preState) => ({
        ...preState,
        [name]: value,
      }));
    }
  };

  const submit = (e) => {
    e.preventDefault();
    console.log(formData);
    var config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    franchiseaxios
      .post("franchise/role/create", formData, config)
      .then((response) => {
        console.log(response.data);
        props.onUpdate(response.data);
        toast.success("Role was added successfully", {
          position: toast.POSITION.TOP_RIGHT,
        });
        resetformmanually();
      })
      .catch(function (error) {
        console.error("Something went wrong!", error);
        // this.setState({ errorMessage: error });
      });
  };

  // validationErrors

  const resetformmanually = () => {
    setFormData({
      name: "",
    });
    document.getElementById("resetid").click();
  };
  useEffect(() => {
    if (!props.rightSidebar) {
      resetformmanually();
      setErrors({});
    }
  }, [props.rightSidebar]);

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

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <div style={{ backgroundColor: "#f8f8f8", padding: "10px" }}>
                <br />
                <Row>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="assigned_to"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}> </option>
                          <option value="">Item1</option>
                          <option value="">Item2</option>
                          <option value="">Item3</option>
                        </Input>
                        <Label className="placeholder_styling">Item Name</Label>
                      </div>
                    </FormGroup>
                  </Col>

                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="assigned_to"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}> </option>
                          <option value="">Category1</option>
                          <option value="">Category2</option>
                          <option value="">Category3</option>
                        </Input>
                        <Label className="placeholder_styling">
                          Item Category
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="assigned_to"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}> </option>
                          <option value="">Vendor1</option>
                          <option value="">Vendor2</option>
                          <option value="">Vendor3</option>
                        </Input>
                        <Label className="placeholder_styling">Vendor</Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>

                <br />
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
                        <Label className="placeholder_styling">Make</Label>
                      </div>
                    </FormGroup>
                  </Col>
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
                        <Label className="placeholder_styling">MAC</Label>
                      </div>
                    </FormGroup>
                  </Col>
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
                        <Label className="placeholder_styling">Quantity</Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="assigned_to"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}> </option>
                          <option value="">New</option>
                          <option value="">Republished</option>
                        </Input>
                        <Label className="placeholder_styling">Condition Of Item</Label>
                      </div>
                    </FormGroup>
                  </Col>
                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          className="form-control"
                          type="datetime-local"
                          name="name"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        />
                      </div>
                    </FormGroup>
                  </Col>
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
                        <Label className="placeholder_styling">
                          Requested By
                        </Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
                <Row>
                  <Col sm="4">
                    <div className="input_wrap">
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Branch Id</Label>
                    </div>
                  </Col>

                  <Col sm="4">
                    <FormGroup>
                      <div className="input_wrap">
                        <Input
                          type="select"
                          name="assigned_to"
                          className="form-control digits"
                          onChange={handleInputChange}
                          onBlur={checkEmptyValue}
                        >
                          <option style={{ display: "none" }}> </option>
                          <option value="">Transfered</option>
                          <option value="">Returned</option>
                          <option value="">Refund</option>
                        </Input>
                        <Label className="placeholder_styling">Status</Label>
                      </div>
                    </FormGroup>
                  </Col>
                </Row>
              
                <br />
                <Row>
                  <Col>
                    <FormGroup className="mb-0" style={{ float: "right" }}>
                    

                      <Button
                        color="btn btn-primary"
                        type="submit"
                        className="mr-3"
                      >
                        Add More
                      </Button>
                    </FormGroup>
                  </Col>
                </Row>
                <br />
              </div>
              <br />
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                    >
                      {Add}
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

export default AddVendor;
