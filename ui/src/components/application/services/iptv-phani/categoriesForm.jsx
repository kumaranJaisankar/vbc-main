import { getInputAdornmentUtilityClass } from "@mui/material";
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
import MultiSelectDropDown from "./multiselect";

const CategoryForm = (props) => {
  const initialState = { status: 1, channels: [] };
  const [inputs, setInputs] = useState({ ...initialState });
  const [channels, setChannels] = useState([]);
  const [selchannels, setSelectedChannels] = useState([]);
  const Channels = () => {
    iptvaxios
      .get("/api/channel/getChannels")
      .then((res) => setChannels(res.data))
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    Channels();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => {
      return { ...prevState, [name]: value };
    });
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    inputs.channels = selchannels.map((value) => ({ id: value }));
    iptvaxios
      .post("api/category/createCategory", inputs)
      .then((res) => {
        console.log(res);

        props.close();
      })
      .catch((err) => console.log(err));
  };
  function checkEmptyValue(event) {
    if (event.target == "") {
      event.target.classList.remove("not-empty");
    } else {
      event.target.classList.add("not-empty");
    }
  }
  return (
    <Fragment>
      <Container fluid={true}>
        <Row>
          <Col sm="12">
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
                      type="select"
                      name="status"
                      value={inputs.status}
                      onChange={handleChange}
                      className="form-control-digits not-empty"
                    >
                      <option value={1}>Active</option>
                      <option value={0}>Inactive</option>
                    </Input>
                    <Label className="placeholder_styling">Status</Label>
                  </div>
                </FormGroup>
              </Col>
              <Col sm="3">
                <MultiSelectDropDown
                  data={channels}
                  placeholder="Channels"
                  setValues={setSelectedChannels}
                />
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

                  <Button type="reset" color="btn btn-secondary" id="resetid">
                    Reset
                  </Button>
                </FormGroup>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
};
export default CategoryForm;
