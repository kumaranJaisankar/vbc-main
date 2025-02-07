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

const ManageStock = (props, initialValues) => {
  const [formData, setFormData] = useState({});
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [transferStock, setTransferStock] = useState(false);
  
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

  //users list

  return (
    <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} ref={form}>
              <Row>
                <Button outline color="primary">
                  Exchange
                </Button> &nbsp;&nbsp;
                <Button outline color="primary">
                  Refund
                </Button>&nbsp;&nbsp;
                <Button outline color="primary"
                onClick={()=>setTransferStock(!transferStock)}
                >
                 Transfer the stock
                </Button>
              </Row>
              <br/>
              <Row>
              <Col md="6">
              <Form>
                <input
                  className="form-control"
                  type="text"
                  placeholder="Search With Id "
                  style={{
                    border: "none",
                    backgroundColor: "#f8f8f8",
                  }}
                />
              </Form>
            </Col>
                </Row>
              <br />
              <Row>
              <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Vendor Name</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Vendor Name"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>

                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Branch Name</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Branch Name"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Stock Created Date</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Stock Created Date"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
              </Row>

              <br />
              <Row>
              <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Stock Created By</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Stock Created By"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Stock Updated Date</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Stock Updated Date"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Status</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Status"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <br />
              <Row>
              <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Approved By</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Approved By"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Approved Date</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Approved Date"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
                <Col sm="4">
                <FormGroup>
                    <div className="input_wrap">
                    <Label className="">Purchased By</Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        onBlur={checkEmptyValue}
                        placeholder="Purchased By"
                        readOnly={true}
                      />
                      
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <br />
            
              {transferStock  && 
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
                      <Label className="placeholder_styling">
                         Branch Id
                      </Label>
                    </div>
                  </FormGroup>
                  </Col>
            
              </Row>}
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
                      Submit
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

export default ManageStock;
