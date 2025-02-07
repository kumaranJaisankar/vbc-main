import React, { Fragment, useState, useEffect } from "react";
import {
  Row,
  Col,
  Container,
  Form,
  Label,
  Input,
  FormGroup,
  Button,
} from "reactstrap";
import { iptvaxios } from "../../../../axios";
import { TreeSelect } from "antd";
import "antd/dist/antd.css";

const ChannelDropDown = (props) => {
  const onChange = (value) => {
    props.setChannels([...value]);
  };

  const treeProps = {
    treeData: props.treeData,
    treeCheckable: true,
    allowClear: true,
    fieldNames: { label: "name", value: "id", children: "channels" },
    placeholder: "Please Select",
    style: { width: "50%" },
    DefaultExpandAll: true,
    onChange: onChange,
  };

  return <TreeSelect {...treeProps} />;
};

function BouquetForm(props) {
  const [channels, setChannels] = useState([]);
  const [broadcasters, setBroadCasters] = useState([]);
  const [categories, setCategories] = useState([]);
  const initialState = {
    status: 1,
    bouquetType: "0",
    channels: channels,
  };
  const [inputs, setInputs] = useState({ ...initialState });

  const Broadcasters = () => {
    iptvaxios
      .get("api/broadcaster/getBroadcasters")
      .then((res) => {
        setBroadCasters(res.data);
      })
      .catch((err) => console.log(err));
  };

  const Categories = () => {
    iptvaxios
      .get("api/category/getCategories")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    Categories();
    Broadcasters();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    inputs.channels = channels.map((channel) => ({ id: channel }));
    iptvaxios
      .post("api/bouquet/createBouquet", inputs)
      .then((response) => {
        props.close();
      })
      .catch((error) => console.log(error));
  };

  // const resetForm = (event) => {
  //   setInputs({ ...initialState });
  //   event.preventDefault();
  // };

  function checkEmptyValue(event) {
    if (event.target === "") {
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
            <Form id="myForm">
              <Row>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="name"
                        value={inputs.name || ""}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">
                        Bouquet Name
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="status"
                        value={inputs.status}
                        onChange={handleChange}
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </Input>
                      <Label className="placeholder_styling">Status</Label>
                    </div>
                  </FormGroup>
                </Col>

                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="bouquetType"
                        value={inputs.bouquetType}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      >
                        <option value={"0"}>MSO</option>
                        <option value={"1"}>Broadcaster</option>
                      </Input>
                      <Label className="placeholder_styling">
                        Bouquet Type
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control-digits not-empty"
                        type="select"
                        name="broadcasterId"
                        value={inputs.broadcasterId}
                        hidden={inputs.bouquetType === "0"}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      >
                        {broadcasters &&
                          broadcasters.map((broadcaster) => (
                            <option value={broadcaster.id}>
                              {broadcaster.name}
                            </option>
                          ))}
                      </Input>
                      <Label
                        hidden={inputs.bouquetType === "0"}
                        className="placeholder_styling"
                      >
                        Broadcaster
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="number"
                        name="price"
                        value={inputs.price || ""}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">
                        Monthly Price
                      </Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col md="9">
                  <FormGroup>
                    <Label>Channels</Label>
                    <ChannelDropDown
                      treeData={categories}
                      setChannels={setChannels}
                    />
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

                    <Button type="reset" color="btn btn-secondary" id="resetid">
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
}
export default BouquetForm;
