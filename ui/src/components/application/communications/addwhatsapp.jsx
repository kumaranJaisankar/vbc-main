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
import { campaignaxios } from "../../../axios";
import { toast } from "react-toastify";
import useFormValidation from "../../customhooks/FormValidation";
const Addwhatsapp = (props,initialValues) => {
  const [formData, setFormData] = useState({
    name: "",
    content: "",
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
//validation
const requiredFields = ["name", "content"];
const { validate, Error } = useFormValidation(requiredFields);

useEffect(() => {
  if (!props.rightSidebar) {
    resetformmanually();
    setErrors({});
  }
}, [props.rightSidebar]);
const handleInputChange = (event) => {
  event.persist();
  setInputs((inputs) => ({
    ...inputs,
    [event.target.name]: event.target.value,
  }));
  const target = event.target;
  var value = target.value;
  const name = target.name;
  setFormData((preState) => ({
    ...preState,
    [name]: value,
  }));
 };

 const resetformmanually = () => {
  setFormData({
    name: "",
    content: "",
  });
  document.getElementById("resetid").click();
  document.getElementById("myForm").reset();

};

const submit = (e) => {
  e.preventDefault();
  console.log(formData);

  const validationErrors = validate(formData);
  const noErrors = Object.keys(validationErrors).length === 0;
  setErrors(validationErrors);
  if (noErrors) {
    console.log(formData);
    addSms();
  } else {
    console.log("errors try again", validationErrors);
  }
};
const addSms = () => {
  const reqData = {...formData}
  let config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  console.log(reqData)
  campaignaxios
    .post("notifications/whatsapp", reqData, config
    )
    .then((response) => {
      console.log(response.data);
      props.onUpdate("whatsapp");
      resetformmanually();
      toast.success("WhatsApp Message added successfully", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 1000,
      });
    });

};

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

function checkEmptyValue(e) {
  if (e.target.value == "") {
    e.target.classList.remove("not-empty");
  } else {
    e.target.classList.add("not-empty");
  }
}

  return (
    <div>
     <Fragment>
      <br />
      <Container fluid={true}>
        <Row>
          <Col sm="12">
            <Form onSubmit={submit} id="myForm" onReset={resetForm} >
              <Row>
              </Row>
              <Row style={{marginTop:"-1%"}}>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        WhatsApp Template Name *
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="name"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      />
                    
                    </div>
                    <span className="errortext">{errors.name}</span>
                  </FormGroup>
                </Col>
                <Col sm="4">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">
                        Content for WhatsApp*
                      </Label>
                      <Input
                        className="form-control"
                        type="text"
                        name="content"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      />
                    
                    </div>
                    <span className="errortext">{errors.content}</span>
                  </FormGroup>
                </Col>
              </Row>

              <br />
              <br />

              <Row style={{marginTop:"-7%"}}>
          <span className="sidepanel_border" style={{position:"relative"}}></span>

                <Col>
                  <FormGroup className="mb-0">
                    <Button
                      color="btn btn-primary"
                      type="submit"
                      className="mr-3"
                      onClick={resetInputField}
                      id="create_button"
                      
                    >
                      {"Create"}
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
    </div>
  )
}

export default Addwhatsapp
