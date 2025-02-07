import React, { Fragment, useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
} from "reactstrap";
import axios from "axios";

import { Typeahead } from "react-bootstrap-typeahead";
const AddCombo = () => {
  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

 
  // option
  const [options, setOptions] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.PUBLIC_URL}/api/typeaheadData.json`)
      .then((res) => setOptions(res.data));
  }, []);

  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      ></Input>
                      <Label className="placeholder_styling">
                        Combo Plan Name *
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      />
                      <Label className="placeholder_styling">Plan Cost *</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="H">3M</option>
                        <option value="D">6M</option>
                      </Input>
                      <Label className="placeholder_styling">Validity *</Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="select"
                        name="unit"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                      >
                        <option value="" style={{ display: "none" }}></option>
                        <option value="H">offers1</option>
                        <option value="D"> offers1</option>
                      </Input>
                      <Label className="placeholder_styling">Offers *</Label>
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
                        name="name"
                        className="form-control digits"
                        onBlur={checkEmptyValue}
                        style={{ textTransform: "capitalize" }}
                      ></Input>
                      <Label className="placeholder_styling">Tax *</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <br/>
              <Row>
                <Col>
                  <h5>Internet Plans</h5>
                </Col>
              </Row>
              <br />
              <Row>
              <Col>
                  <Form className="theme-form">
                    <FormGroup>
                      <Typeahead
                        id="multiple-typeahead"
                        clearButton
                        defaultSelected={options.slice(0, 5)}
                        labelKey={"name"}
                        multiple
                        placeholder="Select a plan"
                        options={options}

                      />
                    </FormGroup>
                  </Form>
                </Col>
                {/* <Stack direction="row" sx={{ flex: 1 }}>
                  <Col>
                    <Paper
                      component="div"
                      sx={{
                        p: "2px 4px",
                        display: "flex",
                        alignItems: "center",
                        width: 400,
                      }}
                    >
                      <InputBase
                        sx={{ ml: 1, flex: 1 }}
                        placeholder="Search a plan"
                        inputProps={{ "aria-label": "search google maps" }}
                      />
                      <IconButton
                        type="submit"
                        sx={{ p: "10px" }}
                        aria-label="search"
                      >
                        <SearchIcon />
                      </IconButton>
                    </Paper>
                  </Col>
                </Stack> */}
              </Row>
              <br />
             
              <Row>
                <Col>
                  <h5>IPTV Plans</h5>
                </Col>
              </Row>
              <br />
              <Row>
              <Col>
                  <Form className="theme-form">
                    <FormGroup>
                      <Typeahead
                        id="multiple-typeahead"
                        clearButton
                        defaultSelected={options.slice(0, 5)}
                        labelKey={"name"}
                        multiple
                        placeholder="Select a plan"
                        options={options}

                      />
                    </FormGroup>
                  </Form>
                </Col>
                </Row>
            
              <br /> <br /> <br />
              <Row>
                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      name="autoclose2Toast"
                      color="btn btn-primary"
                      type="button"
                      className="mr-3"
                    >
                      {"Add"}
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
export default AddCombo;
