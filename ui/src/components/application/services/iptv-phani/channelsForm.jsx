import React, { useState, Fragment, useEffect } from "react";
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
// import { broadcasterList } from "./mockdata/broadcastersList";
// import { bouquetList } from "./mockdata/bouquetList";
// import { categoriesList } from "./mockdata/categoryList";
import { iptvaxios } from "../../../../axios";
import MultiSelectDropDown from "./multiselect";
import "antd/dist/antd.css";

const ChannelsForm = (props) => {
  const initialState = {
    type: 0,
    quality: 0,
    status: 1,
    bouquet: [],
    categories: [],
  };
  const [inputs, setInputs] = useState({ ...initialState });
  const [broadcasters, setBroadcasters] = useState([]);
  const [bouquets, setBouquets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selbouquets,setSelectedBouquets] = useState([]);
  const [selcategories,setSelectedCategories] = useState([]);
  const [disabled, setDisabled] = useState(true);

  const Broadcasters = () => {
    iptvaxios
      .get("/api/broadcaster/getBroadcasters")
      .then((res) => setBroadcasters(res.data))
      .catch((err) => console.log(err));
  };

  const Bouquets = () => {
    iptvaxios
      .get("/api/bouquet/getBouquets")
      .then((res) => setBouquets(res.data))
      .catch((err) => console.log(err));
  };

  const Categories = () => {
    iptvaxios
      .get("/api/category/getCategories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    Broadcasters();
    Bouquets();
    Categories();
  }, []);

  useEffect(() => {
    if (inputs.type != 0) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [inputs.type]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setInputs((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    inputs.bouquet = selbouquets.map((value)=>({id:value}));
    inputs.categories = selcategories.map((value)=>({id:value}));
    iptvaxios.post(
      "/api/channel/createChannel",
      inputs
    ).then(
      res=>{
        props.close();
      }
    ).catch(
      err=>console.log(err)
    )
  };

  const resetForm = (event) => {
    event.preventDefault();
    setInputs({ ...initialState });
  };

  function checkEmptyValue(e) {
    if (e.target.value == "") {
      e.target.classList.remove("not-empty");
    } else {
      e.target.classList.add("not-empty");
    }
  }

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
                        name="channelId"
                        value={inputs.channelId || ""}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Channel Id</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="genre"
                        value={inputs.genre || ""}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Genre</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="text"
                        name="language"
                        value={inputs.language || ""}
                        onChange={handleChange}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Language</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="broadcasterId"
                        value={inputs.broadcasterId || ""}
                        onChange={handleChange}
                      >
                        {broadcasters.map((broadcaster) => (
                          <option value={broadcaster.id}>
                            {broadcaster.name}
                          </option>
                        ))}
                      </Input>
                      <Label className="placeholder_styling">Broadcaster</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className="form-control-digits not-empty"
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
                <Col sm="3">
                  <FormGroup>
                    <MultiSelectDropDown
                      data={bouquets}
                      placeholder="Bouquets"
                      setValues={setSelectedBouquets}
                    />
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <MultiSelectDropDown
                      data={categories}
                      placeholder="Categories"
                      setValues={setSelectedCategories}
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        className={`form-control-digits not-empty`}
                        type="select"
                        name="type"
                        value={inputs.type}
                        onChange={handleChange}
                      >
                        <option value={0}>Free</option>
                        <option value={1}>Paid</option>
                      </Input>
                      <Label className="placeholder_styling">Type</Label>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="3">
                  <FormGroup>
                    <div className="input_wrap">
                      <Input
                        type="number"
                        name="price"
                        value={inputs.price}
                        onChange={handleChange}
                        disabled={disabled}
                        onBlur={checkEmptyValue}
                      />
                      <Label className="placeholder_styling">Price</Label>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm="12">
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

                    <Button
                      type="reset"
                      color="btn btn-secondary"
                      id="resetid"
                      onClick={resetForm}
                    >
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
export default ChannelsForm;
