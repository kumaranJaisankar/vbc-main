import React, { Fragment, useEffect, useState } from "react";
import {
  Row,
  Col,
  Input,
  Label,
  Container,
  FormGroup,
  Button,
  Form,
} from "reactstrap";
import { iptvaxios } from "../../../../axios";

const BroadcasterForm = (props) => {
    const initialState = {};
  const [inputs, setInputs] = useState({...initialState});
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  function checkEmptyValue(event) {
    if (event.target == "") {
      event.target.classList.remove("not-empty");
    } else {
      event.target.classList.add("not-empty");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(inputs);
    iptvaxios.post(
      "api/broadcaster/createBroadcaster",
      inputs
    ).then(
      res=>{console.log(res)
      props.close()}
    ).catch(
      err=>console.log(err)
    )
  };

  const resetForm = (event) => {
    event.preventDefault();
    setInputs({ ...initialState });
  };
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
          <Form id="myForm">
            <Row>
              <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="name"
                      value={inputs.name || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">Name</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="contactPerson"
                      value={inputs.contactPerson || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">
                      Contact Person
                    </Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="mobile"
                      value={inputs.mobile || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">Mobile No</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="landline"
                      value={inputs.landline || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">LandLine No</Label>
                  </div>
                </FormGroup>
              </Col>
            </Row>
            <Row>
                <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="email"
                      value={inputs.email || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">Email</Label>
                  </div>
                </FormGroup>
                </Col>
                <Col sm="9">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="address"
                      value={inputs.address || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">Address</Label>
                  </div>
                </FormGroup>
                </Col>
            </Row>
            <Row>
            <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="city"
                      value={inputs.city || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">City</Label>
                  </div>
                </FormGroup>
                </Col>
            <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="state"
                      value={inputs.state || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">State</Label>
                  </div>
                </FormGroup>
                </Col>
                <Col sm="3">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="text"
                      name="pincode"
                      value={inputs.pincode || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">PinCode</Label>
                  </div>
                </FormGroup>
                </Col>
            </Row>
            <Row>
            <Col sm="12">
                <FormGroup>
                  <div className="input_wrap">
                    <Input
                      type="textarea"
                      name="description"
                      value={inputs.description || ""}
                      onChange={handleChange}
                      onBlur={checkEmptyValue}
                    />
                    <Label className="placeholder_styling">Description</Label>
                  </div>
                </FormGroup>
                </Col>
            </Row>
            <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                      onClick={handleSubmit}
                    >
                      Add
                    </Button>

                    <Button type="reset" color="btn btn-secondary" id="resetid" onClick={resetForm}>
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
export default BroadcasterForm;
