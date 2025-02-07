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
const Addemail = (props,initialValues) => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description:""
  });
  const [inputs, setInputs] = useState(initialValues);
  const [errors, setErrors] = useState({});
//validation
const requiredFields = ["name", "subject","description"];
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
    subject: "",
    description:""
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
    .post("notifications/email", reqData, config
    )
    .then((response) => {
      console.log(response.data);
      props.onUpdate('email');
      resetformmanually();
      toast.success("Email added successfully", {
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
              <Row>
                <Col id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Email Template Name *</Label>
                      <Input
                        type="text"
                        // draft
                        // className={`form-control digits ${formData && formData.notes ? '' : ''}`}
                        // value={formData && formData.notes}
                        name="name"
                        rows="3"
                         onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      />
                    
                    <span className="errortext">{errors.name}</span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>              <Row>
                <Col id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Subject *</Label>
                      <Input
                        type="text"
                        // draft
                        // className={`form-control digits ${formData && formData.notes ? '' : ''}`}
                        // value={formData && formData.notes}
                        name="subject"
                        rows="3"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      />
                    
                    <span className="errortext">{errors.subject}</span>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
                <Row>
                <Col id="moveup">
                  <FormGroup>
                    <div className="input_wrap">
                    <Label className="kyc_label">Description *</Label>
                      <Input
                        type="textarea"
                        // draft
                        // className={`form-control digits ${formData && formData.notes ? '' : ''}`}
                        // value={formData && formData.notes}
                        name="description"
                        rows="8"
                        onChange={handleInputChange}
                        // onBlur={checkEmptyValue}
                      />
                    
                    <span className="errortext">{errors.description}</span>
                    </div>
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

export default Addemail
